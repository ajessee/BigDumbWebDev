# frozen_string_literal: true

module UsersHelper
  def return_user_error(userObject, current_attribute)
    case current_attribute
    when 'first_name'
      get_message(userObject.errors.full_messages_for(current_attribute))
    when 'last_name'
      get_message(userObject.errors.full_messages_for(current_attribute))
    when 'email'
      get_message(userObject.errors.full_messages_for(current_attribute))
    when 'password'
      get_message(userObject.errors.full_messages_for(current_attribute))
    when 'password_confirmation'
      get_message(userObject.errors.full_messages_for(current_attribute))
    end
  end

  def get_message(errors_array)
    error_message_string = ''
    errors_array.each do |msg|
      error_message_string += msg != errors_array.last ? msg + ', ' : msg + '.'
    end
    error_message_string
  end

  def logged_in_user
    unless logged_in?
      store_location
      flash[:error_message] = 'You need to log in to do that'
      redirect_to errors_unauthorized_path
    end
  end

  def admin_user
    unless current_user&.admin?
      if current_user
        flash[:error_message] = "Only admin users are allowed to do that #{current_user.name}"
      else
        flash[:error_message] = 'Only admin users are allowed to do that'
      end
      redirect_to errors_forbidden_path
    end
  end

  def logged_in_and_admin_user
    unless logged_in? && current_user && current_user.admin?
      flash[:error_message] = 'Only admin users are allowed to do that.'
      redirect_to errors_forbidden_path
    end
  end

  def correct_user
    unless logged_in? && current_user && current_user.admin?
      flash[:error_message] = "You definitely shouldn\'t be trying to access another user\'s resources #{current_user.first_name}"
      redirect_to errors_forbidden_path
    end
  end

  # if user is logged in, return current_user, else return guest_user
  def current_or_guest_user
    current_user || guest_user
  end

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
