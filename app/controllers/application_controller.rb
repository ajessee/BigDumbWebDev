# frozen_string_literal: true

class ApplicationController < ActionController::Base
  # Including the SessionsHelper module here (the base class of all controllers), all methods in the helper are available across all controllers
  include ErrorsHelper
  include GuestUsersHelper
  include MessagesAndCookieHelper
  include PostsHelper
  include SessionsHelper
end
