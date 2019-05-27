class HelloController < ApplicationController

  def home
    @intro_post = Post.find(1);
  end

end
