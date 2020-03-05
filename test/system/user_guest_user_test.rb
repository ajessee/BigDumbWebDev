# frozen_string_literal: true

require 'application_system_test_case'

class UsersGuestsTest < ApplicationSystemTestCase
  # Happy path
  test 'Create guest comment with first and last name and comment' do
    guest = create_user_info_with_comment
    go_to_first_post
    open_comment_section
    verify_comment_form_elements_ui
    fill_and_submit_comment(guest)
    verify_comment_created_correctly_ui(guest)
    guest_user = pull_latest_user_from_database
    comment = pull_guest_comment_from_database(guest_user)
    validate_guest_user(guest, guest_user)
    validate_comment_text(guest, comment)
  end

  # Error cases
  test 'Create guest comment with no first or last name provided' do
    guest = create_user_info_with_missing_first_and_last_name
    go_to_first_post
    open_comment_section
    verify_comment_form_elements_ui
    assert find('trix-editor').click.set(guest[:comment])
    assert find('#new-comment-submit-button').click
    assert find('div.show-comment-body', text: 'Anonymous User')
    assert find('div.trix-content', text: guest[:comment])
    guest_user = pull_latest_user_from_database
    comment = pull_guest_comment_from_database(guest_user)
    assert guest_user.first_name == 'Anonymous'
    assert guest_user.last_name == 'User'
    assert guest_user.guest_1?
    validate_comment_text(guest, comment)
  end

  test 'Create guest comment with first and last name and comment, then sign up for full user account' do
    guest = create_user_info_with_comment
    go_to_first_post
    open_comment_section
    verify_comment_form_elements_ui
    fill_and_submit_comment(guest)
    verify_comment_created_correctly_ui(guest)
    guest_user = pull_latest_user_from_database
    comment = pull_guest_comment_from_database(guest_user)
    validate_guest_user(guest, guest_user)
    validate_comment_text(guest, comment)
    open_comment_section
    open_sign_up_section(true)
    verify_returning_guest_user_notification_ui
    verify_user_sign_up_or_edit_form_ui(guest)
    fill_in_and_submit_user_signup_form(guest, false)
    verify_user_sign_up_submit_notification_ui
    new_user = pull_user_from_database(guest)
    validate_new_user(guest, new_user)
  end

  test 'Create guest comment with first and last name and comment, then sign up for full user account with bad email' do
    guest = create_user_info_with_comment
    go_to_first_post
    open_comment_section
    verify_comment_form_elements_ui
    fill_and_submit_comment(guest)
    verify_comment_created_correctly_ui(guest)
    guest_user = pull_latest_user_from_database
    comment = pull_guest_comment_from_database(guest_user)
    validate_guest_user(guest, guest_user)
    validate_comment_text(guest, comment)
    open_comment_section
    open_sign_up_section(true)
    verify_returning_guest_user_notification_ui
    fill_in_and_submit_user_signup_form(guest, false, nil, nil, 'a!@c.com')
    assert find('span.error_explanation', text: 'Email is invalid')
  end

  test 'Create guest comment with first and last name and comment, then sign up for full user account with bad password' do
    guest = create_user_info_with_comment
    go_to_first_post
    open_comment_section
    verify_comment_form_elements_ui
    fill_and_submit_comment(guest)
    verify_comment_created_correctly_ui(guest)
    guest_user = pull_latest_user_from_database
    comment = pull_guest_comment_from_database(guest_user)
    validate_guest_user(guest, guest_user)
    validate_comment_text(guest, comment)
    open_comment_section
    open_sign_up_section(true)
    verify_returning_guest_user_notification_ui
    fill_in_and_submit_user_signup_form(guest, false, nil, nil, nil, 'short')
    assert find('span.error_explanation', text: 'Password is too short')
  end

  test 'Create guest comment with first and last name and comment, then sign up for full user account with bad confirmation' do
    guest = create_user_info_with_comment
    go_to_first_post
    open_comment_section
    verify_comment_form_elements_ui
    fill_and_submit_comment(guest)
    verify_comment_created_correctly_ui(guest)
    guest_user = pull_latest_user_from_database
    comment = pull_guest_comment_from_database(guest_user)
    validate_guest_user(guest, guest_user)
    validate_comment_text(guest, comment)
    open_comment_section
    open_sign_up_section(true)
    verify_returning_guest_user_notification_ui
    fill_in_and_submit_user_signup_form(guest, false, nil, nil, nil, 'goodpassword', 'nomatch')
    assert find('span.error_explanation', text: 'Password confirmation doesn\'t match Password')
  end
end
