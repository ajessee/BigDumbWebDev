# frozen_string_literal: true

require 'test_helper'

class TagsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @andre = users(:one) # the only admin; TagsController restricts destroy to admin_user
  end

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

  test 'destroying a tag with no posts actually deletes it' do
    tag = Tag.create!(name: 'untagged')
    login_as(@andre, Rails.application.credentials.dig(:password, :admin_user_password))

    assert_difference 'Tag.count', -1 do
      delete tag_path(tag)
    end
    assert_redirected_to tags_path
  end

  test 'destroying a tag removes it from every post it was on' do
    tag = Tag.create!(name: 'shared')
    posts(:most_recent).tags << tag
    posts(:older_post).tags << tag
    login_as(@andre, Rails.application.credentials.dig(:password, :admin_user_password))

    assert_difference 'Tag.count', -1 do
      delete tag_path(tag)
    end
    assert_not posts(:most_recent).reload.tags.include?(tag)
    assert_not posts(:older_post).reload.tags.include?(tag)
  end
end
