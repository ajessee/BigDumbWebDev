require 'test_helper'

class UsersLoginTest < ActionDispatch::IntegrationTest

  test "Login with invalid credentials" do
    get login_path, xhr:true
    # check that we get javascript back
    assert_equal "text/javascript", @response.content_type
    # and that we get the correct js.erb template
    assert_template 'sessions/new'
    # post invalid credentials
    post login_path, xhr:true, params: {session: {email: "", password: ""}}
    # we get same new js.erb template back
    assert_template 'sessions/new'
    # which renders the html template
    assert_template 'sessions/_new'
    # TODO: Figure out how to test for elements on the larger page. Assert select can only see whats in the modal?
  end

end
