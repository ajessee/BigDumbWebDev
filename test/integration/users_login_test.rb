# frozen_string_literal: true

require 'test_helper'

class UsersLoginTest < ActionDispatch::IntegrationTest
  # Remember that these controller tests use fixtures instead of the data that is in the database
  # This setup method will be called at the beginning of each test run
  def setup
    # This uses the 'users' hash setup in the users.yml file
    @david = users(:david)
  end

  test 'Log in with valid credentials and then log out' do
    get login_path, xhr: true
    # check that we get javascript back
    assert_equal 'text/javascript; charset=utf-8', @response.content_type
    post login_path, xhr: true, params: { session: { email: 'david@tengoodyears.com', password: 'password' } }
    assert is_logged_in?
    # TODO: Figure out how to test for elements on the larger page. Assert select can only access the response
    delete logout_path
    # Since the delete HTTP request is not XHR, I get all the HTML back and can test it for elements
    assert_not is_logged_in?
    assert_redirected_to root_url
    # Simulate a user clicking logout in a second window.
    delete logout_path
    follow_redirect!
    assert_select 'a[href=?]', login_path
    assert_select 'a[href=?]', logout_path, count: 0
  end

  test 'Log in with invalid credentials' do
    get login_path, xhr: true
    # check that we get javascript back
    assert_equal 'text/javascript; charset=utf-8', @response.content_type
    # and that we get the correct js.erb template
    assert_template 'sessions/new'
    # post invalid credentials
    post login_path, xhr: true, params: { session: { email: '', password: '' } }
    # we get same new js.erb template back
    assert_template 'sessions/new'
    # which renders the html template
    assert_template 'sessions/_new'
    # TODO: Figure out how to test for elements on the larger page. Assert select can only access the response
  end

  test 'login with remembering' do
    log_in_as(@david, remember_me: '1')
    assert_equal cookies[:remember_token], assigns(:user).remember_token
  end

  test 'login without remembering' do
    # Log in and verify that the cookie is nil
    log_in_as(@david, remember_me: '0')
    assert_nil cookies[:remember_token]
  end
end
