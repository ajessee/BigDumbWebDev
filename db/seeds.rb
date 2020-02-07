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
  email: Rails.application.credentials.dig(:email, :admin),
  password:              Rails.application.credentials.dig(:password, :admin_user_password),
  password_confirmation: Rails.application.credentials.dig(:password, :admin_user_password),
  role: 'admin',
  activated: true,
  activated_at: Time.zone.now)

# Uncomment to seed dev database with fake users.
30.times do 
  title = Faker::Book.title
  content = Faker::Lorem.paragraph_by_chars(number: 500)
  admin_user.posts.create(title: title, content: content)
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

# guest_user = User.create!(
#   first_name:  "Guest",
#   last_name: "User",
#   email: "guest@bigdumbwebdev.com",
#   password:              Rails.application.credentials.dig(:seed, :guest_user_password),
#   password_confirmation: Rails.application.credentials.dig(:seed, :guest_user_password),
#   admin: false,
#   activated: true,
#   activated_at: Time.zone.now)