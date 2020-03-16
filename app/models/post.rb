# frozen_string_literal: true

class Post < ApplicationRecord
  include ActionText::Attachable
  # Posts belongs to a user
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

  before_validation :set_slug
  before_validation :cast_published
  # TODO: Switch this back after all blogs loaded in production to set word count
  # before_validation :set_word_count
  after_find :set_word_count

  def all_tags=(names)
    self.tags = names.split(',').map do |name|
      Tag.where(name: name.strip.downcase).first_or_create!
    end
  end

  def all_tags
    tags.map(&:name).join(', ')
  end

  def counts
    Tag.select('tags.id, tags.name,count(taggings.tag_id) as count')
       .joins(:taggings).group('taggings.tag_id, tags.id, tags.name')
  end

  def set_slug
    self.slug = title.parameterize.truncate(80, omission: '')
  end

  def set_word_count
    self.word_count = content.to_plain_text.scan(/[\w-]+/).size
  end

  def cast_published
    self.published = ActiveRecord::Type::Boolean.new.cast(published)
  end

  def reading_time
    words_per_minute = 150
    word_count / words_per_minute = 150
  end

  def self.add_slugs
    update(slug: to_slug(title))
  end

  def to_param
    slug
  end
end
