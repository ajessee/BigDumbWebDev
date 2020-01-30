module UsersHelper

  def returnUserError(userObject, currentAttribute)
    case currentAttribute 
      when "first_name"
       getMessage(userObject.errors.full_messages_for(currentAttribute))
       when "last_name"
       getMessage(userObject.errors.full_messages_for(currentAttribute))
      when "email"
       getMessage(userObject.errors.full_messages_for(currentAttribute))
      when "password"
       getMessage(userObject.errors.full_messages_for(currentAttribute))
      when "password_confirmation"
       getMessage(userObject.errors.full_messages_for(currentAttribute))
    end 
  end

  def getMessage(errorsArray)
   errorMessageString = ''
   errorsArray.each do |msg| 
     if msg != errorsArray.last
       errorMessageString += msg + ", "
     else 
       errorMessageString += msg + "."
     end 
   end 
   errorMessageString
  end

  def logged_in_user
    # TODO: Fix this, this is sketch
    unless logged_in? || current_or_guest_user
      store_location
      flash[:error_message] = 'You need to log in to do that'
      redirect_to errors_unauthorized_path
    end
  end

  def admin_user
    unless current_user.admin?
      flash[:error_message] = "Only admin users are allowed to do that #{current_user.first_name}"
      redirect_to errors_forbidden_path 
    end
  end

  def logged_in_and_admin_user
    unless logged_in? && current_user.admin?
      flash[:error_message] = "Only admin users are allowed to do that."
      redirect_to errors_forbidden_path 
    end
  end

  def correct_user
    unless logged_in? && current_user.admin?
      flash[:error_message] = "You definitely shouldn\'t be trying to access another user\'s resources #{current_user.first_name}"
      redirect_to errors_forbidden_path 
    end
  end

  # if user is logged in, return current_user, else return guest_user
  def current_or_guest_user
    if current_user
      current_user
    else
      guest_user
    end
  end

  def existing_guest_user?
    User.find_by(email: (cookies.permanent.signed[:guest_user_email]))
  end

  # get or set guest_user object associated with the current session, if none exists, create
  def guest_user(user = nil)
    # setter
    if (user)
      @cached_guest_user = user
    end
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
    user = User.create(first_name: "Anonymous", last_name: "Guest User", email: "guest_#{SecureRandom.uuid}@bigdumbweb.dev", guest: true, password: Rails.application.credentials.dig(:password, :guest_user_password), password_confirmation: Rails.application.credentials.dig(:password, :guest_user_password))
    user.save
    user
  end

end
