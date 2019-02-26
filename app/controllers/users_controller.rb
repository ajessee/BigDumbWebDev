class UsersController < ApplicationController

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

end
