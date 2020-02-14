# frozen_string_literal: true

module UserSignup
  def open_sign_up_section(guest)
    if guest
      assert find('button#get-edit-guest-user-button', text: 'Sign Up').click
    else
      assert find('div#blog-icon').click
      assert find('button#nav-button').click
      assert find('li#nav-menu-signup').find('a').click
    end
  end

  def fill_in_and_submit_user_signup_form(user, fill_names = true, bad_email = nil, bad_password = nil, bad_confirmation = nil)
    email = bad_email || user[:email]
    password = bad_password || user[:password]
    confirmation = bad_confirmation || user[:password]
    if fill_names
      assert fill_in 'user[first_name]', with: user[:first_name]
      assert fill_in 'user[last_name]', with: user[:last_name]
    end
    assert fill_in 'user[email]', with: email
    assert fill_in 'user[password]', with: password
    assert fill_in 'user[password_confirmation]', with: confirmation
    assert find('form#new-user').find('input#new-user-submit-button').click
  end

  def verify_guest_user_sign_up_form_ui(guest = nil)
    if guest
      assert find('form#new-user').find_field('First name').value == guest[:first_name]
      assert find('form#new-user').find_field('Last name').value == guest[:last_name]
    else
      assert find('form#new-user').find_field('First name')
      assert find('form#new-user').find_field('Last name')
    end
    assert find('form#new-user').find_field('Email')
    assert find('form#new-user').find_field('Password')
    assert find('form#new-user').find_field('Confirmation')
  end

  def verify_user_sign_up_submit_notification_ui
    assert find('p.notifications-message', text: 'Thanks for submitting your information. Please check your email to activate your account.')
  end

  def verify_user_sign_up_success_notification_ui(user)
    assert find('p.notifications-message', text: "Welcome to Big Dumb Web Dev #{user.first_name}!")
  end

  def pull_latest_user_from_database
    User.last
  end

  def pull_user_from_database(guest)
    User.find_by(email: guest[:email])
  end
end
