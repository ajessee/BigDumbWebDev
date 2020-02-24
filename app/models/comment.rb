# frozen_string_literal: true

class Comment < ApplicationRecord
  # Belongs to user
  belongs_to :author, class_name: 'User', foreign_key: :user_id
  # Belongs to commentable, which allows for polymorphic associations, which will allow for comments on blog posts and comments themselves.
  belongs_to :commentable, polymorphic: true
  # Allow for comments to have comments
  has_many :comments, as: :commentable, dependent: :destroy
  # Order the comments by when they were created (most recent first)
  default_scope -> { order(created_at: :desc) }
  # Comments have rich text content
  has_rich_text :content

  # Instance method to send email that new comment has been posted.
  def send_notification_email
    if commentable_type == 'Post'
      post = Post.find_by_id(commentable_id)
      author = post.user
      new_comment = self
      new_comment_author = User.find_by_id(user_id)
      # I will always be the author of posts, so always mail
      UserMailer.new_comment_on_post(author, post, new_comment, new_comment_author).deliver_now
    elsif commentable_type == 'Comment'
      reply = self
      new_comment_author = User.find_by_id(user_id)
      original_comment = Comment.find_by_id(commentable_id)
      original_comment_author = User.find_by_id(original_comment.user_id)
      post = find_comment_post
      # Only mail if author has BDWD account (or is admin), otherwise they have placeholder email
      UserMailer.new_comment_on_comment(original_comment_author, new_comment_author, original_comment, reply, post).deliver_now if original_comment_author.user? || original_comment_author.admin?
    end
  end

  def find_comment_post
    if commentable_type == 'Comment'
      parent_comment = Comment.find(commentable_id)
      parent_comment.find_comment_post
    elsif commentable_type == 'Post'
      post = Post.find(commentable_id)
    end
  end
end
