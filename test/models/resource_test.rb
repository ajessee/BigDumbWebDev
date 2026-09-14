# frozen_string_literal: true

require 'test_helper'

class ResourceTest < ActiveSupport::TestCase
  def setup
    @project = projects(:todo_list)
    @resource = @project.resources.build(caption: 'A screenshot', day: 1)
  end

  test 'should be valid' do
    assert @resource.valid?
  end

  test 'resourceable should be present' do
    @resource.resourceable = nil
    assert_not @resource.valid?
  end

  test 'resourceable association should return the owning project' do
    @resource.save!
    assert_equal @project, @resource.resourceable
  end
end
