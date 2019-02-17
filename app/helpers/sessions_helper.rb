module SessionsHelper

  # store the provided user's id in the session method (which rails uses to store info in an encrypted cookie that expires on browser close)
  def log_in(user)
    session[:user_id] = user.id
  end

  def log_out
    # delete user_id key of session hash and set instance variable to nil
    session.delete(:user_id)
    @current_user = nil
  end

  def current_user
    if session[:user_id]
      # ||= (or equals) returns @current_user if it has already been assigned, otherwise checks database
      @current_user ||= User.find_by(id: session[:user_id])
    end
  end

  def logged_in?
    # if current user is nil, user not logged in
    !current_user.nil?
  end
end

