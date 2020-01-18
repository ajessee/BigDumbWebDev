class HelloController < ApplicationController

  def home
    @user = User.first
    @intro_post = Post.find(1) || @user.posts.create!(title: "Test Post", content: "Nothing to see here")
  end

end
