# frozen_string_literal: true

require 'test_helper'

class TagsControllerTest < ActionDispatch::IntegrationTest
  # TODO: What exactly am I trying to test with these? Is this useful?
  # Remember that these controller tests use fixtures instead of the data that is in the database
  # test "should get show" do
  #   get tags_show_url
  #   assert_response :success
  # end

  test 'should get index' do
    get tags_path
    assert_response :success
  end
end
