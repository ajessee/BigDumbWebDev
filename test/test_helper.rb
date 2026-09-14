# frozen_string_literal: true

ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'
require 'minitest/reporters'

Minitest::Reporters.use! [Minitest::Reporters::ProgressReporter.new(color: true)]

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers - using more than one was crashing capybara
  # parallelize(workers: :number_of_processors)

  Capybara.default_max_wait_time = 10
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all
end

class ActionDispatch::IntegrationTest
  # Make `assert_*` methods behave like Minitest assertions

  # Integration test helper methods:
  def logged_in?
    !session[:user_id].nil?
  end

  def login_as(user, password)
    # Directly poking session[:user_id] doesn't work here: ActionDispatch::IntegrationTest
    # only commits session state back out through a real response's Set-Cookie header, so
    # a later request wouldn't see it. Log in for real, the same way the UI's login modal
    # does (an XHR POST - SessionsController#create only has a format.js branch).
    post login_path, params: { session: { email: user.email, password: password } }, xhr: true
  end

  def logout
    session.delete(:user_id)
  end
end
