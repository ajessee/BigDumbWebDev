# `versions`/`version_associations` are the standard tables the `paper_trail` gem
# generates, but paper_trail has never been in this app's Gemfile (checked git history and
# current Gemfile.lock - no trace of it, nor of any code referencing these tables). They
# were still physically present in both the checked-in db/schema.rb (until an earlier
# schema:dump regenerated it from migrations only, silently dropping them from the file
# without ever dropping them from any real database) and the actual dev/production
# databases - a classic "removed the gem, never rolled back its migration" leftover. See
# docs/development/UPGRADE-PLAN.md.
#
# Column/index shapes below captured directly from the live dev database via `\d versions`
# / `\d version_associations` before writing this, so the reversible `up` recreates them
# exactly if this migration is ever rolled back.
class DropPaperTrailVersionsTables < ActiveRecord::Migration[8.1]
  def up
    # if_exists: true - added 2026-09-15 after this migration failed against production:
    # neither table actually existed there. The comment above (and the original version of
    # this migration) claimed both were "still physically present in... dev/production
    # databases", but that was only ever verified against the local dev database, which
    # apparently had these as a leftover from some old data import/seed that never matched
    # real production state. Safe either way now, regardless of which tables exist where.
    drop_table :version_associations, if_exists: true
    drop_table :versions, if_exists: true
  end

  def down
    create_table :versions do |t|
      t.string :item_type, null: false
      t.bigint :item_id, null: false
      t.string :event, null: false
      t.string :whodunnit
      t.text :object
      t.datetime :created_at
      t.text :object_changes
      t.integer :transaction_id

      t.index %i[item_type item_id], name: 'index_versions_on_item_type_and_item_id'
      t.index :transaction_id, name: 'index_versions_on_transaction_id'
    end

    create_table :version_associations do |t|
      t.integer :version_id
      t.string :foreign_key_name, null: false
      t.integer :foreign_key_id
      t.string :foreign_type

      t.index %i[foreign_key_name foreign_key_id foreign_type], name: 'index_version_associations_on_foreign_key'
      t.index :version_id, name: 'index_version_associations_on_version_id'
    end
  end
end
