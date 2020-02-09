# frozen_string_literal: true

namespace :upload_instagram do
  require 'json'
  require 'aws-sdk-s3'

  desc "Take pictures from AWS S3 bucket and create 'resources' for Post model"
  task upload: :environment do
    json_path = 'lib/tasks/nycProject.json'
    resource_dir_path = 'impartialobserver_20181001_part_2/'

    s3 = Aws::S3::Client.new(
      region: 'us-east-1',
      access_key_id: Rails.application.credentials.access_key_id,
      secret_access_key: Rails.application.credentials.secret_access_key
    )

    json_file = File.open(json_path)
    json_file_read = json_file.read
    parsed = JSON.parse(json_file_read)

    andre = User.first
    project = nil
    if (project = Project.find_by(name: 'A Year In NYC'))
      puts 'Project found'
    else
      project = andre.projects.create!(name: 'A Year In NYC', description: 'A year in photos of NYC - 2016')
      puts 'Project created'
    end

    project = Project.last
    puts project.valid?

    parsed['media'].each do |p|
      r = project.resources.create!(caption: p['caption'], path: p['path'], resource_type: p['type'], taken_at: p['taken_at'], day: p['day'].to_i)
      # r_day = r.day.to_s
      r_type = r.resource_type == 'video' ? '.mp4' : '.jpg'
      # file_name = p['path'].match(%r{([^/]+$)}).to_s
      resp = s3.get_object(bucket: 'temp-insta-store', key: resource_dir_path + p['path'])
      r_filename = r.path.match(/[ \w-]+?(?=\.)/).to_s + r_type
      puts 'Resource id: ' + r.id.to_s
      puts 'Path: ' + resource_dir_path + r.path
      puts 'file_name: ' + r_filename
      puts 'Content Type: ' + r.resource_type == 'video' ? 'video/mp4' : 'image/jpg'
      attach_params = {
        io: resp.body,
        file_name: r_filename,
        content_type: r.resource_type == 'video' ? 'video/mp4' : 'image/jpg'
      }
      r.image.attach(attach_params)
      r.save
    end
  end
end
