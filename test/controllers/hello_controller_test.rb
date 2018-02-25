require 'test_helper'

class HelloControllerTest < ActionDispatch::IntegrationTest
  test "should get home" do
    get hello_home_url
    assert_response :success
  end

end
