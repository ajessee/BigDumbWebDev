class UsersController < ApplicationController
  
  def show
    @user = User.find(params[:id])
  end

  def new
    # debugger
    @user = User.new

    respond_to do |format|
      format.html
      format.js
     end
  end

  def create
    @user = User.new(user_params)
    respond_to do |format|
      format.html
      format.js
     end

    if @user.save
      #show login
    else
      render 'create'
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end


end
