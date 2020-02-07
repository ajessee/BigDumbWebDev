class ApplicationController < ActionController::Base
  # including the SessionsHelper module here (the base class of all controllers), all methods in the helper are available across all controllers
  include NotificationsHelper
  include PostsHelper
  include SessionsHelper
  include UsersHelper
end
