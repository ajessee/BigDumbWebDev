# frozen_string_literal: true

require 'application_system_test_case'

class UserPasswordResetTest < ApplicationSystemTestCase
  def setup
    ActionMailer::Base.deliveries.clear
  end

  # Happy path
  test 'User can reset their password' do
    andre = users(:one)
    new_password = 'qqqq1111'
    log_in_as(andre, 'bad_password')
    validate_user_bad_login_info_notification_ui
    validate_user_get_reset_form_and_fill(andre)
    validate_user_password_reset_email_notification_ui
    assert_equal 1, ActionMailer::Base.deliveries.size
    reset_password_email = open_email(andre.email)
    reset_password_email.click_link 'here'
    validate_user_password_reset_form_and_fill(new_password)
    assert find('.users-container')
    verify_user_password_reset_success_notification_ui
    assert page.current_path == '/users/' + andre.id.to_s
    andre.reload
    assert andre.authenticate(new_password)
    validate_user_logged_in(andre, false, false)
  end

  # Error paths
  test 'User cannot reset password if they use bad email' do
    andre = users(:one)
    log_in_as(andre, 'bad_password')
    validate_user_bad_login_info_notification_ui
    validate_user_get_reset_form_and_fill(andre, 'bad@email.com')
    validate_user_password_reset_email_failed_notification_ui
    validate_user_logged_out(false, false)
  end

  test 'Inactive user cannot reset password' do
    andre = users(:one)
    log_in_as(andre, 'bad_password')
    validate_user_bad_login_info_notification_ui
    andre.update_attribute(:activated, false)
    andre.save
    validate_user_get_reset_form_and_fill(andre)
    validate_user_password_reset_email_notification_ui
    assert_equal 1, ActionMailer::Base.deliveries.size
    reset_password_email = open_email(andre.email)
    reset_password_email.click_link 'here'
    validate_user_password_reset_user_not_activated_failed_notification_ui
    validate_user_logged_out(false, false)
  end

  test 'User with correct email but wrong reset token cannot reset password' do
    andre = users(:one)
    log_in_as(andre, 'bad_password')
    validate_user_bad_login_info_notification_ui
    validate_user_get_reset_form_and_fill(andre)
    validate_user_password_reset_email_notification_ui
    assert_equal 1, ActionMailer::Base.deliveries.size
    andre.create_reset_digest
    andre.save
    reset_password_email = open_email(andre.email)
    reset_password_email.click_link 'here'
    validate_user_password_reset_user_not_authenticated_failed_notification_ui
    validate_user_logged_out(false, false)
  end

  test 'User cannot change password if password and confirm do not match' do
    andre = users(:one)
    new_password = 'qqqq1111'
    log_in_as(andre, 'bad_password')
    validate_user_bad_login_info_notification_ui
    validate_user_get_reset_form_and_fill(andre)
    sleep 0.2
    assert_equal 1, ActionMailer::Base.deliveries.size
    reset_password_email = open_email(andre.email)
    reset_password_email.click_link 'here'
    validate_user_password_reset_form_and_fill(new_password, nil, 'bad_confirm')
    validate_user_password_reset_form_bad_confirm_error
  end

  test 'User cannot change password if password is blank' do
    andre = users(:one)
    new_password = 'qqqq1111'
    log_in_as(andre, 'bad_password')
    validate_user_bad_login_info_notification_ui
    validate_user_get_reset_form_and_fill(andre)
    sleep 0.2
    assert_equal 1, ActionMailer::Base.deliveries.size
    reset_password_email = open_email(andre.email)
    reset_password_email.click_link 'here'
    validate_user_password_reset_form_and_fill(new_password, '', '')
    validate_user_password_reset_form_empty_password_error
  end

  test 'User with expired reset token cannot reset password' do
    andre = users(:one)
    log_in_as(andre, 'bad_password')
    validate_user_bad_login_info_notification_ui
    validate_user_get_reset_form_and_fill(andre)
    validate_user_password_reset_email_notification_ui
    assert_equal 1, ActionMailer::Base.deliveries.size
    andre.update_attribute(:reset_sent_at, 3.hours.ago)
    andre.save
    reset_password_email = open_email(andre.email)
    reset_password_email.click_link 'here'
    validate_user_password_reset_user_token_expired_failed_notification_ui
    validate_user_logged_out(false, false)
  end
end
