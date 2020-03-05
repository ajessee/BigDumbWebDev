# frozen_string_literal: true

require 'application_system_test_case'

class UserSignupsTest < ApplicationSystemTestCase
  def setup
    ActionMailer::Base.deliveries.clear
  end

  # Happy path
  test 'User signup and account activation succeed when valid signup information input and user clicks link in signup email' do
    new_user = create_user_info
    visit(root_path)
    open_sign_up_section(false)
    verify_user_sign_up_or_edit_form_ui
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
  end

  # Error cases
  test 'Account activation fails when passed invalid activation token' do
    new_user = create_user_info
    visit(root_path)
    open_sign_up_section(false)
    verify_user_sign_up_or_edit_form_ui
    fill_in_and_submit_user_signup_form(new_user)
    verify_user_sign_up_submit_notification_ui
    assert_equal 1, ActionMailer::Base.deliveries.size
    user = pull_latest_user_from_database
    assert_not user.activated?
    # change activation token
    user.create_activation_digest
    user.save
    current_email = open_email(user.email)
    current_email.click_link 'here'
    assert find('#main-body-container')
    assert page.current_path == '/'
    verify_user_sign_up_invalid_activation_link_ui
    assert_not user.reload.activated?
    session_cookie_decrypt = fetch_session_cookie
    assert_not session_cookie_decrypt['user_id']
  end

  test 'Account activation fails when user email changes' do
    new_user = create_user_info
    visit(root_path)
    open_sign_up_section(false)
    verify_user_sign_up_or_edit_form_ui
    fill_in_and_submit_user_signup_form(new_user)
    verify_user_sign_up_submit_notification_ui
    assert_equal 1, ActionMailer::Base.deliveries.size
    user = pull_latest_user_from_database
    assert_not user.activated?
    current_email = open_email(user.email)
    # change user.email
    user.email = 'bad@email.com'
    user.save
    current_email.click_link 'here'
    assert find('#main-body-container')
    assert page.current_url == "http://localhost:#{Capybara.server_port}/"
    verify_user_sign_up_invalid_activation_link_ui
    assert_not user.reload.activated?
    session_cookie_decrypt = fetch_session_cookie
    assert_not session_cookie_decrypt['user_id']
  end

  test 'User signup fails when all fields blank input' do
    new_user = create_user_info_with_everything_blank
    visit(root_path)
    open_sign_up_section(false)
    verify_user_sign_up_or_edit_form_ui
    fill_in_and_submit_user_signup_form(new_user)
    assert page.find('input#user_email').native.attribute('validationMessage') == 'Please fill out this field.'
    assert page.find('input#user_password').native.attribute('validationMessage') == 'Please fill out this field.'
    assert page.find('input#user_password_confirmation').native.attribute('validationMessage') == 'Please fill out this field.'
  end

  test 'User signup fails when no email input' do
    new_user = create_user_info_with_missing_email
    visit(root_path)
    open_sign_up_section(false)
    verify_user_sign_up_or_edit_form_ui
    fill_in_and_submit_user_signup_form(new_user)
    assert page.find('input#user_email').native.attribute('validationMessage') == 'Please fill out this field.'
  end

  test 'User signup fails when bad email input' do
    new_user = create_user_info_with_invalid_email
    visit(root_path)
    open_sign_up_section(false)
    verify_user_sign_up_or_edit_form_ui
    fill_in_and_submit_user_signup_form(new_user)
    assert find('span.error_explanation', text: 'Email is invalid')
  end

  test 'User signup fails when no password input' do
    new_user = create_user_info_with_missing_password
    visit(root_path)
    open_sign_up_section(false)
    verify_user_sign_up_or_edit_form_ui
    fill_in_and_submit_user_signup_form(new_user)
    assert page.find('input#user_password').native.attribute('validationMessage') == 'Please fill out this field.'
  end

  test 'User signup fails when bad password input' do
    new_user = create_user_info_with_invalid_password
    visit(root_path)
    open_sign_up_section(false)
    verify_user_sign_up_or_edit_form_ui
    fill_in_and_submit_user_signup_form(new_user)
    assert find('span.error_explanation', text: 'Password is too short (minimum is 8 characters)')
  end

  test 'User signup fails when bad password input and non matching confirmation input' do
    new_user = create_user_info_with_invalid_password
    visit(root_path)
    open_sign_up_section(false)
    verify_user_sign_up_or_edit_form_ui
    fill_in_and_submit_user_signup_form(new_user, true, nil, nil, nil, nil, 'notamatch1')
    assert find('span.error_explanation', text: 'Password is too short (minimum is 8 characters)')
    assert find('span.error_explanation', text: 'Password confirmation doesn\'t match Password')
  end

  test 'User signup fails when good password input but bad confirmation input' do
    new_user = create_user_info
    visit(root_path)
    open_sign_up_section(false)
    verify_user_sign_up_or_edit_form_ui
    fill_in_and_submit_user_signup_form(new_user, true, nil, nil, nil, nil, 'notamatch1')
    assert find('span.error_explanation', text: 'Password confirmation doesn\'t match Password')
  end

  test 'User signup fails when no confirmation input' do
    new_user = create_user_info
    visit(root_path)
    open_sign_up_section(false)
    verify_user_sign_up_or_edit_form_ui
    fill_in_and_submit_user_signup_form(new_user, true, nil, nil, nil, nil, '')
  end
end
