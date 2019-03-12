# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

user = User.create!(
  first_name:  "Andre",
  last_name: "Jessee",
  email: "andre.isaac.jessee@gmail.com",
  # email: "dumb@bigdumbwebdev.com",
  password:              "password",
  password_confirmation: "password",
  admin: true,
  activated: true,
  activated_at: Time.zone.now)

30.times do 
  title = Faker::Book.title
  content = Faker::Lorem.paragraph_by_chars(500, false)
  user.posts.create(title: title, content: content)
end

25.times do
first_name  = Faker::Name.first_name
last_name = Faker::Name.last_name
email = Faker::Internet.email
details = Faker::Quote.famous_last_words
password = "password"
User.create!(
  first_name:  first_name,
  last_name: last_name,
  email: email,
  details: Faker::Quote.famous_last_words,
  password:              password,
  password_confirmation: password,
  activated: true,
  activated_at: Time.zone.now)
end