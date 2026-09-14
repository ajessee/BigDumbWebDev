# frozen_string_literal: true

require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest
  # Remember that these controller tests use fixtures instead of the data that is in the database
  def setup
    @andre = users(:one)
    @natalya = users(:three)
    @natalya_password = 'password' # matches test/fixtures/users.yml
  end

  test 'should redirect edit to unauthorized path when not logged in' do
    get edit_user_path(@andre)
    assert_redirected_to errors_unauthorized_path
  end

  test 'should redirect update to unauthorized path when not logged in' do
    patch user_path(@andre),
          params: { user: { first_name: @andre.first_name,
                             last_name: @andre.last_name,
                             email: @andre.email } }
    assert_redirected_to errors_unauthorized_path
  end

  test 'should redirect edit to forbidden path when logged in as wrong user' do
    login_as(@natalya, @natalya_password)
    get edit_user_path(@andre)
    assert_redirected_to errors_forbidden_path
  end

  test 'should redirect update to forbidden path when logged in as wrong user' do
    login_as(@natalya, @natalya_password)
    patch user_path(@andre),
          params: { user: { first_name: @andre.first_name,
                             last_name: @andre.last_name,
                             email: @andre.email } }
    assert_redirected_to errors_forbidden_path
  end

  test 'should redirect to forbidden path if user is not admin' do
    get users_path
    assert_redirected_to errors_forbidden_path
  end

  test 'should not allow the admin attribute to be edited via the web' do
    login_as(@natalya, @natalya_password)
    assert_not @natalya.admin?
    patch user_path(@natalya),
          xhr: true,
          params: {
            user: { password: 'password',
                    password_confirmation: 'password',
                    role: 'admin' }
          }
    @natalya.reload
    assert_not @natalya.admin?
  end

  test 'should redirect to forbidden path when user is not admin and tries to destroy user' do
    assert_no_difference 'User.count' do
      delete user_path(@andre)
    end
    assert_redirected_to errors_forbidden_path
  end

  test 'should redirect destroy when logged in as a non-admin' do
    login_as(@natalya, @natalya_password)
    assert_no_difference 'User.count' do
      delete user_path(@andre)
    end
    assert_redirected_to errors_forbidden_path
  end

  # Regression test for a since-fixed authorization gap (see UPGRADE-PLAN.md's Known
  # issues): remove_resume was missing from logged_in_user/correct_user's before_action
  # lists, so anyone could detach any user's resume. Mirrors remove_image's coverage.
  test 'should redirect remove_resume to unauthorized path when not logged in' do
    get remove_user_resume_path(@andre)
    assert_redirected_to errors_unauthorized_path
  end

  test 'should redirect remove_resume to forbidden path when logged in as wrong user' do
    login_as(@natalya, @natalya_password)
    get remove_user_resume_path(@andre)
    assert_redirected_to errors_forbidden_path
  end

  test 'correct user can remove their own resume' do
    login_as(@andre, Rails.application.credentials.dig(:password, :admin_user_password))
    # remove_resume re-renders 'show', which calls User#guess_city et al (see
    # config/environments/test.rb) - those need a real ip_address to look up, which is
    # normally set by UsersController#show's fetch_ip call, not exercised by this path.
    @andre.update!(ip_address: '127.0.0.1')
    @andre.resume.attach(io: StringIO.new('fake pdf content'), filename: 'resume.pdf', content_type: 'application/pdf')
    assert @andre.resume.attached?
    get remove_user_resume_path(@andre)
    assert_response :success
    assert_not @andre.reload.resume.attached?
  end
end
