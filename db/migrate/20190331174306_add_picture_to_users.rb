# frozen_string_literal: true

class AddPictureToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :picture, :text
  end
end
