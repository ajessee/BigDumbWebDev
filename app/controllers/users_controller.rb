class UsersController < ApplicationController
  
  def show
    @user = User.find(params[:id])
  end

  def new
    @user = User.new

    respond_to do |format|
      format.html
      format.js
     end

  end

end
