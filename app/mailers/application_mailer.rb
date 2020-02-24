# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: 'admin@bigdumbweb.dev'
  layout 'mailer'
end
