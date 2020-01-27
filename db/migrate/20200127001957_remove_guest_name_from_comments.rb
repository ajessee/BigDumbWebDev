class RemoveGuestNameFromComments < ActiveRecord::Migration[6.0]
  def change

    remove_column :comments, :guest_name, :string
  end
end
