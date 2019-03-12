class PostsController < ApplicationController

  def index
    @user = User.first
    @posts = @user.posts.paginate(page: params[:page])
  end

end
