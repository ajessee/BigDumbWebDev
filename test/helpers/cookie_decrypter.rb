# frozen_string_literal: true

module CookieDecrypter
  def verify_and_decrypt_session_cookie(cookie, secret_key_base = Rails.application.secret_key_base)
    config = Rails.application.config
    cookie = CGI.unescape(cookie)
    salt   = config.action_dispatch.authenticated_encrypted_cookie_salt
    encrypted_cookie_cipher = config.action_dispatch.encrypted_cookie_cipher || 'aes-256-gcm'
    # serializer = ActiveSupport::MessageEncryptor::NullSerializer # use this line if you don't know your serializer
    serializer = ActionDispatch::Cookies::JsonSerializer

    key_generator = ActiveSupport::KeyGenerator.new(secret_key_base, iterations: 1000)
    key_len = ActiveSupport::MessageEncryptor.key_len(encrypted_cookie_cipher)
    secret = key_generator.generate_key(salt, key_len)
    encryptor = ActiveSupport::MessageEncryptor.new(secret, cipher: encrypted_cookie_cipher, serializer: serializer)

    session_key = config.session_options[:key].freeze
    encryptor.decrypt_and_verify(cookie, purpose: "cookie.#{session_key}")
  end
end
