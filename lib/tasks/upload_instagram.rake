namespace :upload_instagram do
  require "json"
  require "aws-sdk-s3"

  desc "upload"
  task :task_one => :environment do 
      jsonPath = 'lib/tasks/nycProject.json'
      resourceDirPath = 'impartialobserver_20181001_part_2/'

      s3 = Aws::S3::Client.new(
      region: 'us-east-1',
      access_key_id: 'AKIA2XCY3KHECIAY4LPV',
      secret_access_key: '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'
      )

      jsonFile = File.open(jsonPath)
      jsonFileRead = jsonFile.read
      parsed = JSON.parse(jsonFileRead)

      andre = User.first
      project = nil
      if (project = Project.find_by(name: "A Year In NYC"))
      puts "Project found"
      else
      project = andre.projects.create!(name: "A Year In NYC", description: "A year in photos of NYC - 2016")
      puts "Project created"
      end

      project = Project.last
      puts project.valid?


      parsed["media"].each do |p|
        r = project.resources.create!({caption: p["caption"], path: p["path"], resource_type: p["type"], taken_at: p["taken_at"], day: p["day"].to_i})
        rDay = r.day.to_s
        rType = r.resource_type == "video" ? ".mp4" : ".jpg"
        fileName = p["path"].match(/([^\/]+$)/).to_s
        resp = s3.get_object(bucket:'temp-insta-store', key: resourceDirPath + p["path"])
        rFilename = r.path.match(/[ \w-]+?(?=\.)/).to_s + rType
        puts "Resource id: " + r.id.to_s
        puts "Path: " + resourceDirPath + r.path
        puts "Filename: " + rFilename
        puts "Content Type: " + r.resource_type == "video" ? "video/mp4" : "image/jpg"
        attach_params = {
          io: resp.body,
          filename: rFilename,
          content_type: r.resource_type == "video" ? "video/mp4" : "image/jpg"
        }
        r.image.attach(attach_params)
        r.save
      end

  end  
end
