# frozen_string_literal: true

require 'test_helper'

class ProjectTest < ActiveSupport::TestCase
  def setup
    @user = users(:one)
    @project = @user.projects.build(name: 'A New Project', description: 'Does something neat.')
  end

  test 'should be valid' do
    assert @project.valid?
  end

  test 'user_id should be present' do
    @project.user_id = nil
    assert_not @project.valid?
  end

  test 'name should be present' do
    @project.name = '   '
    assert_not @project.valid?
  end

  test 'name should be unique' do
    @project.save!
    duplicate_project = @project.dup
    assert_not duplicate_project.valid?
  end

  test 'description should be present' do
    @project.description = '   '
    assert_not @project.valid?
  end

  test 'slug should be set automatically from the name' do
    @project.save!
    assert_equal 'a-new-project', @project.slug
  end

  test 'associated resources should be destroyed' do
    @project.save!
    @project.resources.create!(caption: 'A screenshot')
    assert_difference 'Resource.count', -1 do
      @project.destroy
    end
  end
end
