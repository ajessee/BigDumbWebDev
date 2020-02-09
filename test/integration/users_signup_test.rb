# frozen_string_literal: true

require 'test_helper'

class UsersSignupTest < ActionDispatch::IntegrationTest
  # Remember that these controller tests use fixtures instead of the data that is in the database

  def setup
    ActionMailer::Base.deliveries.clear
  end

  test 'valid signup information with account activation' do
    get signup_path, xhr: true
    assert_difference 'User.count', 1 do # the 1 is a second argument to assert_difference that specifies size of difference
      post users_path, xhr: true, params: { user: {
        first_name: 'First',
        last_name: 'McLucky',
        email: 'first@mclucky.com',
        password: 'password',
        password_confirmation: 'password'
      } }
    end
    assert_equal 1, ActionMailer::Base.deliveries.size
    user = assigns(:user)
    assert_not user.activated?
    # Try to log in before activation.
    log_in_as(user)
    assert_not is_logged_in?
    # Invalid activation token
    get edit_account_activation_path('invalid token', email: user.email)
    assert_not is_logged_in?
    # Valid token, wrong email
    get edit_account_activation_path(user.activation_token, email: 'wrong')
    assert_not is_logged_in?
    # Valid activation token
    get edit_account_activation_path(user.activation_token, email: user.email)
    assert user.reload.activated?
    follow_redirect!
    assert_template 'users/show'
    assert is_logged_in?
  end

  test 'Invalid signup information' do
    get signup_path, xhr: true
    assert_no_difference 'User.count' do
      post signup_path, xhr: true, params: { user: {
        first_name: '',
        last_name: 'thing',
        email: 'try@again',
        password: 'not',
        password_confirmation: 'real'
      } }
    end
    # Sending XHR POST request to users_path and asserting that we are getting javascript back and the new users partial
    assert_equal 'text/javascript; charset=utf-8', @response.content_type
    assert_template 'users/_new'
    assert_template 'shared/_single_user_error_message'
  end
end
