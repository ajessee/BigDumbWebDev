class Project < ApplicationRecord
  # Project belong to a user
  belongs_to :user
  # Make sure we have an associated user that owns the post
  validates :user_id, presence: true
  # Make sure we have a title, since we are going to use this for the URL
  validates :name, presence: true

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
