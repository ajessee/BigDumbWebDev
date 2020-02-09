# frozen_string_literal: true

class Project < ApplicationRecord
  # Project belong to a user
  belongs_to :user
  # Make sure we have an associated user that owns the post
  validates :user_id, presence: true
  # Make sure we have a title, since we are going to use this for the URL. Also needs to be unique
  validates :name, presence: true, uniqueness: true
  # We always want a description too
  validates :description, presence: true
  has_one_attached :image
  has_many :resources, as: :resourceable, dependent: :destroy

  before_validation :set_slug

  def set_slug
    self.slug = name.parameterize.truncate(80, omission: '')
  end

  def self.add_slugs
    update(slug: to_slug(name))
  end

  def to_param
    slug
  end
end
