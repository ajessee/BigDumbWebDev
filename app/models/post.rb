class Post < ApplicationRecord
  # Posts belong to users
  belongs_to :user
  # A post can have many comments
  has_many :comments, as: :commentable, dependent: :destroy
  # A post can have many tags
  has_many :taggings, dependent: :destroy
  has_many :tags, through: :taggings, dependent: :destroy
  # Order the posts by when they were created (most recent first)
  default_scope -> { order(created_at: :desc) }
  # Make sure we have an associated user that owns the post
  validates :user_id, presence: true
  # Make sure we have a title, since we are going to use this for the URL
  validates :title, presence: true
  # Posts have rich text content
  has_rich_text :content

  def all_tags=(names)
    self.tags = names.split(",").map do |name|
      Tag.where(name: name.strip.downcase).first_or_create!
    end
  end

  def all_tags
    self.tags.map(&:name).join(", ")
  end

  def counts
    Tag.select("tags.id, tags.name,count(taggings.tag_id) as count").
    joins(:taggings).group("taggings.tag_id, tags.id, tags.name")
  end

end
