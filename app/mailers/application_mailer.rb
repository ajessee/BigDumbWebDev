# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: 'admin@bigdumbwebdev.com'
  layout 'mailer'
end
