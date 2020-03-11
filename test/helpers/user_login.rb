# frozen_string_literal: true

require 'helpers/nav_menu'

module UserLogin
  include NavMenu
  def log_in_as(user, password, remember = false)
    visit(login_path)
    assert find('div.modal-content')
    assert find('form#login-user')
    assert find('input#session_email')
    assert find('input#session_password')
    assert fill_in 'session[email]', with: user.email
    assert fill_in 'session[password]', with: password
    assert find('div.slider.round').click if remember
    assert find('#login-user-submit-button').click
  end

  def validate_user_logged_in(user, remember = false, check_notification = true)
    if check_notification
      assert find('p.notifications-message', text: 'You\'ve been logged in to your account.')
    end
    session_cookie = page.driver.browser.manage.cookie_named('_big_dumb_web_dev_session')[:value]
    session_cookie_decrypt = verify_and_decrypt_session_cookie(session_cookie)
    assert User.find(session_cookie_decrypt['user_id']) == user
    if remember
      assert page.driver.browser.manage.cookie_named('remember_token')
      assert page.driver.browser.manage.cookie_named('user_id')
    end
  end

  def validate_user_logged_in_failed
    assert find('p.notifications-message', text: 'That is an invalid email / password combination. Please try again')
    assert find('div.modal-content')
    assert find('form#login-user')
    email_input_field = find('input#session_email')
    password_input_field = find('input#session_password')
    assert email_input_field.value == ''
    assert password_input_field.value == ''
    session_cookie_decrypt = fetch_session_cookie
    assert_not session_cookie_decrypt['user_id']
  end

  def logout
    open_nav_menu
    assert find('li#nav-menu-logout').find('a').click
  end

  def validate_user_logged_out(remember = false, check_notification = true)
    if check_notification
      assert find('p.notifications-message', text: 'You\'ve been successfully logged out of your account')
    end
    session_cookie_decrypt = fetch_session_cookie
    assert_not session_cookie_decrypt['user_id']
    if remember
      assert page.driver.browser.manage.all_cookies.select { |cookie| cookie[:name] == 'remember_token' }.empty?
      assert page.driver.browser.manage.all_cookies.select { |cookie| cookie[:name] == 'user_id' }.empty?
    end
  end

  def validate_user_get_reset_form_and_fill(user, bad_email = nil)
    user_email = bad_email || user.email
    assert find('#new-password-reset')
    assert find('#new-password-reset-header', text: 'Submit Email For Password Reset')
    assert find('#new-password-reset-email').find('input#password_reset_email')
    assert find('#new-password-reset-submit').find('#new-password-reset-submit-button')
    assert fill_in 'password_reset[email]', with: user_email
    assert find('#new-password-reset-submit-button').click
  end

  def validate_user_password_reset_form_and_fill(new_password, bad_password = nil, bad_confirm = nil)
    password = bad_password || new_password
    password_confirm = bad_confirm || new_password
    assert find('#password-reset-form')
    assert find('#password-reset-header', text: 'Reset Password')
    assert find('#password-reset-password').find('#user_password')
    assert find('#password-reset-password-confirm').find('#user_password_confirmation')
    assert fill_in 'user[password]', with: password
    assert fill_in 'user[password_confirmation]', with: password_confirm
    assert find('#password-reset-submit').find('#password-reset-submit-button').click
  end

  def validate_user_password_reset_form_bad_confirm_error
    assert find('#password-reset-form')
    assert find('#password-reset-header', text: 'Reset Password')
    assert find('.error_explanation', text: 'Password confirmation doesn\'t match Password.')
  end

  def validate_user_password_reset_form_empty_password_error
    assert find('#password-reset-form')
    assert find('#password-reset-header', text: 'Reset Password')
    assert page.find('#user_password').native.attribute('validationMessage') == 'Please fill out this field.'
  end

  def fetch_session_cookie
    session_cookie = page.driver.browser.manage.cookie_named('_big_dumb_web_dev_session')[:value]
    verify_and_decrypt_session_cookie(session_cookie)
  end

  def validate_user_account_not_activated_notification_ui
    assert find('p.notifications-message', text: 'Check your email for the activation link and try again')
  end

  def validate_user_bad_login_info_notification_ui
    assert find('p.notifications-message', text: 'reset your password')
    assert find('a', text: 'reset').click
  end

  def verify_user_password_reset_success_notification_ui
    assert find('p.notifications-message', text: 'Your password has been successfully reset')
  end

  def validate_user_password_reset_email_notification_ui
    assert find('p.notifications-message', text: 'We just sent you an email with password reset instructions')
  end

  def validate_user_password_reset_email_failed_notification_ui
    assert find('p.notifications-message', text: 'Email address not found. Please contact help@bigdumbweb.dev')
  end

  def validate_user_password_reset_user_not_activated_failed_notification_ui
    assert find('p.notifications-message', text: 'Your account has not been activated yet. Please check your email and activate your account before trying to reset your password')
  end

  def validate_user_password_reset_user_not_authenticated_failed_notification_ui
    assert find('p.notifications-message', text: 'It looks like your reset token has changed. Please contact thebigdummy@bigdumbweb.dev to resolve this issue')
  end

  def validate_user_password_reset_user_token_expired_failed_notification_ui
    assert find('p.notifications-message', text: 'Looks like your password reset link has expired. Please try again.')
  end

  def validate_user_password_reset_success_notification_ui
    assert find('p.notifications-message', text: 'We just sent you an email with password reset instructions')
  end
end
