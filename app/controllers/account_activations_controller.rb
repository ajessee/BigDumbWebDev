# frozen_string_literal: true

class AccountActivationsController < ApplicationController
  def edit
    user = User.find_by(email: params[:email])
    if user && !user.activated? && user.authenticated?(:activation, params[:id])
      user.activate
      log_in user
      flash[:success] = 'Account Activated!'
      redirect_to user
    else
      store_message(
        title: 'Invalid Account Activation Link',
        message: "Sorry, that didn't work. Please contact andre@bigdumbweb.dev.",
        type: 'failure'
      )
      flash.clear
      redirect_to root_url
    end
  end
end
