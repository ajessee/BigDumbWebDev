require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest

  def setup
    @david = users(:david)
    @katyna = users(:katyna)
  end

  test "should get new" do
    get signup_path, xhr: true
    assert_response :success
  end

  test "should redirect edit to unauthorized path when not logged in" do
    get edit_user_path(@david)
    assert_redirected_to errors_unauthorized_path
  end

  test "should redirect update to unauthorized path when not logged in" do
    patch user_path(@david), params: { user: { name: @david.name,
      email: @david.email } }
    assert_redirected_to errors_unauthorized_path
  end

  test "should redirect edit to forbidden path when logged in as wrong user" do
    log_in_as(@katyna)
    get edit_user_path(@david)
    assert_redirected_to errors_forbidden_path
  end

  test "should redirect update to forbidden path when logged in as wrong user" do
    log_in_as(@katyna)
    patch user_path(@david), params: { user: { name: @david.name,
      email: @david.email } }
    assert_redirected_to errors_forbidden_path
  end

end
