class UsersController < ApplicationController

  def new
    # In keystrokes.js, we grab a hidden div with a link_to new_user_path with remote true
    @user = User.new
  end
  
  def show
    @user = User.find(params[:id])
  end

  def create
    @user = User.new(user_params)

    if @user.save
      respond_to do |format|
        format.js
      end
    else
      render 'new'
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

end
