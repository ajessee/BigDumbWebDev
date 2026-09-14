# frozen_string_literal: true

module CookieDecrypter
  def verify_and_decrypt_session_cookie(cookie, secret_key_base = Rails.application.secret_key_base)
    config = Rails.application.config
    cookie = CGI.unescape(cookie)
    salt   = config.action_dispatch.authenticated_encrypted_cookie_salt
    encrypted_cookie_cipher = config.action_dispatch.encrypted_cookie_cipher || 'aes-256-gcm'
    # Rails 7.1 removed ActionDispatch::Cookies::JsonSerializer. The encrypted cookie jar
    # now always encrypts with NullSerializer (the value going in is already a plain JSON
    # string, dumped by the outer :json cookies_serializer from
    # config/initializers/cookies_serializer.rb) - so decrypt raw, then JSON-decode.
    serializer = ActiveSupport::MessageEncryptor::NullSerializer

    key_generator = ActiveSupport::KeyGenerator.new(secret_key_base, iterations: 1000)
    key_len = ActiveSupport::MessageEncryptor.key_len(encrypted_cookie_cipher)
    secret = key_generator.generate_key(salt, key_len)
    encryptor = ActiveSupport::MessageEncryptor.new(secret, cipher: encrypted_cookie_cipher, serializer: serializer)

    session_key = config.session_options[:key].freeze
    raw = encryptor.decrypt_and_verify(cookie, purpose: "cookie.#{session_key}")
    ActiveSupport::JSON.decode(raw)
  end
end
