# frozen_string_literal: true

module ProjectsHelper
  def return_project_error(project_object, current_attribute)
    case current_attribute
    when 'name'
      get_message(project_object.errors.full_messages_for(current_attribute))
    when 'description'
      get_message(project_object.errors.full_messages_for(current_attribute))
    end
 end
end
