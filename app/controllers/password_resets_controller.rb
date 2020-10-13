# frozen_string_literal: true

class PasswordResetsController < ApplicationController
  before_action :fetch_user,   only: %i[edit update]
  before_action :valid_user, only: %i[edit update]
  before_action :check_expiration, only: %i[edit update]

  def new; end

  def create
    @user = User.find_by(email: params[:password_reset][:email].downcase)
    if @user
      @user.create_reset_digest
      @user.send_password_reset_email
      store_message(
        title: 'Please Check Your Email',
        message: 'We just sent you an email with password reset instructions',
        type: 'alert'
      )
      redirect_to root_url
    else
      @error = true
      @error_title = 'Oops'
      @error_message = 'Email address not found. Please contact help@bigdumbweb.dev'
      render 'new'
    end
  end

  def edit; end

  def update
    if params[:user][:password].empty?
      @user.errors.add(:password, "can't be empty")
      render 'edit'
    elsif @user.update(user_params)
      log_in @user
      @user.update_attribute(:reset_digest, nil)
      store_message(
        title: 'Nice!',
        message: 'Your password has been successfully reset',
        type: 'success'
      )
      redirect_to @user
    else
      render 'edit'
    end
  end

  private

  def user_params
    params.require(:user).permit(:password, :password_confirmation)
  end

  def fetch_user
    @user = User.find_by(email: params[:email])
  end

  # Confirms a valid user.
  def valid_user
    unless @user&.activated? &&
           @user&.authenticated?(:reset, params[:id])
      @message = ''
      if !@user&.activated?
        @message = 'Your account has not been activated yet. Please check your email and activate your account before trying to reset your password'
      elsif !@user&.authenticated?(:reset, params[:id])
        @message = 'It looks like your reset token has changed. Please contact thebigdummy@bigdumbweb.dev to resolve this issue'
      end
      store_message(
        title: 'Oops!',
        message: @message,
        type: 'failure'
      )
      redirect_to root_url
    end
  end

  def check_expiration
    if @user.password_reset_expired?
      store_message(
        title: 'Oops!',
        message: 'Looks like your password reset link has expired. Please try again.',
        type: 'failure'
      )
      redirect_to root_url
    end
  end
end
