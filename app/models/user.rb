class User < ApplicationRecord
  attr_accessor :remember_token
  # Attributes: name, email, password_digest
  # Virtual attributes: password, password_confirmation (from has_secure_password), remember_token

  # Pagination per page
  self.per_page = 15

  # before_save is a callback that gets invoked before the user model is saved to the database, we downcase it here to ensure uniqueness
  before_save { email.downcase! }

  # Regex to test email validity
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i

  # Model validation constraints that are run on save
  validates :name, presence: true, length: {maximum: 50}
  validates :email, presence: true, length: {maximum: 255}, uniqueness: { case_sensitive: false }, format: { with: VALID_EMAIL_REGEX }
  validates :password, length: {minimum: 8}, allow_nil: true

  # The has_secure_password method adds the following functionality to the user model:
  # The ability to save a securely hashed password_digest attribute to the database
  # A pair of virtual attributes (password and password_confirmation), including presence validations upon object creation and a validation requiring that they match
  # An authenticate method that returns the user when the password is correct (and false otherwise)
  has_secure_password

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

  # Instance method to test if the provided remember_token matches the hashed digest in the database
  def authenticated?(remember_token)
    return false if remember_digest.nil?
    BCrypt::Password.new(remember_digest).is_password?(remember_token)
  end

  # This is an idomatic way to define class methods in Ruby. The 'self' is the user class, and it allows you to define methods without having to prepend them with 'User.' or 'self.'
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
