class UsersController < ApplicationController
  before_action :logged_in_user, only: [:index, :show, :edit, :update, :destroy]
  before_action :correct_user, only: [:show, :edit, :update]
  before_action :admin_user, only: [:destroy, :index]
  before_action :check_guest_role, only: [:create]

  def index
    @users = User.paginate(page: params[:page], per_page: 15)
  end

  def new
    @user = User.new
  end

  def create
    respond_to do |format|
      format.js
    end
    if existing_guest_user?
      @user = existing_guest_user?
      user_params = update_guest_params(@user, params.require(:user).permit(:first_name, :last_name, :details, :image, :email, :password, :password_confirmation, :update_type))
      if @user.update(user_params)
        @user.convert_from_guest_account(cookies)
        @user.create_activation_digest
        @user.save
        @user.send_activation_email
      else
        @user = User.new(user_params)
        if !@user.save
    
          existing_guest_user?.guest_1!
          render 'new'
        end
      end
    else
      @user = User.new(user_params)
      if @user.save
        @user.send_activation_email
      else
        render 'new'
      end
    end
  end

  def show
    @user = User.find(params[:id])
    if flash[:success]
      store_message(
        title: 'Account Activated',
        message: "Welcome to Big Dumb Web Dev #{@user.first_name}!",
        type: 'success'
      )
      flash.clear
    elsif flash[:error_message]
      store_message(
        title: 'Invalid activation link',
        message: "Sorry, that didn't work. Please contact andre@bigdumbwebdev.com.",
        type: 'failure'
      )
      flash.clear
    end
  end

  def edit
    # correct_user defines @user that is then passed to the view
    if params[:update_type] == 'picture'
      render :edit_picture
    elsif params[:update_type] == 'details'
      render :edit_details
    elsif params[:update_type] == 'cancel_details'
      render :cancel_details
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
    @comments = Comment.where(user_id: @user.id)
    @message = "#{@user.name} successfully deleted."
    unless @comments.empty?
      @message += " Deleted #{@comments.length} user #{'comment'.pluralize(@comments.length)}"
    end
    store_message(
      title: 'User Deleted',
      message: @message,
      type: 'success'
    )
    @comments.each(&:destroy)
    if @user.guest_2? && cookies.permanent.signed[:guest_user_email] == @user.email
      cookies.delete :guest_user_email
    end
    @user.destroy
    redirect_to users_url
  end

  def demote_guest
    if existing_guest_user? && existing_guest_user?.guest_2?
      existing_guest_user?.guest_1!
      existing_guest_user?.save
      head :ok
    else
      head :no_content
    end
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :details, :image, :email, :password, :password_confirmation, :update_type)
  end

  def correct_user
    @user = User.find(params[:id])
    unless current_user?(@user) || current_user&.admin?
      flash[:error_message] = "You definitely shouldn\'t be trying to access another user\'s resources #{@user.first_name}"
      redirect_to errors_forbidden_path
    end
  end

  def user_can_edit
    @user = User.find(params[:id])
    unless (logged_in? && current_user?(@user)) || current_user?(@user) && current_user.admin? || @user == existing_guest_user? && @user.guest_1?
      flash[:error_message] = 'You are not authorized to edit that user'
      redirect_to errors_forbidden_path
    end
  end

  def user_can_update
    @user = User.find(params[:id])
    unless (logged_in? && current_user?(@user)) || current_user?(@user) && current_user.admin? || existing_guest_user?&.guest_2?
      flash[:error_message] = 'You are not authorized to update that user'
      redirect_to errors_forbidden_path
    end
  end

  def check_guest_role
    if existing_guest_user? && existing_guest_user?.guest_1?
      existing_guest_user?.guest_2!
      existing_guest_user?.save
    end
  end
end
