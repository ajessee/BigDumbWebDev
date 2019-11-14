class PostsController < ApplicationController

  # Since I'm the only user that can create new posts, every action except for show and index are restricted
  before_action :logged_in_and_admin_user, only: [:new, :create, :edit, :update, :destroy]
  before_action :delete_counts, only: [:create, :update]
  
  def index
    # I am always the first user now that I've updated the seeds.rb file
    @user = User.first
    if logged_in? && current_user.admin?
      @posts = @user.posts.paginate(page: params[:page], per_page: 1)
    else
      @posts = @user.posts.paginate(page: params[:page], per_page: 10)
    end
  end

  def new
    @post = Post.new
  end

  def create
    @post = current_user.posts.new(post_params)
    @post.save
    # TODO: Figure out how to handle errors for post missing title - its the only validation we do. Maybe do client-side validation?
    redirect_to @post
  end

  def show
    store_location
    @post = Post.find_by(slug: params[:slug])
    redirect_to errors_not_found_path if !@post
  end

  def edit
    @post = Post.find_by(slug: params[:slug])
    redirect_to errors_not_found_path if !@post
  end

  def update
    @post = Post.find_by(slug: params[:slug])
    if @post.update(post_params)
      redirect_to @post
    else
      # TODO: Figure out how to handle errors for post missing title - its the only validation we do. Maybe do client-side validation?
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

  def check_diffs
    parsed_json = ActiveSupport::JSON.decode(request.body.string)
    @currentContent = parsed_json["currentContent"]
    @savedContent = parsed_json["savedContent"]
    @titleDiff = Diffy::SplitDiff.new(@currentContent["title"], @savedContent["title"], :format => :html)
    @titleDiffText = Diffy::SplitDiff.new(@currentContent["title"], @savedContent["title"]).instance_values["diff"]
    @titleDiffEmpty = @titleDiffText.empty?
    @contentDiff = Diffy::SplitDiff.new(@currentContent["content"], @savedContent["content"], :format => :html)
    @contentDiffText = Diffy::SplitDiff.new(@currentContent["content"], @savedContent["content"]).instance_values["diff"]
    @contentDiffEmpty = @contentDiffText.empty?
    @tagsDiff = Diffy::SplitDiff.new(@currentContent["tags"], @savedContent["tags"], :format => :html)
    @tagsDiffText = Diffy::SplitDiff.new(@currentContent["tags"], @savedContent["tags"]).instance_values["diff"]
    @tagsDiffEmpty = @tagsDiffText.empty?
    @publishedDiff = Diffy::SplitDiff.new(@currentContent["published"], @savedContent["published"], :format => :html) 
    @publishedDiffText = Diffy::SplitDiff.new(@currentContent["published"], @savedContent["published"]).instance_values["diff"]
    @publishedDiffEmpty = @publishedDiffText.empty?
    all_empty = @titleDiffEmpty && @contentDiffEmpty && @tagsDiffEmpty && @publishedDiffEmpty
    if all_empty
      render :json => {:success => "False"}, status: 204
    else
      render :partial => "posts/check_diffs"
    end
    
  end

  private
  def post_params
    params.require(:post).permit(:title, :content, :all_tags, :published)
  end

  def admin_params
    params.require(:post).permit(:admin)
  end

  def delete_counts
    # collection_select() in the post new/edit forms creates a post[counts] attribute that we have to remove from the params
    params[:post].delete :counts
  end

end
