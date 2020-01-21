# To run: rake db:pull_prod_db
# lib/tasks/pull_prod_db.rake

namespace :db do
  desc "Pull production database from Heroku and restore to development environment"
  task :pull_prod_db => [:dump_prod_db, :restore_dev_db, :config_dev_db]

  task :dump_prod_db do
    puts "Starting capture and download from Heroku..."
    puts "Looking for existing backup"
    dumpfile = "#{Rails.root}/latest.dump"
    File.delete(dumpfile) if File.exist?(dumpfile)
    puts "heroku pg:backups:capture"
    system "heroku pg:backups:capture"
    puts "heroku pg:backups:download"
    system "heroku pg:backups:download"
    puts "Done"
  end

  task :restore_dev_db do
    puts "Starting restore on development environment..."
    dev = Rails.application.config.database_configuration['development']
    puts "PG_RESTORE on development database"
    system "pg_restore --verbose --clean --no-privileges --no-owner -h 127.0.0.1 -U #{dev['username']} -d #{dev['database']} latest.dump"
    puts "Done"
  end

  task :config_dev_db do
    puts "Reconfiguring development environment..."
    puts "rails db:environment:set RAILS_ENV=development"
    system "rails db:environment:set RAILS_ENV=development"
    puts "rails db:migrate RAILS_ENV=development"
    system "rails db:migrate RAILS_ENV=development"
    puts "git checkout db/schema.rb"
    system "git checkout db/schema.rb"
    puts "Done"
  end
  
end