# frozen_string_literal: true

require 'application_system_test_case'

class UserSignupsTest < ApplicationSystemTestCase
  def setup
    ActionMailer::Base.deliveries.clear
  end

  test 'valid signup information with account activation' do
    new_user = create_user_info
    visit('/')
    open_sign_up_section(false)
    verify_guest_user_sign_up_form_ui
    fill_in_and_submit_user_signup_form(new_user)
    verify_user_sign_up_submit_notification_ui
    assert_equal 1, ActionMailer::Base.deliveries.size
    user = pull_latest_user_from_database
    assert_not user.activated?
    # Try to log in before activation.
    log_in_as(user, new_user[:password])
    validate_user_account_not_activated_notification_ui
    session_cookie_decrypt = fetch_session_cookie
    assert_not session_cookie_decrypt['user_id']
    current_email = open_email(user.email)
    current_email.click_link 'here'
    assert find('div.users-container')
    assert user.reload.activated?
    verify_user_sign_up_success_notification_ui(user)
    session_cookie_decrypt = fetch_session_cookie
    assert session_cookie_decrypt['user_id']
    # TODO: - Change activation token and email to test unsucessful activation
    # # Invalid activation token
    # visit(edit_account_activation_path('invalid token', email: user.email, id: user.id))
    # # get edit_account_activation_path('invalid token', email: user.email)
  end

  # test 'Invalid signup information' do
  #   get signup_path, xhr: true
  #   assert_no_difference 'User.count' do
  #     post signup_path,
  #          xhr: true,
  #          params: { user: {
  #            first_name: '',
  #            last_name: 'thing',
  #            email: 'try@again',
  #            password: 'not',
  #            password_confirmation: 'real'
  #          } }
  #   end
  #   # Sending XHR POST request to users_path and asserting that we are getting javascript back and the new users partial
  #   assert_equal 'text/javascript; charset=utf-8', @response.content_type
  #   assert_template 'users/_new'
  #   assert_template 'shared/_single_user_error_message'
  # end
end
