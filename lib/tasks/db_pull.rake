# To run: rake db:pull
# lib/tasks/db_pull.rake
# After you run this, you'll need to run
# rails db:environment:set RAILS_ENV=development 
# because it will set environment to prod because its restoring from prod
namespace :db do
  desc 'Pull production db to development'
  task :pull => [:dump, :restore]

  task :dump do
    puts 'PG_DUMP on production database...'
    system "heroku pg:backups:capture"
    system "heroku pg:backups:download"
    puts 'Done!'
  end

  task :restore do
    dev = Rails.application.config.database_configuration['development']
    dumpfile = "#{Rails.root}/tmp/latest.dump"
    File.delete(dumpfile) if File.exist?(dumpfile)
    puts 'PG_RESTORE on development database...'
    system "pg_restore --verbose --clean --no-privileges --no-owner -h 127.0.0.1 -U #{dev['username']} -d #{dev['database']} latest.dump"
    puts 'Done!'
  end
end