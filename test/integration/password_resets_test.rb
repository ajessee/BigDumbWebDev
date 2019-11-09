require 'test_helper'

class PasswordResetsTest < ActionDispatch::IntegrationTest

  def setup
    ActionMailer::Base.deliveries.clear
    @user = users(:david)
  end

  #TODO: Fix these tests
  test "password resets" do
    get new_password_reset_path, xhr: true
    assert_equal "text/javascript", @response.content_type
    # Invalid email
    post password_resets_path, xhr: true, params: { password_reset: { email: "" } }
    assert_equal "text/javascript", @response.content_type
    # Valid email
    post password_resets_path, xhr: true,
         params: { password_reset: { email: @user.email } }
    assert_not_equal @user.reset_digest, @user.reload.reset_digest
    assert_equal 1, ActionMailer::Base.deliveries.size
    assert_redirected_to root_url
    # Password reset form
    user = assigns(:user)
    # Wrong email
    get edit_password_reset_path(user.reset_token, email: "")
    assert_redirected_to root_url
    # Inactive user
    user.toggle!(:activated)
    get edit_password_reset_path(user.reset_token, email: user.email)
    assert_redirected_to root_url
    user.toggle!(:activated)
    # Right email, wrong token
    get edit_password_reset_path('wrong token', email: user.email)
    assert_redirected_to root_url
    # Right email, right token
    get edit_password_reset_path(user.reset_token, email: user.email)
    assert_template 'password_resets/edit'
    assert_select "input[name=email][type=hidden][value=?]", user.email
    # Invalid password & confirmation
    patch password_reset_path(user.reset_token), xhr: true,
          params: { email: user.email,
                    user: { password:              "foobaz",
                            password_confirmation: "barquux" } }
    # assert_select 'span.error_explanation'
    assert_equal "text/javascript", @response.content_type
    # Empty password
    patch password_reset_path(user.reset_token), xhr: true,
          params: { email: user.email,
                    user: { password:              "",
                            password_confirmation: "" } }
    # assert_select 'span.error_explanation'
    assert_equal "text/javascript", @response.content_type
    # Valid password & confirmation
    patch password_reset_path(user.reset_token), xhr: true,
          params: { email: user.email,
                    user: { password:              "foobaz",
                            password_confirmation: "foobaz" } }
    # assert is_logged_in?
    assert_equal "text/javascript", @response.content_type
  end

  test "expired token" do
    get new_password_reset_path, xhr: true
    assert_equal "text/javascript", @response.content_type
    post password_resets_path, xhr: true,
         params: { password_reset: { email: @user.email } }
    @user = assigns(:user)
    @user.update_attribute(:reset_sent_at, 3.hours.ago)
    patch password_reset_path(@user.reset_token), xhr: true,
          params: { email: @user.email,
                    user: { password:              "foobar",
                            password_confirmation: "foobar" } }
    puts response.body
  end
end
