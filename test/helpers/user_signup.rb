# frozen_string_literal: true

require 'helpers/nav_menu'

module UserSignup
  include NavMenu
  def open_sign_up_section(guest)
    if guest
      assert find('button#get-edit-guest-user-button', text: 'Sign Up').click
    else
      open_nav_menu
      assert find('li#nav-menu-signup').find('a').click
    end
  end

  def fill_in_and_submit_user_signup_form(user, fill_names = true, bad_first_name = nil, bad_last_name = nil, bad_email = nil, bad_password = nil, bad_confirmation = nil)
    first_name = bad_first_name || user[:first_name]
    last_name = bad_last_name || user[:last_name]
    email = bad_email || user[:email]
    password = bad_password || user[:password]
    confirmation = bad_confirmation || user[:password]
    if fill_names
      assert fill_in 'user[first_name]', with: first_name
      assert fill_in 'user[last_name]', with: last_name
    end
    assert fill_in 'user[email]', with: email
    assert fill_in 'user[password]', with: password
    assert fill_in 'user[password_confirmation]', with: confirmation
    assert find('form#new-user').find('input#new-user-submit-button').click
  end

  def fill_in_and_submit_user_edit_form(user, new_first_name = nil, new_last_name = nil, new_email = nil, new_password = nil, new_confirmation = nil)
    first_name = new_first_name || user[:first_name]
    last_name = new_last_name || user[:last_name]
    email = new_email || user[:email]
    password = new_password || user[:password]
    confirmation = new_confirmation || user[:password]
    assert fill_in 'user[first_name]', with: first_name
    assert fill_in 'user[last_name]', with: last_name
    assert fill_in 'user[email]', with: email
    assert fill_in 'user[password]', with: password
    assert fill_in 'user[password_confirmation]', with: confirmation
    assert find('form#edit-user').find('input#edit-user-submit-button').click
  end

  def verify_user_sign_up_or_edit_form_ui(guest = nil, edit_user = false)
    form_selector = edit_user ? 'form#edit-user' : 'form#new-user'
    if guest
      assert find(form_selector).find_field('First name').value == guest[:first_name]
      assert find(form_selector).find_field('Last name').value == guest[:last_name]
    else
      assert find(form_selector).find_field('First name')
      assert find(form_selector).find_field('Last name')
    end
    assert find(form_selector).find_field('Email')
    assert find(form_selector).find_field('Password')
    assert find(form_selector).find_field('Confirmation')
  end

  def verify_user_sign_up_submit_notification_ui
    assert find('p.notifications-message', text: 'Thanks for submitting your information. Please check your email to activate your account.')
  end

  def verify_user_sign_up_success_notification_ui(user)
    assert find('p.notifications-message', text: "Welcome to bigdumbweb.dev #{user.first_name}!")
  end

  def verify_user_sign_up_invalid_activation_link_ui
    assert find('p.notifications-message', text: "Sorry, that didn't work. Please contact andre@bigdumbweb.dev")
  end

  def pull_latest_user_from_database
    User.last
  end

  def pull_user_from_database(guest)
    User.find_by(email: guest[:email])
  end
end
