# frozen_string_literal: true

# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview
  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/account_activation
  def account_activation
    user = User.first
    user.activation_token = User.new_token
    UserMailer.account_activation(user)
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/password_reset
  def password_reset
    user = User.first
    user.reset_token = User.new_token
    UserMailer.password_reset(user)
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/new_comment_on_comment
  def new_comment_on_comment
    reply = Comment.last
    new_comment_author = User.last
    original_comment = Comment.first
    original_comment_author = User.first
    post = Post.first
    UserMailer.new_comment_on_comment(original_comment_author, new_comment_author, original_comment, reply, post).deliver_now
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/new_comment_on_post
  def new_comment_on_post
    post = Post.first
    author = post.user
    new_comment = Comment.first
    new_comment_author = User.last
    UserMailer.new_comment_on_post(author, post, new_comment, new_comment_author).deliver_now
  end
end
