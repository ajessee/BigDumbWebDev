class RemoveGuestFromUsers < ActiveRecord::Migration[6.0]
  def change

    remove_column :users, :guest, :boolean
  end
end
