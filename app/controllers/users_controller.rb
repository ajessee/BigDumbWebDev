class UsersController < ApplicationController

  before_action :logged_in_user, only: [:index, :show, :edit, :update, :destroy]
  before_action :correct_user, only: [:show, :edit, :update]
  before_action :admin_user, only: [:destroy, :index]

  def index
    @users = User.paginate(page: params[:page], per_page: 15)
  end

  def new
    # In keystrokes.js, we grab a hidden div with a link_to new_user_path with remote true
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
        message: "Welcome to Big Dumb Web Dev #{@user.name}!",
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
  end

  def update
    # correct_user defines @user that is then passed to the view
    if @user.update(user_params)
      #render update.erb.js
    else
      render 'edit'
    end
  end

  def destroy
    @user = User.find(params[:id])
    store_message({
      title: 'User Deleted',
      message: "#{@user.name} successfully deleted",
      type: 'success'
    })
    @user.destroy
    redirect_to users_url
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :details, :email, :password, :password_confirmation)
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
    unless current_user?(@user) || current_user.admin?
      flash[:error_message] = 'You definitely shouldn\'t be trying to access another user\'s resources'
      redirect_to errors_forbidden_path 
    end
  end

  def admin_user
    unless current_user.admin?
      flash[:error_message] = 'Only admin users are allowed to do that'
      redirect_to errors_forbidden_path 
    end
  end

end
