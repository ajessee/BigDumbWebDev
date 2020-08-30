# frozen_string_literal: true

require 'test_helper'

class PostTest < ActiveSupport::TestCase
  # Remember that these controller tests use fixtures instead of the data that is in the database
  def setup
    @user = users(:one)
    @post = @user.posts.build(title: 'Test Post', content: 'Lorem ipsum')
  end

  test 'should be valid' do
    assert @post.valid?
  end

  test 'user id should be present' do
    @post.user_id = nil
    assert_not @post.valid?
  end

  test 'title should be present' do
    @post.title = '   '
    assert_not @post.valid?
  end

  test 'content should be present' do
    @post.content = '   '
    assert_not !@post.content.blank?
  end

  test 'order should be most recent first' do
    assert_equal posts.first, Post.first
  end
end
