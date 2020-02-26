# frozen_string_literal: true

require 'test_helper'

class UsersEditTest < ActionDispatch::IntegrationTest
  # Remember that these controller tests use fixtures instead of the data that is in the database
  # TODO: Rewrite these integration tests using capybara

  # test 'successful edit with friendly forwarding' do
  #   get edit_user_path(@andre)
  #   log_in_as(@andre)
  #   get edit_user_path(@andre), xhr: true
  #   assert_template 'users/edit'
  #   first_name = 'Foo'
  #   last_name = 'Bar'
  #   email = 'foo@bar.com'
  #   patch user_path(@andre),
  #         xhr: true,
  #         params: { user: { first_name: first_name,
  #                           last_name: last_name,
  #                           email: email,
  #                           password: '',
  #                           password_confirmation: '' } }
  #   assert_template 'users/update'
  #   @andre.reload
  #   assert_equal first_name, @andre.first_name
  #   assert_equal last_name, @andre.last_name
  #   assert_equal email, @andre.email
  # end
end
