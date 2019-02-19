require 'test_helper'

class SessionsHelperTest < ActionView::TestCase

  def setup
    @david = users(:david)
    remember(@david)
  end

  test "current_user returns right user when session is nil" do
    assert_equal @david, current_user
    assert is_logged_in?
  end

  test "current_user returns nil when remember digest is wrong" do
    @david.update_attribute(:remember_digest, User.digest(User.new_token))
    assert_nil current_user
  end
end