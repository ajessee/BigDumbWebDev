class AccountActivationsController < ApplicationController
  # TODO: This is where the guest activation is failing, can't find ID
  def edit
    user = User.find_by(email: params[:email])
    if user && !user.activated? && user.authenticated?(:activation, params[:id])
      user.activate
      log_in user
      flash[:success] = "Account activated!"
      redirect_to user
    else
      flash[:error_message] = "Invalid activation link"
      redirect_to root_url
    end
  end
end
