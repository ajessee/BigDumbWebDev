# frozen_string_literal: true

require 'application_system_test_case'

class UserEditTest < ApplicationSystemTestCase
  def setup
    @new_user_info = create_user_info
    @new_user_updated_info = create_user_info
    @natalya = users(:three)
    @new_user = User.create!(first_name: @new_user_info[:first_name], last_name: @new_user_info[:last_name], email: @new_user_info[:email], details: @new_user_info[:details], password: @new_user_info[:password], password_confirmation: @new_user_info[:password_confirmation], activated: true)
  end

  # Happy paths
  test 'User can login, update user data' do
    log_in_as(@new_user, @new_user_info[:password])
    validate_user_logged_in(@new_user)
    visit user_path(@new_user)
    verify_user_show_data_ui(@new_user)
    assert find('#edit-user-data-button').click
    verify_user_sign_up_or_edit_form_ui(nil, true)
    fill_in_and_submit_user_edit_form(@new_user_updated_info)
    @new_user.reload
    # verify ui
    verify_user_edit_success_notification_ui
    verify_user_show_data_ui(@new_user)
    # verify db
    assert @new_user.first_name == @new_user_updated_info[:first_name]
    assert @new_user.last_name == @new_user_updated_info[:last_name]
    assert @new_user.email == @new_user_updated_info[:email]
    assert @new_user.authenticate(@new_user_updated_info[:password])
  end

  # Happy paths
  test 'User can login, update user about me' do
    log_in_as(@new_user, @new_user_info[:password])
    validate_user_logged_in(@new_user)
    visit user_path(@new_user)
    verify_user_show_data_ui(@new_user)
    verify_user_show_details_ui(@new_user, @new_user_info)
    verify_user_edit_success_notification_ui
  end

  test 'User can login, update user picture' do
    log_in_as(@new_user, @new_user_info[:password])
    validate_user_logged_in(@new_user)
    visit user_path(@new_user)
    verify_user_show_data_ui(@new_user)
    verify_user_show_details_ui(@new_user, @new_user_info)
    verify_user_show_picture_ui(@new_user)
  end

  # Error paths
  test 'User details cannot be updated if user not logged in' do
    visit user_path(@new_user)
    forbidden_user_not_logged_in
  end

  test 'User details cannot be updated wrong user' do
    log_in_as(@new_user, @new_user_info[:password])
    validate_user_logged_in(@new_user)
    visit user_path(@natalya)
    forbidden_incorrect_user
  end
end
