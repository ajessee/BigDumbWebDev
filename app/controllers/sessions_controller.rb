class SessionsController < ApplicationController

  def new
  end

  def create
    @user = User.find_by(email: params[:session][:email].downcase)
    if @user && @user.authenticate(params[:session][:password])
      respond_to do |format|
        format.js
      end
    else
      @error = true
      @error_title = 'Oops'
      @error_message = 'That is an invalid email / password combination. Please try again'
      render 'new'
    end

  end

  def destroy
  end
end
