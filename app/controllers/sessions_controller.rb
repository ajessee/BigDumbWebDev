class SessionsController < ApplicationController

  def new
    respond_to do |format|
      format.js
      # Link on 401 unauthorized error page makes a non-XHR GET request to login_path (here) and we redirect to root_path with login=true params 
      # which then we check for on load, and if true, we click the login button for the user so they can log in.
      format.html {redirect_to root_path(login: true)}
    end
  end

  def create
    @user = User.find_by(email: params[:session][:email].downcase)
    if @user && @user.authenticate(params[:session][:password])
      respond_to do |format|
        format.js
      end
      log_in @user
      params[:session][:remember_me] == '1' ? remember(@user) : forget(@user)
    else
      @error = true
      @error_title = 'Oops'
      @error_message = 'That is an invalid email / password combination. Please try again'
      render 'new'
    end

  end

  def destroy
    log_out if logged_in?
    redirect_to root_url
  end
  
end
