# frozen_string_literal: true

class AddGuestBooleanToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :guest, :boolean, default: false
  end
end
