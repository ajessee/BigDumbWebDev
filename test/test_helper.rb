# frozen_string_literal: true

ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'
require 'minitest/reporters'
require 'capybara/rails'
require 'capybara/minitest'

Minitest::Reporters.use! [Minitest::Reporters::ProgressReporter.new(color: true)]
# Minitest::Reporters.use! [Minitest::Reporters::DefaultReporter.new(color: true)]
# Minitest::Reporters.use! [Minitest::Reporters::SpecReporter.new(color: true)]

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers - using more than one was crashing capybara
  # parallelize(workers: :number_of_processors)
  parallelize(workers: 1)

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  def logged_in?
    !session[:user_id].nil?
  end
  
  def log_in_as(user)
    session[:user_id] = user.id
  end

  def logout
    session.delete(:user_id)
  end
end

class ActionDispatch::IntegrationTest
  # Make `assert_*` methods behave like Minitest assertions
  include Capybara::DSL
  include Capybara::Minitest::Assertions

  Capybara.register_driver :selenium_chrome do |app|
    Capybara::Selenium::Driver.new(app, browser: :chrome)
  end

  # Capybara.current_driver = :selenium_chrome
  # If you want to test in production, you can add this to the setup method in individual tests
  # Capybara.run_server = false
  # Capybara.app_host = 'http://www.bigdumbweb.dev'

  # Reset sessions and driver between tests
  teardown do
    Capybara.reset_sessions!
    Capybara.use_default_driver
  end

  # Integration test helper methods:

  def verify_and_decrypt_session_cookie(cookie, secret_key_base = Rails.application.secret_key_base)
    config = Rails.application.config
    cookie = CGI.unescape(cookie)
    salt   = config.action_dispatch.authenticated_encrypted_cookie_salt
    encrypted_cookie_cipher = config.action_dispatch.encrypted_cookie_cipher || 'aes-256-gcm'
    # serializer = ActiveSupport::MessageEncryptor::NullSerializer # use this line if you don't know your serializer
    serializer = ActionDispatch::Cookies::JsonSerializer

    key_generator = ActiveSupport::KeyGenerator.new(secret_key_base, iterations: 1000)
    key_len = ActiveSupport::MessageEncryptor.key_len(encrypted_cookie_cipher)
    secret = key_generator.generate_key(salt, key_len)
    encryptor = ActiveSupport::MessageEncryptor.new(secret, cipher: encrypted_cookie_cipher, serializer: serializer)

    session_key = config.session_options[:key].freeze
    encryptor.decrypt_and_verify(cookie, purpose: "cookie.#{session_key}")
  end
end
