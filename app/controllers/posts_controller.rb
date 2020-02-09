# frozen_string_literal: true

class PostsController < ApplicationController
  # Since I'm the only user that can create new posts, every action except for show and index are restricted
  before_action :admin_user, only: %i[new create edit update destroy]
  before_action :delete_counts, only: %i[create update]

  def index
    @user = User.find_by(email: Rails.application.credentials.dig(:email, :admin))
    @posts = if admin_user?
               @user.posts.paginate(page: params[:page], per_page: 1)
             else
               @user.posts.paginate(page: params[:page], per_page: 10)
             end
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
    @post = if admin_user?
              Post.find_by(slug: params[:slug])
            else
              Post.find_by(slug: params[:slug], published: true)
            end

    redirect_to errors_not_found_path unless @post
  end

  def edit
    @post = Post.find_by(slug: params[:slug])
    redirect_to errors_not_found_path unless @post
  end

  def update
    @post = Post.find_by(slug: params[:slug])
    if @post.update(post_params)
      redirect_to @post
    else
      # I've setup client side validation for title input. Should never get to this point
      render 'edit'
    end
  end

  def destroy
    @post = Post.find_by(slug: params[:slug])
    store_message(
      title: 'Post Deleted',
      message: "'#{@post.title}'' successfully deleted",
      type: 'success'
    )
    @post.destroy
    redirect_to posts_url
  end

  def check_diffs
    parsed_json = ActiveSupport::JSON.decode(request.body.string)
    @current_content = parsed_json['currentContent']
    @saved_content = parsed_json['savedContent']
    payload = helpers.create_diff_payload(@current_content, @saved_content)
    if payload[:allEmpty]
      render json: { success: 'False' }, status: 204
    else
      response = {
        partial:
          render_to_string(
            partial: 'posts/check_diffs',
            formats: :html,
            layout: false,
            locals: payload
          ),
        payload: payload
      }
      render json: ActiveSupport::JSON.encode(response)
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
