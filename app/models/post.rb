class Post < ApplicationRecord
  # Posts belong to users
  belongs_to :user
  # A post can have many comments
  has_many :comments, as: :commentable, dependent: :destroy
  # A post can have many tags
  has_many :tags, through: :taggings, dependent: :destroy
  # Order the posts by when they were created (most recent first)
  default_scope -> { order(created_at: :desc) }
  # Make sure we have an associated user that owns the post
  validates :user_id, presence: true
  # Make sure we have a title, since we are going to use this for the URL
  validates :title, presence: true
  # Posts have rich text content
  has_rich_text :content
end
