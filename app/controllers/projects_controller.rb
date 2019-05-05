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
      render 'edit'
    end
  end

  def destroy
    @project = Project.find_by(slug: params[:slug])
    store_message({
      title: 'Project Deleted',
      message: "'#{@project.name}'' successfully deleted",
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
