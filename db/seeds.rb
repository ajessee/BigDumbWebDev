# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

admin_user = User.create!(
  first_name:  "Andre",
  last_name: "Jessee",
  email: "andre.isaac.jessee@gmail.com",
  # email: "dumb@bigdumbwebdev.com",
  password:              Rails.application.credentials.dig(:seed, :admin_user_password),
  password_confirmation: Rails.application.credentials.dig(:seed, :admin_user_password),
  admin: true,
  activated: true,
  activated_at: Time.zone.now)

guest_user = User.create!(
  first_name:  "Guest",
  last_name: "User",
  email: "guest@bigdumbwebdev.com",
  password:              Rails.application.credentials.dig(:seed, :guest_user_password),
  password_confirmation: Rails.application.credentials.dig(:seed, :guest_user_password),
  admin: false,
  activated: true,
  activated_at: Time.zone.now)
  
existing_projects_array = [
  {
    name: "RDJessee Blog", 
    description: "A website I built to share my late grandfather's stories", 
    external_url: true, 
    url: "https://www.ralphdonaldjessee.com/"
  },
  {
    name: "NYCycle", 
    description: "Find your closest recycling bin in NYC", 
    external_url: true, 
    url: "https://nycycle-1.herokuapp.com/"
  },
  {
    name: "HeadUp", 
    description: "A website I built for my friends consulting business", 
    external_url: true, 
    url: "https://head-up.herokuapp.com/"
  },
  {
    name: "NYC Water Reservoir Levels", 
    description: "A command line application I built to visualize NYC reservoir water levels", 
    external_url: true, 
    url: "https://github.com/ajessee/visualize_NYC_resevoir_levels"
  },
  {
    name: "TOEFL Audio/Essay Grading Feature", 
    description: "A feature I built for Kaplan's online TOEFL testing software", 
    external_url: true, 
    url: "https://github.com/ajessee/toefl_audio_essay_feature"
  },
  {
    name: "Ruby Scripts for XML manipulation", 
    description: "Some Ruby scripts I wrote to manipulate XML for test content at Kaplan", 
    external_url: true, 
    url: "https://github.com/ajessee/ruby_scripts"
  },
  {
    name: "Yoda Number Guesser", 
    description: "Guess the number, you will", 
    external_url: false, 
    url: nil
  },
  {
    name: "Loan Calculator", 
    description: "Calculate the interest and repayment years of a loan", 
    external_url: false, 
    url: nil
  },
  {
    name: "Todo List", 
    description: "Make a list, then do everything on it", 
    external_url: false, 
    url: nil
  },
  {
    name: "Contacts List", 
    description: "Have friends? Keep track of them here", 
    external_url: false, 
    url: nil
  }
]

existing_projects_array.each do |proj|
  admin_user.projects.create!(proj)
end

# Uncomment to seed dev database with fake users.
# 30.times do 
#   title = Faker::Book.title
#   content = Faker::Lorem.paragraph_by_chars(500, false)
#   admin_user.posts.create(title: title, content: content)
# end

# 25.times do
# first_name  = Faker::Name.first_name
# last_name = Faker::Name.last_name
# email = Faker::Internet.email
# details = Faker::Quote.famous_last_words
# password = "password"
# User.create!(
#   first_name:  first_name,
#   last_name: last_name,
#   email: email,
#   details: Faker::Quote.famous_last_words,
#   password:              password,
#   password_confirmation: password,
#   activated: true,
#   activated_at: Time.zone.now)
# end