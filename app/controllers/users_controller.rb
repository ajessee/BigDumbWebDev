class UsersController < ApplicationController

  before_action :logged_in_user, only: [:index, :show, :edit, :update, :destroy]
  before_action :correct_user, only: [:show, :edit, :update]
  before_action :admin_user, only: [:destroy, :index]

  def index
    @users = User.paginate(page: params[:page], per_page: 15)
  end

  def new
    @user = User.new
  end  
  
  def create
    @user = User.new(user_params)
    if @user.save
      @user.send_activation_email
      respond_to do |format|
        format.js
      end
    else
      render 'new'
    end
  end

  def show
    @user = User.find(params[:id])
    if flash[:success]
      store_message({
        title: 'Account Activated',
        message: "Welcome to Big Dumb Web Dev #{@user.first_name}!",
        type: 'success'
      })
      flash.clear
    elsif flash[:error_message]
      store_message({
        title: 'Invalid activation link',
        message: "Sorry, that didn't work. Please contact andre@bigdumbwebdev.com.",
        type: 'failure'
      })
      flash.clear
    end
  end

  def edit
    # correct_user defines @user that is then passed to the view
    if params[:update_type] == "picture"
      render :edit_picture
    elsif params[:update_type] == "details"
      render :edit_details
    end
  end

  def update
    # correct_user defines @user that is then passed to the view
    if @user.update(user_params)
      store_message({
        title: 'Account Updated',
        message: "You\'ve successfully updated your profile",
        type: 'success'
      })
    else
      render 'edit'
    end
  end

  def destroy
    @user = User.find(params[:id])
    @comments = @user.comments
    @message = "#{@user.name} successfully deleted."
    if @comments.length > 0
      @message += " Deleted #{@comments.length} user #{'comment'.pluralize(@comments.length)}"
    end
    store_message({
      title: 'User Deleted',
      message: @message,
      type: 'success'
    })
    @comments.each do |comment|
      comment.posts.comments.destroy(comment)
      comment.destroy
    end
    @user.destroy
    redirect_to users_url
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :details, :image, :email, :password, :password_confirmation, :update_type)
  end

  def correct_user
    @user = User.find(params[:id])
    unless current_user?(@user) || current_user.admin?
      flash[:error_message] = "You definitely shouldn\'t be trying to access another user\'s resources #{@user.first_name}"
      redirect_to errors_forbidden_path 
    end
  end

end
