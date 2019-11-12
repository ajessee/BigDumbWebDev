class ChangeDefaultValueForPublishedInPosts < ActiveRecord::Migration[6.0]
  def change
    change_column_default :posts, :published, false
  end
end
