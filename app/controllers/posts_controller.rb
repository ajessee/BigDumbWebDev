class PostsController < ApplicationController

  before_action :logged_in_user, only: [:index, :edit, :update, :destroy]
  before_action :correct_user, only: [:edit, :update]
  before_action :admin_user, only: [:destroy, :index]
  before_action :delete_counts, only: [:create, :update]
  
  def index
    @user = current_user
    @posts = @user.posts.paginate(page: params[:page], per_page: 1)
  end

  def new
    @post = Post.new
  end

  def create
    @post = current_user.posts.new(post_params)
    @post.save
    redirect_to @post
  end

  def show
    store_location
    @post = Post.find_by(slug: params[:slug])
  end

  def edit
    # correct_user defines @post that is then passed to the view
  end

  def update
    # correct_user defines @post that is then passed to the view
    if @post.update(post_params)
      redirect_to @post
    else
      render 'edit'
    end
  end

  def destroy
    @post = Post.find_by(slug: params[:slug])
    store_message({
      title: 'Post Deleted',
      message: "'#{@post.title}'' successfully deleted",
      type: 'success'
    })
    @post.destroy
    redirect_to posts_url
  end

  private
  def post_params
    params.require(:post).permit(:title, :content, :all_tags)
  end

  def delete_counts
    params[:post].delete :counts
  end

  def logged_in_user
    unless logged_in?
      store_location
      flash[:error_message] = 'You need to log in to do that'
      redirect_to errors_unauthorized_path
    end
  end

  def correct_user
    @post = Post.find_by(slug: params[:slug])
    unless logged_in? && current_user.admin?
      flash[:error_message] = "You definitely shouldn\'t be trying to access another user\'s resources #{current_user.first_name}"
      redirect_to errors_forbidden_path 
    end
  end

  def admin_user
    unless current_user.admin?
      flash[:error_message] = "Only admin users are allowed to do that #{current_user.first_name}"
      redirect_to errors_forbidden_path 
    end
  end

end
