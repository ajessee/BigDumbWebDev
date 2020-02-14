# frozen_string_literal: true

module GenerateUserInfo
  def create_user_info
    {
      first_name: Faker::Name.first_name,
      last_name: Faker::Name.last_name,
      comment: Faker::Hipster.sentence,
      email: Faker::Internet.email,
      password: Faker::Lorem.characters(number: 10, min_alpha: 4)
    }
  end
end
