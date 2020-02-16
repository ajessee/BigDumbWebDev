# frozen_string_literal: true

require 'application_system_test_case'

class UserIndexTest < ApplicationSystemTestCase
  def setup
    @andre = users(:one)
    @natalya = users(:three)
    @non_admin_info = create_user_info_no_comment
    @non_admin = User.create!(first_name: @non_admin_info[:first_name], last_name: @non_admin_info[:last_name], email: @non_admin_info[:email], password: @non_admin_info[:password], password_confirmation: @non_admin_info[:password_confirmation])
  end

  test 'Login as admin user and delete non admin user' do
    log_in_as(@andre, Rails.application.credentials.dig(:password, :admin_user_password))
    validate_user_logged_in(@andre)
    visit(users_path)
    assert find('#users-show-partial')
    existing_user_count = User.count
    assert find('a', text: @natalya.name).sibling('a', text: 'delete').click
    page.accept_confirm
    assert find('p.notifications-message', text: "#{@natalya.name} successfully deleted.")
    new_user_count = User.count
    assert new_user_count == existing_user_count - 1
  end

  test 'index as non-admin' do
    log_in_as(@non_admin, @non_admin_info[:password])
    visit(users_path)
    assert find('section.http-error-container')
    assert find('p', text: 'Only admin users are allowed to do that')
    assert find('h3', text: 'HTTP Status Code: 403')
    assert page.current_path == '/errors/forbidden'
    assert find('a', text: 'Take Me Home').click
    assert page.current_path == '/'
  end
end
