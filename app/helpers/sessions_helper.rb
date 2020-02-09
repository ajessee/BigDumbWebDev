# frozen_string_literal: true

module SessionsHelper
  # store the provided user's id in the session method (which rails uses to store info in an encrypted cookie that expires on browser close)
  def log_in(user)
    session[:user_id] = user.id
  end

  def logged_in?
    # if current user is nil, user not logged in
    !current_user.nil?
  end

  def admin_user?
    logged_in? && current_user.admin?
  end

  def log_out
    # Clear out permanent stuff (remember attributes and cookies)
    forget(current_user)
    # Clear out temp stuff. Delete user_id key of session hash and set instance variable to nil
    session.delete(:user_id)
    @current_user = nil
  end

  def current_user?(user)
    user == current_user
  end

  def current_user
    # Check to see if there is a user_id in the session hash, and if so, assign it to the local user_id variable
    if (user_id = session[:user_id])
      # ||= (or equals) returns @current_user if it has already been assigned, otherwise checks database
      @current_user ||= User.find_by(id: user_id)
    # Other check if user_id is in the cookie (and unencrypt). Otherwise, no op.
    # This condition will be true if a user is opening a new browser window and has elected to be remembered, thus storing their information in the permanent cookie.
    elsif (user_id = cookies.permanent.signed[:user_id])
      user = User.find_by(id: user_id)
      # If we find a user and that user's remember token is correct
      if user&.authenticated?(:remember, cookies[:remember_token])
        log_in user
        @current_user = user
      end
    end
  end

  def remember(user)
    # Generates remember_token property for user object and stores a hashed digest of the token in the database
    user.remember
    # Stores user id in permanent cookie (expires in 20 years), and encrypts it using the 'signed' method
    cookies.permanent.signed[:user_id] = user.id
    # Stores user remember token in same permanent cookie, and no need to encrypt because the user model already encrypts it (in User.digest class method)
    cookies.permanent[:remember_token] = user.remember_token
  end

  def forget(user)
    # Set user remember_digest attribute to nil
    user.forget
    # Delete info out of cookie
    cookies.delete(:user_id)
    cookies.delete(:remember_token)
  end
end
