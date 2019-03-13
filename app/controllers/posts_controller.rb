class PostsController < ApplicationController

  def new
    @post = Post.new
  end

  def create
    @post = current_user.posts.new(post_params)
    @post.save
    redirect_to @post
  end

  def show
    @post = Post.find(params[:id])
  end

  def index
    @user = User.first
    @posts = @user.posts.paginate(page: params[:page])
  end

  private
  def post_params
    params.require(:post).permit(:title, :content)
  end

end
