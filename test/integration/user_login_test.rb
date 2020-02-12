# frozen_string_literal: true

require 'cgi'
require 'json'
require 'active_support'
require 'openssl'

require 'test_helper'

class UsersLoginTest < ActionDispatch::IntegrationTest
  # Remember that these controller tests use fixtures instead of the data that is in the database
  # This setup method will be called at the beginning of each test run
  fixtures :users

  def setup
    Capybara.current_driver = :selenium_chrome
  end

  test 'Log in with valid credentials and then log out' do
    andre = users(:one)
    login_as(andre, Rails.application.credentials.dig(:password, :admin_user_password))
    validate_user_logged_in(andre)
    logout
    validate_user_logged_out
  end

  test 'Log in with invalid credentials' do
    andre = users(:one)
    login_as(andre, 'bad_password')
    validate_user_logged_in_failed
  end

  test 'login with remembering and then log out' do
    andre = users(:one)
    login_as(andre, Rails.application.credentials.dig(:password, :admin_user_password), true)
    validate_user_logged_in(andre, true)
    logout
    validate_user_logged_out(true)
  end

  def login_as(user, password, remember = false)
    visit(login_path)
    assert find('div.modal-content')
    assert find('form#login-user')
    assert find('input#session_email')
    assert find('input#session_password')
    assert fill_in 'session[email]', with: user.email
    assert fill_in 'session[password]', with: password
    assert find('div.slider.round').click if remember
    assert find('#login-user-submit-button').click
  end

  def validate_user_logged_in(user, remember = false)
    assert find('p.notifications-message', text: 'You\'ve been logged in to your account.')
    session_cookie = page.driver.browser.manage.cookie_named('_big_dumb_web_dev_session')[:value]
    session_cookie_decrypt = verify_and_decrypt_session_cookie(session_cookie)
    assert User.find(session_cookie_decrypt['user_id']) == user
    if remember
      assert page.driver.browser.manage.cookie_named('remember_token')
      assert page.driver.browser.manage.cookie_named('user_id')
    end
  end

  def validate_user_logged_in_failed
    assert find('p.notifications-message', text: 'That is an invalid email / password combination. Please try again')
    assert find('div.modal-content')
    assert find('form#login-user')
    email_input_field = find('input#session_email')
    password_input_field = find('input#session_password')
    assert email_input_field.value == ''
    assert password_input_field.value == ''
    session_cookie_decrypt = fetch_session_cookie
    assert_not session_cookie_decrypt['user_id']
  end

  def logout
    assert find('div#blog-icon').click
    assert find('button#nav-button').click
    assert find('li#nav-menu-logout').find('a').click
  end

  def validate_user_logged_out(remember = false)
    assert find('p.notifications-message', text: 'You\'ve been successfully logged out of your account')
    session_cookie_decrypt = fetch_session_cookie
    assert_not session_cookie_decrypt['user_id']
    if remember
      assert page.driver.browser.manage.all_cookies.select { |cookie| cookie[:name] == 'remember_token' }.empty?
      assert page.driver.browser.manage.all_cookies.select { |cookie| cookie[:name] == 'user_id' }.empty?
    end
  end

  def fetch_session_cookie
    session_cookie = page.driver.browser.manage.cookie_named('_big_dumb_web_dev_session')[:value]
    verify_and_decrypt_session_cookie(session_cookie)
  end
end
