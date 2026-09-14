# frozen_string_literal: true

Rails.application.config.after_initialize do
  # Rails 7.1 changed ActionText::ContentHelper.allowed_attributes to have no default
  # (nil), with the real allow-list now computed lazily from sanitizer.class.
  # allowed_attributes + ActionText::Attachment::ATTRIBUTES only when it's nil - so this
  # can no longer just `<<` onto it (crashes on nil) or assign a bare ['style'] (would
  # silently replace the whole safe-list instead of extending it, once non-nil). Set it
  # explicitly to that same base list plus 'style'.
  ActionText::ContentHelper.allowed_attributes =
    ActionText::ContentHelper.sanitizer.class.allowed_attributes + ActionText::Attachment::ATTRIBUTES + ['style']
end
