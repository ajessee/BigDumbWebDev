require 'aws-sdk-sesv2'

# ActionMailer delivery method backed by Amazon SES (SESv2 SendEmail with a raw MIME message).
# Registered via `config.action_mailer.delivery_method = :ses` in config/environments/production.rb.
class SesDeliveryMethod
  def initialize(settings)
    @client = Aws::SESV2::Client.new(
      region: settings.fetch(:region),
      access_key_id: settings.fetch(:access_key_id),
      secret_access_key: settings.fetch(:secret_access_key)
    )
  end

  def deliver!(mail)
    @client.send_email(
      from_email_address: mail.from.first,
      destination: {
        to_addresses: Array(mail.to),
        cc_addresses: Array(mail.cc),
        bcc_addresses: Array(mail.bcc)
      },
      content: { raw: { data: mail.to_s } }
    )
  end
end
