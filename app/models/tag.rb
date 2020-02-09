# frozen_string_literal: true

class Tag < ApplicationRecord
  has_many :taggings
  has_many :posts, through: :taggings

  def self.counts
    Tag.select('tags.id, tags.name,count(taggings.tag_id) as count').order(:name)
       .joins(:taggings).group('taggings.tag_id, tags.id, tags.name')
  end

  def published_post?
    !posts.where(published: true).empty?
  end
end
