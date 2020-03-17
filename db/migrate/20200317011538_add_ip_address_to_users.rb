class AddIpAddressToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :ip_address, :string
  end
end
