# frozen_string_literal: true

require 'test_helper'

class UserMailerTest < ActionMailer::TestCase
  # Remember that these controller tests use fixtures instead of the data that is in the database
  test 'account_activation' do
    user = users(:one)
    user.activation_token = User.new_token
    mail = UserMailer.account_activation(user)
    assert_equal 'Welcome to Big Dumb Web Dev!', mail.subject
    assert_equal [user.email], mail.to
    assert_equal ['welcome@bigdumbweb.dev'], mail.from
    assert_match user.first_name,         mail.body.encoded
    assert_match user.activation_token,   mail.body.encoded
    assert_match CGI.escape(user.email),  mail.body.encoded
  end

  test 'password_reset' do
    user = users(:one)
    user.reset_token = User.new_token
    mail = UserMailer.password_reset(user)
    assert_equal 'Password Reset', mail.subject
    assert_equal [user.email], mail.to
    assert_equal ['passwords@bigdumbweb.dev'], mail.from
    assert_match user.reset_token,        mail.body.encoded
    assert_match CGI.escape(user.email),  mail.body.encoded
  end
end
