# frozen_string_literal: true

class TagsController < ApplicationController
  # Since I'm the only user that can create new tags, destroy is restricted and show and index are not
  before_action :admin_user, only: [:destroy]

  def show
    @tag = Tag.find(params[:id])
  end

  def index
    @tags = Tag.all
  end

  def destroy
    @tag = Tag.find(params[:id])
    @posts = @tag.posts
    @posts.each do |post|
      post.tags.destroy(@tag)
      @tag.destroy
    end
    store_message(
      title: 'Tag Deleted',
      message: "'#{@tag.name}' successfully deleted from #{@posts.length} #{'post'.pluralize(@posts.length)}",
      type: 'success'
    )
    redirect_to tags_url
  end
end
