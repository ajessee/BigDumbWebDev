# frozen_string_literal: true

class ProjectsController < ApplicationController
  # Since I'm the only user that can create new projects, every action except for show and index are restricted
  before_action :admin_user, only: %i[new create edit update destroy]

  def scroll3d
    # Grab four random projects to show
    @projects = Project.order('RANDOM()').limit(4)
  end

  def index
    # I am always the first user now that I've updated the seeds.rb file
    @user = User.first
  end

  def new
    @project = Project.new
  end

  def create
    @project = current_user.projects.new(project_params)
    if @project.save
      if @project.external_url
        redirect_to projects_path
      else
        render @project.slug
      end
    else
      # I've setup client side validation for name and description inputs. Should never get to this point
      redirect_to projects_path
    end
  end

  def show
    @project = Project.find_by(slug: params[:slug])
    @resources = @project.resources.order(:day).paginate(page: params[:page], per_page: 1)
    # Look in the params for the name of the slug, then render that name which show match a view template. If not, throw 404.
    begin
      render show_post_params_name
    rescue StandardError
      redirect_to errors_not_found_path
    end
  end

  def edit
    @project = Project.find_by(slug: params[:slug])
  end

  def update
    @project = Project.find_by(slug: params[:slug])
    @resources = @project.resources.order(:day).paginate(page: params[:page], per_page: 1)
    if @project.update(project_params)
      if @project.external_url
        redirect_to projects_path
      else
        render @project.slug
      end
    else
      # I've setup client side validation for name and description inputs. Should never get to this point
      redirect_to projects_path
    end
  end

  def destroy
    @project = Project.find_by(slug: params[:slug])
    store_message(
      title: 'Project Deleted',
      message: "'#{@project.name}' successfully deleted",
      type: 'success'
    )
    @project.destroy
    redirect_to projects_url
  end

  private

  def project_params
    params.require(:project).permit(:name, :description, :external_url, :url, :slug, :image)
  end

  def show_post_params_name
    params.require(:slug)
  end
end
