# frozen_string_literal: true

require 'test_helper'

class GuestUsersTest < ActionDispatch::IntegrationTest
  # Remember that these controller tests use fixtures instead of the data that is in the database
  # This setup method will be called at the beginning of each test run
  def setup
    Capybara.current_driver = :selenium_chrome
  end

  test 'go to projects page' do
    visit('/posts')
    first('a').click
    page.assert_selector('#login-user-close-button', count: 1)
    # click_link('#login-user-close-button')
  end
end
