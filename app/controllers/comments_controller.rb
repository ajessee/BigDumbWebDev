class CommentsController < ApplicationController
  
  def new
    @comment = Comment.new
    @post = Post.find_by_id(new_params)
  end

  def create
    # In this case, a post is commentable
    @commentable = Post.find_by_id(params[:comment][:post_id])
    if guest?
      @guest = true
      guest_user.first_name = params[:comment][:first_name]
      guest_user.last_name = params[:comment][:last_name]
    end
    @comment = @commentable.comments.build(comment_params)
    if @comment.save
      #render create
    else
    end
  end

  def edit
  end

  def update
  end

  def destroy
  end

  private

  def guest?
    params[:comment][:guest] && params[:comment][:guest] == "true";
  end

  def new_params
    params.require(:post_id)
  end

  def comment_params
    params.require(:comment).permit(:content, :user_id)
  end

end
