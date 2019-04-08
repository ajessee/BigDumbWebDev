class TagsController < ApplicationController
  def show
    render layout: false
  end

  def index
    @tags = Tag.all
  end
end
