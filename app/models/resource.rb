class Resource < ApplicationRecord
  belongs_to :resourceable, polymorphic: true
  has_one_attached :image
end
