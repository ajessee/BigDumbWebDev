class ProjectsController < ApplicationController

  # Since I'm the only user that can create new projects, every action except for show and index are restricted
  before_action :logged_in_and_admin_user, only: [:new, :create, :edit, :update, :destroy]

  def scroll3d
    # Grab three random projects to show
    @projects = Project.order("RANDOM()").limit(4)
    # @projects = Project.all
    
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
      # TODO: Figure out how to handle errors for project missing name or description. Maybe do client-side validation?
      redirect_to projects_path
    end
  end

  def show
    # Look in the params for the name of the slug, then render that name which show match a view template. If not, throw 404.
    render show_post_params_name rescue redirect_to errors_not_found_path 
  end

  def edit
    @project = Project.find_by(slug: params[:slug])
  end

  def update
    @project = Project.find_by(slug: params[:slug])
    if @project.update(project_params)
      if @project.external_url
        redirect_to projects_path
      else
        render @project.slug
      end
    else
      # TODO: Figure out how to handle errors for project missing name or description. Maybe do client-side validation?
      redirect_to projects_path
    end
  end

  def destroy
    @project = Project.find_by(slug: params[:slug])
    store_message({
      title: 'Project Deleted',
      message: "'#{@project.name}' successfully deleted",
      type: 'success'
    })
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
