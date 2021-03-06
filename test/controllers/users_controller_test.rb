# frozen_string_literal: true

require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest
  # Remember that these controller tests use fixtures instead of the data that is in the database
  # TODO: Rewrite these tests as integration tests
  # def setup
  #   @andre = users(:one)
  #   @natalya = users(:three)
  # end

  # test 'should get new' do
  #   get signup_path, xhr: true
  #   assert_response :success
  # end

  # test 'should redirect edit to unauthorized path when not logged in' do
  #   get edit_user_path(@andre)
  #   assert_redirected_to errors_unauthorized_path
  # end

  # test 'should redirect update to unauthorized path when not logged in' do
  #   patch user_path(@andre),
  #         params: { user: { name: @andre.name,
  #                           email: @andre.email } }
  #   assert_redirected_to errors_unauthorized_path
  # end

  # test 'should redirect edit to forbidden path when logged in as wrong user' do
  #   login_as(@natalya)
  #   get edit_user_path(@andre)
  #   assert_redirected_to errors_unauthorized_path
  # end

  # test 'should redirect update to forbidden path when logged in as wrong user' do
  #   login_as(@natalya)
  #   patch user_path(@andre),
  #         params: { user: { name: @andre.name,
  #                           email: @andre.email } }
  #   assert_redirected_to errors_unauthorized_path
  # end

  # test 'should redirect to forbidden path if user is not admin' do
  #   get users_path
  #   assert_redirected_to errors_forbidden_path
  # end

  # test 'should not allow the admin attribute to be edited via the web' do
  #   login_as(@natalya)
  #   assert_not @natalya.admin?
  #   patch user_path(@natalya),
  #         xhr: true,
  #         params: {
  #           user: { password: 'password',
  #                   password_confirmation: 'password',
  #                   role: 'admin' }
  #         }
  #   assert_not @natalya.admin?
  # end

  # test 'should redirect to forbidden path when user is not admin and tries to destroy user' do
  #   assert_no_difference 'User.count' do
  #     delete user_path(@andre)
  #   end
  #   assert_redirected_to errors_forbidden_path
  # end

  # test 'should redirect destroy when logged in as a non-admin' do
  #   login_as(@natalya)
  #   assert_no_difference 'User.count' do
  #     delete user_path(@andre)
  #   end
  #   assert_redirected_to errors_forbidden_path
  # end
end
