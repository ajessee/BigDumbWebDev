# frozen_string_literal: true

# To run: rake db:create_fixtures
# lib/tasks/create_fixtures_from_db.rake

namespace :db do
  desc 'Create test fixtures from development database'

  task create_fixtures: :environment do
    puts 'Starting fixture creation...'
    Rails.application.eager_load!
    # https://www.codegram.com/blog/rake-ignores-eager-loading-rails-config/
    # Call models you want to create yml files for
    User.first
    Comment.first
    Post.first
    Project.first
    Tag.first
    models = defined?(ApplicationRecord) ? ApplicationRecord.descendants : ActiveRecord::Base.descendants
    models.each do |model|
      model_name = model.name.pluralize.underscore
      File.open("#{Rails.root}/test/fixtures/#{model_name}.yml", 'w') do |file|
        new_m = model.all.to_a.map do |m|
          model_key = m.id.humanize
          model_attributes = m.attributes.except('created_at', 'updated_at', 'activated_at', 'reset_sent_at')
          model_attributes["caption"].gsub!(/\n+/, ' ') if (model_name == "resources")
          { model_key => model_attributes.compact }
        end
        file.write new_m.to_yaml.lines[1..-1].join.gsub(/-\s{1}/, '').gsub(/\s{4}/, "\n ")
      end
    end
    puts 'Done'
  end
end
