# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :logged_in_user, only: %i[show edit update remove_image]
  before_action :correct_user, only: %i[show edit update remove_image]
  before_action :admin_user, only: %i[destroy index]
  before_action :promote_guest, only: [:create]

  def index
    @users = User.paginate(page: params[:page], per_page: 15)
  end

  def new
    @user = User.new
  end

  def create
    if existing_guest_user?
      @user = existing_guest_user?
      guest_user_params = update_guest_params(@user, params.require(:user).permit(:first_name, :last_name, :details, :image, :email, :password, :password_confirmation, :update_type))
      if @user.update(guest_user_params)
        @user.convert_from_guest_account(cookies)
        @user.create_activation_digest
        @user.save
        @user.send_activation_email
      else
        @user = User.new(user_params)
        unless @user.save

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
    @user.fetch_ip(request)
    if flash[:success]
      store_message(
        title: flash[:success],
        message: "Welcome to bigdumbweb.dev #{@user.first_name}!",
        type: 'success'
      )
      flash.clear
    end
  end

  def edit
    # correct_user defines @user that is then passed to the view
    if params[:update_type] == 'picture'
      render :edit_picture
    elsif params[:update_type] == 'resume'
      render :edit_resume
    elsif params[:update_type] == 'details'
      render :edit_details
    elsif params[:update_type] == 'cancel_details'
      render :cancel_details
    end
  end

  def update
    # correct_user defines @user that is then passed to the view
    if @user.update(user_params)
      store_message(
        title: 'Account Updated',
        message: "You\'ve successfully updated your profile",
        type: 'success'
      )
    else
      render 'edit'
    end
  end

  def destroy
    @user = User.find(params[:id])
    @comments = Comment.where(user_id: @user.id)
    @message = "#{@user.name} successfully deleted."
    @message += " Deleted #{@comments.length} user #{'comment'.pluralize(@comments.length)}" unless @comments.empty?
    store_message(
      title: 'User Deleted',
      message: @message,
      type: 'success'
    )
    @comments.each(&:destroy)
    cookies.delete :guest_user_email if @user.guest_2? && cookies.permanent.signed[:guest_user_email] == @user.email
    @user.destroy
    redirect_to users_url
  end

  def remove_image
    @user = User.find(params[:id])
    if @user.image.attached?
      @user.image.detach
      @user.save
    end
    render 'show'
  end

  def remove_resume
    @user = User.find(params[:id])
    if @user.resume.attached?
      @user.resume.detach
      @user.save
    end
    render 'show'
  end

  def demote_guest
    # Rubocop is formatting this with ruby safe navigation operator. The period represents the existing guest user object.
    if existing_guest_user?&.guest_2?
      existing_guest_user?.guest_1!
      existing_guest_user?.save
      head :ok
    else
      head :no_content
    end
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :details, :image, :resume, :email, :password, :password_confirmation, :update_type)
  end

  def logged_in_user
    unless logged_in?
      store_location
      flash[:error_message] = 'You need to log in to do that'
      redirect_to errors_unauthorized_path
    end
  end

  def correct_user
    @user = User.find(params[:id])
    unless current_user?(@user) || current_user&.admin?
      flash[:error_message] = "You definitely shouldn\'t be trying to access another user\'s resources #{@user.first_name}"
      redirect_to errors_forbidden_path
    end
  end

  def promote_guest
    # Rubocop is formatting this with ruby safe navigation operator. The period represents the existing guest user object.
    if existing_guest_user?&.guest_1?
      existing_guest_user?.guest_2!
      existing_guest_user?.save
    end
  end
end
