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

  def create_user_info_with_missing_first_name
    {
      first_name: "",
      last_name: Faker::Name.last_name,
      comment: Faker::Hipster.sentence,
      email: Faker::Internet.email,
      password: Faker::Lorem.characters(number: 10, min_alpha: 4)
    }
  end

  def create_user_info_with_missing_last_name
    {
      first_name: Faker::Name.first_name,
      last_name: "",
      comment: Faker::Hipster.sentence,
      email: Faker::Internet.email,
      password: Faker::Lorem.characters(number: 10, min_alpha: 4)
    }
  end

  def create_user_info_with_missing_first_and_last_name
    {
      first_name: "",
      last_name: "",
      comment: Faker::Hipster.sentence,
      email: Faker::Internet.email,
      password: Faker::Lorem.characters(number: 10, min_alpha: 4)
    }
  end

  def create_user_info_with_everything_blank
    {
      first_name: "",
      last_name: "",
      comment: "",
      email: "",
      password: ""
    }
  end

  def create_user_info_with_missing_email
    {
      first_name: Faker::Name.first_name,
      last_name: Faker::Name.last_name,
      comment: Faker::Hipster.sentence,
      email: "",
      password: Faker::Lorem.characters(number: 10, min_alpha: 4)
    }
  end

  def create_user_info_with_invalid_email
    {
      first_name: Faker::Name.first_name,
      last_name: Faker::Name.last_name,
      comment: Faker::Hipster.sentence,
      email: 'a!@c.com',
      password: Faker::Lorem.characters(number: 10, min_alpha: 4)
    }
  end

  def create_user_info_with_missing_password
    {
      first_name: Faker::Name.first_name,
      last_name: Faker::Name.last_name,
      comment: Faker::Hipster.sentence,
      email: Faker::Internet.email,
      password: ""
    }
  end

  def create_user_info_with_invalid_password
    {
      first_name: Faker::Name.first_name,
      last_name: Faker::Name.last_name,
      comment: Faker::Hipster.sentence,
      email: Faker::Internet.email,
      password: Faker::Lorem.characters(number: 7, min_alpha: 4)
    }
  end
end
