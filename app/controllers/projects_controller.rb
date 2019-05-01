class ProjectsController < ApplicationController
  def index
    # Figure out how to set default user (me) that owns all the projects in production
    @user = User.last
  end

  def new
    @project = Project.new
  end

  def create
    @project = current_user.projects.new(project_params)
    @project.save
    # binding.pry
    if @project.external_url
      redirect_to projects_path
    else
      render @project.slug
    end
  end

  def show
    render show_post_params_name
  end

  def edit
  end

  def update
  end

  def destroy
  end

  private
  def project_params
    params.require(:project).permit(:name, :description, :external_url, :url, :slug, :image)
  end

  def show_post_params_name
    params.require(:slug)
  end

end
