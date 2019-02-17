class ApplicationController < ActionController::Base
  # including the SessionsHelper module here (the base class of all controllers), all methods in the helper are avaliable across all controllers
  include SessionsHelper
end
