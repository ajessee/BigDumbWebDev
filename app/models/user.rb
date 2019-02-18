class User < ApplicationRecord
  # Attributes: name, email, password_digest
  # Virtual attributes: password, password_confirmation (from has_secure_password)

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

  # Class method to return a BCrypt hash of the provided string
  def User.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST : BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end
end
