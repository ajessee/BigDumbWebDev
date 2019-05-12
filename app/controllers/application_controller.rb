class ApplicationController < ActionController::Base
  # including the SessionsHelper module here (the base class of all controllers), all methods in the helper are available across all controllers
  include SessionsHelper
  include NotificationsHelper
  include UsersHelper
  # TODO: Delete all helper files you aren't using
end
