class PasswordResetsController < ApplicationController
  before_action :get_user,   only: [:edit, :update]
  before_action :valid_user, only: [:edit, :update]
  before_action :check_expiration, only: [:edit, :update] 

  def new
  end

  def create
    @user = User.find_by(email: params[:password_reset][:email].downcase)
    if @user
      @user.create_reset_digest
      @user.send_password_reset_email
      store_message({
        title: 'Please Check Your Email',
        message: "We just sent you an email with password reset instructions",
        type: 'alert'
      })
      redirect_to root_url
    else
      @error = true
      @error_title = 'Oops'
      @error_message = 'Email address not found. Please contact help@bigdumbwebdev.com'
      render 'new'
    end
  end

  def edit
  end

  def update
    if params[:user][:password].empty?                  
      @user.errors.add(:password, "can't be empty")
      render 'edit'
    elsif @user.update_attributes(user_params)          
      log_in @user
      store_message({
        title: 'Nice!',
        message: "Your password has been successfully reset.",
        type: 'success'
      })
      redirect_to @user
    else
      render 'edit'                                     
    end
  end

  private

  def user_params
    params.require(:user).permit(:password, :password_confirmation)
  end

  def get_user
    @user = User.find_by(email: params[:email])
  end

  # Confirms a valid user.
  def valid_user
    unless (@user && @user.activated? &&
            @user.authenticated?(:reset, params[:id]))
      redirect_to root_url
    end
  end

  def check_expiration
    if @user.password_reset_expired?
      flash[:danger] = "Password reset has expired."
      redirect_to new_password_reset_url
    end
  end

end
