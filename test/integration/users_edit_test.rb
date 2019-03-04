require 'test_helper'

class UsersEditTest < ActionDispatch::IntegrationTest
  def setup
    @david = users(:david)
  end

  test "unsuccessful edit" do
    log_in_as(@david)
    get edit_user_path(@david), xhr: true
    assert_equal "text/javascript", @response.content_type
    assert_template 'users/_edit'
    patch user_path(@david), xhr: true, params: { user: { name:  "",
      email: "foo@invalid",
      password:              "foo",
      password_confirmation: "bar" } }

      assert_template 'users/_edit'
      assert_template 'shared/_single_error_message'
  end

  test "successful edit" do
    log_in_as(@david)
    get edit_user_path(@david), xhr: true
    assert_equal "text/javascript", @response.content_type
    assert_template 'users/_edit'
    name  = "Jessee David"
    email = "jessee@david.com"
    patch user_path(@david), xhr: true, params: { user: { name:  name,
      email: email,
      password:              "",
      password_confirmation: "" } }
    assert_template 'users/update'
    assert_select "a"
    @david.reload
    assert_equal name,  @david.name
    assert_equal email, @david.email
  end
end
