module UsersHelper

  def logged_in_user
    unless logged_in?
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

end
