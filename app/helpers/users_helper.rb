module UsersHelper

  def returnUserError(userObject, currentAttribute)
     case currentAttribute 
       when "name", userObject.errors.full_messages_for(currentAttribute) 
        getMessage(@user.errors.full_messages_for(currentAttribute))
       when "email", @user.errors.full_messages_for(currentAttribute) 
        getMessage(@user.errors.full_messages_for(currentAttribute))
       when "password", @user.errors.full_messages_for(currentAttribute) 
        getMessage(@user.errors.full_messages_for(currentAttribute))
       when "password_confirmation", @user.errors.full_messages_for(currentAttribute) 
        getMessage(@user.errors.full_messages_for(currentAttribute))
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
