class UsersController < ApplicationController
  
  def show
    @user = User.find(params[:id])
    respond_to do |format|
      format.js {render js: "window.utils.modal.closeModal();"}
      format.html
     end
    
  end

  def new
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
      redirect_to @user
    else
      render 'new'
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end


end
