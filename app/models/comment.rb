class Comment < ApplicationRecord
  # Belongs to user
  belongs_to :author, class_name: 'User', foreign_key: :user_id
  # Belongs to commentable, which allows for polymorphic associations, which will allow for comments on blog posts and comments themselves.
  belongs_to :commentable, polymorphic: true
  # Allow for comments to have comments
  has_many :comments, as: :commentable
  # Order the comments by when they were created (most recent first)
  default_scope -> { order(created_at: :desc) }
  # Comments have rich text content
  has_rich_text :content
end
