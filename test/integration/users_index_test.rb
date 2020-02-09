# frozen_string_literal: true

require 'test_helper'

class UsersIndexTest < ActionDispatch::IntegrationTest
  # Remember that these controller tests use fixtures instead of the data that is in the database
  # TODO: Rewrite these integration tests using capybara
  # def setup
  #   @admin = users(:eight)
  #   @non_admin = users(:one)
  # end

  # test 'index as admin including pagination and delete links' do
  #   log_in_as(@admin)
  #   get users_path
  #   assert_template 'users/index'
  #   assert_select 'div.pagination'
  #   first_page_of_users = User.paginate(page: 1)
  #   first_page_of_users.each do |user|
  #     # TODO: Figure out why this is failing
  #     # assert_select 'a[href=?]', user_path(user), text: user.name
  #     unless user == @admin
  #       # assert_select 'a[href=?]', user_path(user), text: 'delete'
  #     end
  #   end
  #   assert_difference 'User.count', -1 do
  #     delete user_path(@non_admin)
  #   end
  # end

  # test 'index as non-admin' do
  #   log_in_as(@non_admin)
  #   get users_path
  #   assert_select 'a', text: 'delete', count: 0
  # end
end
