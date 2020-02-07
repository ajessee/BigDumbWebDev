# frozen_string_literal: true

module GuestUsersHelper
  def existing_guest_user?
    User.find_by(email: cookies.permanent.signed[:guest_user_email])
  end

  def update_guest_params(user, params)
    params[:first_name] == '' unless user.guest_first_name_updated?
    params[:last_name] == '' unless user.guest_last_name_updated?
    params[:email] == '' unless user.guest_email_updated?
    params
  end

  # get or set guest_user object associated with the current session, if none exists, create
  def guest_user(user = nil)
    # setter
    @cached_guest_user = user if user

    # Cache the value the first time it's gotten.
    @cached_guest_user ||=
      User.find_by!(email: (cookies.permanent.signed[:guest_user_email] ||= create_guest_user.email))

    # if cookies.signed[:guest_user_email] invalid, delete stored email, call method again to create guest user
  rescue ActiveRecord::RecordNotFound
    cookies.delete :guest_user_email
    guest_user
  end

  private

  # creates guest user by adding a record to the DB with temp first/last name, email, and guest password
  def create_guest_user
    user = User.create(first_name: 'Anonymous', last_name: 'Guest User', email: "guest_#{SecureRandom.uuid}@bigdumbweb.dev", role: 'guest_1', password: Rails.application.credentials.dig(:password, :guest_user_password), password_confirmation: Rails.application.credentials.dig(:password, :guest_user_password))
    user.save
    user
  end
end
