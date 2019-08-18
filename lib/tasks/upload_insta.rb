require "json"

jsonPath = 'nycProject.json'
# resourceDirPath = '/Users/andre/Desktop/pictures/instagram/impartialobserver_20181001_part_2/'
resourceDirPath = 'https://temp-insta-store.s3.amazonaws.com/impartialobserver_20181001_part_2/'

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
  rFile = File.open(resourceDirPath + r.path) 
  rFilename = r.path.match(/[ \w-]+?(?=\.)/).to_s + rType
  puts "Resource id: " + r.id.to_s
  puts "Path: " + resourceDirPath + r.path
  puts "Filename: " + rFilename
  puts "Content Type: " + r.resource_type == "video" ? "video/mp4" : "image/jpg"
  attach_params = {
    io: rFile,
    filename: rFilename,
    content_type: r.resource_type == "video" ? "video/mp4" : "image/jpg"
  }
  r.image.attach(attach_params)
  r.save
end
