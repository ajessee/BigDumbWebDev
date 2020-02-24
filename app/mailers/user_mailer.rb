# frozen_string_literal: true

class UserMailer < ApplicationMailer
  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.user_mailer.account_activation.subject
  #
  def account_activation(user)
    @user = user
    mail from: 'welcome@bigdumbweb.dev', to: user.email, subject: 'Welcome to bigdumbweb.dev!'
  end

  def password_reset(user)
    @user = user
    mail from: 'passwords@bigdumbweb.dev', to: user.email, subject: 'Password Reset'
  end

  def new_comment_on_comment(original_comment_author, new_comment_author, original_comment, reply, post)
    @original_comment_author = original_comment_author
    @new_comment_author = new_comment_author
    @original_comment = original_comment
    @reply = reply
    @post = post
    mail from: 'comments@bigdumbweb.dev', to: original_comment_author.email, subject: 'Someone replied to your comment on bigdumbweb.dev'
  end

  def new_comment_on_post(author, post, new_comment, new_comment_author)
    @author = author
    @post = post
    @new_comment = new_comment
    @new_comment_author = new_comment_author
    mail from: 'comments@bigdumbweb.dev', to: author.email, subject: 'Someone commented on your post on bigdumbweb.dev'
  end
end
