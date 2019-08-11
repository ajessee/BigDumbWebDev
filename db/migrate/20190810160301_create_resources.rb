class CreateResources < ActiveRecord::Migration[6.0]
  def change
    create_table :resources do |t|
      t.string :caption
      t.string :path
      t.string :resource_type
      t.string :taken_at
      t.integer :day
      t.references :resourceable, polymorphic: true, index: true

      t.timestamps
    end
  end
end
