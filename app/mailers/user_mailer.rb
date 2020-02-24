# frozen_string_literal: true

class UserMailer < ApplicationMailer
  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.user_mailer.account_activation.subject
  #
  def account_activation(user)
    @user = user
    mail from: 'welcome@bigdumbwebdev.com', to: user.email, subject: 'Welcome to Big Dumb Web Dev!'
  end

  def password_reset(user)
    @user = user
    mail from: 'passwords@bigdumbwebdev.com', to: user.email, subject: 'Password Reset'
  end

  def new_comment_on_comment(original_comment_author, new_comment_author, original_comment, reply, post)
    @original_comment_author = original_comment_author
    @new_comment_author = new_comment_author
    @original_comment = original_comment
    @reply = reply
    @post = post
    mail from: 'commentbot@bigdumbwebdev.com', to: original_comment_author.email, subject: 'Someone replied to your comment on Big Dumb Web Dev'
  end

  def new_comment_on_post(author, post, new_comment, new_comment_author)
    @author = author
    @post = post
    @new_comment = new_comment
    @new_comment_author = new_comment_author
    mail from: 'commentbot@bigdumbwebdev.com', to: author.email, subject: 'Someone commented on your post on Big Dumb Web Dev'
  end
end
