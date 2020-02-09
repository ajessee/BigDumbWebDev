# frozen_string_literal: true

class SessionsController < ApplicationController
  def new
    respond_to do |format|
      format.js
      # Link on 401 unauthorized error page makes a non-XHR GET request to login_path (here) and we redirect to root_path with login=true params
      # which then we check for on load, and if true, we click the login button for the user so they can log in.
      format.html { redirect_to root_path(login: true) }
    end
  end

  def create
    @location = store_referer_location
    @user = User.find_by(email: params[:session][:email].downcase)
    if @user&.authenticate(params[:session][:password])
      if @user.activated?
        log_in @user
        remember(@user) if params[:session][:remember_me] == '1'
        store_message(
          title: 'Success',
          message: "You've been logged in to your account.",
          type: 'success'
        )
        clear_location
        respond_to do |format|
          format.js
        end
      else
        render 'error'
      end
    else
      @error = true
      @error_title = 'Oops'
      @error_message = 'That is an invalid email / password combination. Please try again'
      render 'new'
    end
  end

  def destroy
    @location = store_referer_location || root_path
    log_out if logged_in?
    clear_location
    store_message(
      title: 'Success',
      message: 'Logged Out',
      type: 'success'
    )
    redirect_to @location
  end
end
