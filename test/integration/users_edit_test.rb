# frozen_string_literal: true

require 'test_helper'

class UsersEditTest < ActionDispatch::IntegrationTest
  # Remember that these controller tests use fixtures instead of the data that is in the database
  def setup
    @david = users(:david)
  end

  test 'unsuccessful edit' do
    log_in_as(@david)
    get edit_user_path(@david), xhr: true
    assert_equal 'text/javascript; charset=utf-8', @response.content_type
    assert_template 'users/_edit'
    patch user_path(@david), xhr: true, params: { user: { first_name: '',
                                                          last_name: '',
                                                          email: 'foo@invalid',
                                                          password: 'foo',
                                                          password_confirmation: 'bar' } }

    assert_template 'users/_edit'
    assert_template 'shared/_single_user_error_message'
  end

  test 'successful edit' do
    log_in_as(@david)
    get edit_user_path(@david), xhr: true
    assert_equal 'text/javascript; charset=utf-8', @response.content_type
    assert_template 'users/_edit'
    first_name = 'David'
    last_name = 'Jessee'
    email = 'jessee@david.com'
    patch user_path(@david), xhr: true, params: { user: { first_name: first_name,
                                                          last_name: last_name,
                                                          email: email,
                                                          password: '',
                                                          password_confirmation: '' } }
    assert_template 'users/update'
    assert_select 'a'
    @david.reload
    assert_equal first_name, @david.first_name
    assert_equal last_name, @david.last_name
    assert_equal email, @david.email
  end

  test 'successful edit with friendly forwarding' do
    get edit_user_path(@david)
    log_in_as(@david)
    get edit_user_path(@david), xhr: true
    assert_template 'users/edit'
    first_name = 'Foo'
    last_name = 'Bar'
    email = 'foo@bar.com'
    patch user_path(@david), xhr: true, params: { user: { first_name: first_name,
                                                          last_name: last_name,
                                                          email: email,
                                                          password: '',
                                                          password_confirmation: '' } }
    assert_template 'users/update'
    @david.reload
    assert_equal first_name, @david.first_name
    assert_equal last_name, @david.last_name
    assert_equal email, @david.email
  end
end
