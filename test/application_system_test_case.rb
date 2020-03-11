# frozen_string_literal: true

require 'test_helper'
require 'helpers/authentication_errors'
require 'helpers/user_login'
require 'helpers/user_edit'
require 'helpers/user_comment'
require 'helpers/user_signup'
require 'helpers/cookie_decrypter'
require 'helpers/generate_user_info'
require 'capybara/email'

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  include AuthenticationErrors
  include UserLogin
  include UserComment
  include UserEdit
  include UserSignup
  include CookieDecrypter
  include GenerateUserInfo
  include ActionMailer::TestHelper
  include Capybara::Email::DSL

  Capybara.server_port = 3001
  Capybara.app_host = 'http://localhost:3001'

  driven_by :selenium, using: :chrome, screen_size: [1400, 1400]
  # driven_by :selenium, using: :headless_chrome
  
end
