# frozen_string_literal: true

class CommentsController < ApplicationController
  before_action :correct_author, only: %i[edit update destroy]

  def new
    @comment = Comment.new
    if new_params[:comment_id]
      @existing_comment = Comment.find_by_id(new_params[:comment_id])
    elsif new_params[:post_id]
      @existing_post = Post.find_by_id(new_params[:post_id])
    end
  end

  def create
    # In this case, a post is commentable
    @commentable = Post.find_by_id(params[:comment][:post_id]) || Comment.find_by_id(params[:comment][:comment_id])
    unless logged_in?
      # This is where the guest user is first created if one doesn't
      # already exist for the session (guest email stored in permanent cookies)
      guest_user.first_name = params[:comment][:first_name]
      guest_user.last_name = params[:comment][:last_name]
      guest_user.save
      params[:comment] = params[:comment].merge(user_id: guest_user.id)
    end
    @comment = @commentable.comments.build(comment_params)
    if @comment.save
      # render create
    else
      # TODO: Add validation for comment body presence
      render 'new'
    end
  end

  def edit
    @post = Post.find(@comment.commentable_id)
  end

  def update
    @post = Post.find(@comment.commentable_id)
    if @comment.update(comment_params)
      # render update js
    else
      render 'edit'
    end
  end

  def destroy
    @post = find_comment_post(@comment)
    store_message(
      title: 'Comment Deleted',
      message: "Comment by #{@comment.author.name} successfully deleted",
      type: 'success'
    )
    @comment.destroy
    redirect_to @post
  end

  private

  def find_comment_post(comment)
    if comment.commentable_type == "Comment"
      parent_comment = Comment.find(comment.commentable_id)
      find_comment_post(parent_comment)
    elsif comment.commentable_type == "Post"
      post = Post.find(comment.commentable_id)
    end
  end

  def new_params
    params.permit(:post_id, :comment_id)
  end

  def comment_params
    params.require(:comment).permit(:user_id, :content)
  end

  def correct_author
    @comment = Comment.find(params[:id])
    @user = @comment.author
    unless current_user?(@user) || current_user&.admin?
      flash[:error_message] = "You definitely shouldn\'t be trying to access another user\'s resources #{@user.first_name}"
      redirect_to errors_forbidden_path
    end
  end
end
