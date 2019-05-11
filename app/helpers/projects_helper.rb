module ProjectsHelper

  def returnProjectError(projectObject, currentAttribute)
    case currentAttribute 
      when "name"
       getMessage(projectObject.errors.full_messages_for(currentAttribute))
      when "description"
       getMessage(projectObject.errors.full_messages_for(currentAttribute))
    end 
 end

end
