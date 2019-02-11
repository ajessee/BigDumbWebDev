require 'test_helper'

class UsersSignupTest < ActionDispatch::IntegrationTest

  test "Valid signup information" do
    get signup_path, xhr:true
    assert_difference 'User.count', 1 do # the 1 is a second argument to assert_difference that specifies size of difference
      post signup_path, xhr: true, params: {user: {
        name: "First McLucky",
        email: "first@mclucky.com",
        password: "password",
        password_confirmation: "password"
      }}
    end
    assert_equal "text/javascript", @response.content_type
    assert_template 'users/create'
    assert_select "a"
  end

  test "Invalid signup information" do
    get signup_path, xhr: true
    assert_no_difference 'User.count' do
      post signup_path, xhr: true, params: {user: {
        name: "",
        email: "try@again",
        password: "not",
        password_confirmation: "real"
      }}
    end
    # Sending XHR POST request to users_path and asserting that we are getting javascript back and the new users partial
    assert_equal "text/javascript", @response.content_type
    assert_template 'users/_new'
    assert_template 'shared/_single_error_message'
  end

end
