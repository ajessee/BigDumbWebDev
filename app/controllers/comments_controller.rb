class CommentsController < ApplicationController
  
  def new
    @comment = Comment.new
    @post = Post.find_by_id(new_params)
  end

  def create
    # In this case, a post is commentable
    @commentable = Post.find_by_id(params[:comment][:post_id])
    if !logged_in?
      guest_user.first_name = params[:comment][:first_name]
      guest_user.last_name = params[:comment][:last_name]
      guest_user.save
      params[:comment] = params[:comment].merge(:user_id => guest_user.id)
    end
    @comment = @commentable.comments.build(comment_params)
    if @comment.save
      #render create
    else
    end
  end

  def edit
    @comment = Comment.find(params[:id])
    @post = Post.find(@comment.commentable_id)
  end

  def update
    @comment = Comment.find(params[:id])
    @post = Post.find(@comment.commentable_id)
    if @comment.update(comment_params)
      # render update js
    else
      render 'edit'
    end
  end

  def destroy
    @comment = Comment.find(params[:id])
    @post = Post.find(@comment.commentable_id)
    store_message({
      title: 'Comment Deleted',
      message: "Comment by #{@comment.author.name} successfully deleted",
      type: 'success'
    })
    @comment.destroy
    redirect_to @post
  end

  private

  def new_params
    params.require(:post_id)
  end

  def comment_params
    params.require(:comment).permit(:user_id, :content)
  end
  
end
