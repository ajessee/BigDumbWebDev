# frozen_string_literal: true

ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'
require 'minitest/reporters'
require 'webdrivers'

Minitest::Reporters.use! [Minitest::Reporters::ProgressReporter.new(color: true)]
# Minitest::Reporters.use! [Minitest::Reporters::DefaultReporter.new(color: true)]
# Minitest::Reporters.use! [Minitest::Reporters::SpecReporter.new(color: true)]

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers - using more than one was crashing capybara
  # parallelize(workers: :number_of_processors)
  parallelize(workers: 1)

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # def logged_in?
  #   !session[:user_id].nil?
  # end
  
  # def log_in_as(user)
  #   session[:user_id] = user.id
  # end

  # def logout
  #   session.delete(:user_id)
  # end
end

class ActionDispatch::IntegrationTest
  # Make `assert_*` methods behave like Minitest assertions
  # Integration test helper methods:
end
