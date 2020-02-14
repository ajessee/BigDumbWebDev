# frozen_string_literal: true

require 'test_helper'
require 'helpers/user_login'
require 'helpers/user_signup'
require 'helpers/cookie_decrypter'
require 'helpers/generate_user_info'
require 'capybara/email'

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  include UserLogin
  include UserSignup
  include CookieDecrypter
  include GenerateUserInfo
  include ActionMailer::TestHelper
  include Capybara::Email::DSL

  Capybara.server_port = 3001
  Capybara.app_host = 'http://localhost:3001'

  driven_by :selenium, using: :chrome, screen_size: [1400, 1400]
end