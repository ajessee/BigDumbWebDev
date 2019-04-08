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
      guest_user.save
      @comment = @commentable.comments.build(comment_params.merge(guest_name: guest_user.name))
    else
      @comment = @commentable.comments.build(comment_params)
    end
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
      message: "Comment by #{@comment.guest_name || @comment.author.name} successfully deleted",
      type: 'success'
    })
    @comment.destroy
    redirect_to @post
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
