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
  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

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

  # Log in as a particular user.
  def log_in_as(user, password: 'password', remember_me: '1')
    post login_path,
         xhr: true,
         params: { session:
               {
                 email: user.email,
                 password: password,
                 remember_me: remember_me
               } }
  end
end
