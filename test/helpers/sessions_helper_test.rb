# frozen_string_literal: true

require 'test_helper'

class SessionsHelperTest < ActionView::TestCase
  # Remember that these controller tests use fixtures instead of the data that is in the database
  def setup
    @andre = users(:eight)
    remember(@andre)
  end

  test 'current_user returns right user when session is nil' do
    assert_equal @andre, current_user
    assert logged_in?
  end

  test 'current_user returns nil when remember digest is wrong' do
    @andre.update_attribute(:remember_digest, User.digest(User.new_token))
    assert_nil current_user
  end
end
