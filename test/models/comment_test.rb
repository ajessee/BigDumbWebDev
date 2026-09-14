# frozen_string_literal: true

require 'test_helper'

class CommentTest < ActiveSupport::TestCase
  def setup
    @user = users(:one)
    @post = posts(:most_recent)
    @comment = @post.comments.build(user_id: @user.id, content: 'Great post!')
  end

  test 'should be valid' do
    assert @comment.valid?
  end

  test 'user_id should be present' do
    @comment.user_id = nil
    assert_not @comment.valid?
  end

  test 'commentable should be present' do
    @comment.commentable = nil
    assert_not @comment.valid?
  end

  test 'author association should return the commenting user' do
    @comment.save!
    assert_equal @user, @comment.author
  end

  test 'find_comment_post should return the post for a top-level comment' do
    @comment.save!
    assert_equal @post, @comment.find_comment_post
  end

  test 'find_comment_post should recurse through nested replies to find the post' do
    @comment.save!
    reply = @comment.comments.create!(user_id: @user.id, content: 'A reply')
    assert_equal @post, reply.find_comment_post
  end

  test 'destroying a comment should destroy its replies' do
    @comment.save!
    @comment.comments.create!(user_id: @user.id, content: 'A reply')
    assert_difference 'Comment.count', -2 do
      @comment.destroy
    end
  end

  test 'order should be most recent first' do
    @comment.save!
    older_reply = @comment.comments.create!(user_id: @user.id, content: 'Older reply', created_at: 1.day.ago)
    newer_reply = @comment.comments.create!(user_id: @user.id, content: 'Newer reply', created_at: 1.hour.ago)
    assert_equal [newer_reply, older_reply], @comment.comments.to_a
  end
end
