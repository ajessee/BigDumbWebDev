# frozen_string_literal: true

module ErrorsHelper
  def return_project_error(project_object, current_attribute)
    case current_attribute
    when 'name'
      get_error_message(project_object.errors.full_messages_for(current_attribute))
    when 'description'
      get_error_message(project_object.errors.full_messages_for(current_attribute))
    end
  end

  def return_user_error(user_object, current_attribute)
    case current_attribute
    when 'first_name'
      get_error_message(user_object.errors.full_messages_for(current_attribute))
    when 'last_name'
      get_error_message(user_object.errors.full_messages_for(current_attribute))
    when 'email'
      get_error_message(user_object.errors.full_messages_for(current_attribute))
    when 'password'
      get_error_message(user_object.errors.full_messages_for(current_attribute))
    when 'password_confirmation'
      get_error_message(user_object.errors.full_messages_for(current_attribute))
    end
  end

  def get_error_message(errors_array)
    error_message_string = ''
    errors_array.each do |msg|
      error_message_string += msg != errors_array.last ? msg + ', ' : msg + '.'
    end
    error_message_string
  end

  def admin_user
    unless admin_user?
      flash[:error_message] = if current_user
                                "Only admin users are allowed to do that #{current_user.name}"
                              else
                                'Only admin users are allowed to do that'
                              end
      redirect_to errors_forbidden_path
    end
  end
end
