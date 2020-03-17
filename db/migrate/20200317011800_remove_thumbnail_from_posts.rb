class RemoveThumbnailFromPosts < ActiveRecord::Migration[6.0]
  def change
    remove_column :posts, :thumbnail, :string
    add_column :posts, :published_at, :datetime
  end
end
