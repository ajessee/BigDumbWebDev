class UsersController < ApplicationController

  before_action :logged_in_user, only: [:show, :edit, :update]
  before_action :correct_user, only: [:show, :edit, :update]

  def new
    # In keystrokes.js, we grab a hidden div with a link_to new_user_path with remote true
    @user = User.new
  end  
  
  def create
    @user = User.new(user_params)
    
    if @user.save
      log_in @user
      respond_to do |format|
        format.js
      end
    else
      render 'new'
    end
  end

  def show
    @user = User.find(params[:id])
  end

  def edit
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])
    if @user.update(user_params)
      #render update.erb.js
    else
      render 'edit'
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

  def logged_in_user
    unless logged_in?
      # TODO: Show unauthorized error page
      head 403
    end

    def correct_user
      @user = User.find(params[:id])
      head 403 unless current_user?(@user)
    end
  end

end
