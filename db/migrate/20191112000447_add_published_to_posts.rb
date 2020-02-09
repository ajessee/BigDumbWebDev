# frozen_string_literal: true

class AddPublishedToPosts < ActiveRecord::Migration[6.0]
  def change
    add_column :posts, :published, :boolean, default: false
    add_index :posts, :published
  end
end
