# frozen_string_literal: true

class HelloController < ApplicationController
  def home
    @user = User.find_by(email: Rails.application.credentials.dig(:email, :admin))
    @intro_post = Post.find_by(slug: "welcome-to-big-dumb-web-dev") || Post.find(1) || @user.posts.create!(title: 'Test Post', content: 'Nothing to see here')
  end
end
