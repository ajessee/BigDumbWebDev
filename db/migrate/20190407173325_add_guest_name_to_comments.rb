# frozen_string_literal: true

class AddGuestNameToComments < ActiveRecord::Migration[6.0]
  def change
    add_column :comments, :guest_name, :string
  end
end
