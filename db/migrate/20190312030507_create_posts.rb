# frozen_string_literal: true

class CreatePosts < ActiveRecord::Migration[6.0]
  def change
    create_table :posts do |t|
      t.string :title
      t.text :content
      t.string :thumbnail
      t.integer :word_count
      t.references :user, foreign_key: true

      t.timestamps
    end
    add_index :posts, %i[user_id created_at]
  end
end
