# frozen_string_literal: true

class User < ApplicationRecord
  enum role: %i[guest_1 guest_2 user admin]
  has_many :posts, dependent: :destroy
  has_many :projects, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  has_one_attached :image
  has_rich_text :details
  attr_accessor :remember_token, :activation_token, :reset_token
  # Attributes: first_name, last_name, email, details, picture, password_digest
  # Virtual attributes: password, password_confirmation (from has_secure_password), remember_token, activation_token, reset_token, name

  # before_create is a callback that gets invoked before the user model is created
  before_create :create_activation_digest
  # after initialize is a callback that get invoked after user model is created but before written to database
  after_initialize :set_default_role, if: :new_record?
  # before_save is a callback that gets invoked before the user model is saved to the database
  before_save :downcase_email
  before_save :set_default_name

  # Regex to test email validity
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i.freeze

  # Model validation constraints that are run on save
  validates :first_name, length: { maximum: 50 }
  validates :last_name, length: { maximum: 50 }
  validates :email, presence: true, length: { maximum: 255 }, uniqueness: { case_sensitive: false }, format: { with: VALID_EMAIL_REGEX }
  validates :password, length: { minimum: 8 }, allow_nil: true

  # The has_secure_password method adds the following functionality to the user model:
  # The ability to save a securely hashed password_digest attribute to the database
  # A pair of virtual attributes (password and password_confirmation), including presence validations upon object creation and a validation requiring that they match
  # An authenticate method that returns the user when the password is correct (and false otherwise)
  has_secure_password

  # Instance method to return users full name
  def name
    first_name + ' ' + last_name
  end

  # Instance method to store an encrypted remember token in the database in the remember_digest column
  def remember
    # Set internal object property remember token to a new unique string of random letters and numbers
    self.remember_token = User.new_token
    # Update remember_digest column in database with token
    update_attribute(:remember_digest, User.digest(remember_token))
  end

  # Instance method to forget a user by nilling-out remember_digest attribute
  def forget
    update_attribute(:remember_digest, nil)
  end

  # Instance method to test if the provided token matches the hashed digest in the database
  def authenticated?(attribute, token)
    digest = send("#{attribute}_digest")
    return false if digest.nil?

    BCrypt::Password.new(digest).is_password?(token)
  end

  # Instance method to activate an account.
  def activate
    update_columns(activated: true, activated_at: Time.zone.now)
  end

  # Instance method to set the password reset attributes.
  def create_reset_digest
    self.reset_token = User.new_token
    update_columns(reset_digest: User.digest(reset_token), reset_sent_at: Time.zone.now)
  end

  # Instance method to send activation email.
  def send_activation_email
    UserMailer.account_activation(self).deliver_now
  end

  # Instance method to send password reset email.
  def send_password_reset_email
    UserMailer.password_reset(self).deliver_now
  end

  # Instance method to check if password reset email is expired.
  def password_reset_expired?
    reset_sent_at < 15.minutes.ago
  end

  # Instance method to check if guest user has updated the default first name
  def guest_first_name_updated?
    first_name != 'Anonymous'
  end

  # Instance method to check if guest user has updated the default last name
  def guest_last_name_updated?
    last_name != 'User'
  end

  # Instance method to check if guest user has updated the randomly assigned guest email (they've created an account)
  def guest_email_updated?
    !(email.starts_with?('guest_') && email.ends_with?('@bigdumbweb.dev'))
  end

  # Instance method to check if guest user has updated the default password
  def guest_password_updated?
    !authenticate(Rails.application.credentials.dig(:password, :guest_user_password))
  end

  # Instance method to remove the guest email from permanent cookie and convert guest user to regular user
  def convert_from_guest_account(cookies)
    if guest_2?
      if cookies.permanent.signed[:guest_user_email]
        cookies.delete :guest_user_email
      end
      user!
    end
  end

  # Instance method to set default user role
  def set_default_role
    self.role ||= :user
  end

  # Creates and assigns the activation token and digest.
  def create_activation_digest
    self.activation_token  = User.new_token
    self.activation_digest = User.digest(activation_token)
  end

  # Get user IP address from request 
  def fetch_ip(request)
    # TODO: Not saving this to the database. I kinda like that. Should I save this info? If not, get rid of column in DB and turn into instance variable
    if Rails.env.production?
      self.ip_address = request.remote_ip
    else
      self.ip_address = Net::HTTP.get(URI.parse('http://checkip.amazonaws.com/')).squish
    end
    @location_info ||= Geocoder.search(self.ip_address).first
  end

  # Guess the users city
  def guess_city
    @location_info.city
  end
  # Guess the users region
  def guess_region
    @location_info.region
  end
  # Guess the users country
  def guess_country
    @location_info.country
  end
  # Guess the users address
  def guess_address
    @location_info.address
  end

  private

  # Converts email to all lower-case.
  def downcase_email
    self.email = email.downcase
  end

  # Set default name if no name given
  def set_default_name
    if first_name.empty? && last_name.empty?
      self.first_name = 'Anonymous' if first_name.empty?
      self.last_name = 'User' if last_name.empty?
    end
  end

  # This is an idiomatic way to define class methods in Ruby. The 'self' is the user class, and it allows you to define methods without having to prepend them with 'User.' or 'self.'
  class << self
    # Class method to return a BCrypt hash of the provided string
    def digest(string)
      cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST : BCrypt::Engine.cost
      BCrypt::Password.create(string, cost: cost)
    end

    # Class method to return a new 'token' - a unique string of random letters and numbers that is URL safe
    def new_token
      SecureRandom.urlsafe_base64
    end
  end
end
