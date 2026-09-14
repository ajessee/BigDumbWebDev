# frozen_string_literal: true

require 'test_helper'

class CommentsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @andre = users(:one)
    @natalya = users(:three)
    @post = posts(:most_recent)
  end

  test 'logged in user comment is always attributed to the actual current user, not a spoofed user_id param' do
    login_as(@natalya, 'password') # matches test/fixtures/users.yml
    assert_difference 'Comment.count' do
      post comments_path,
           params: { comment: { post_id: @post.id, content: 'Nice post!', user_id: @andre.id } },
           xhr: true
    end
    comment = Comment.last
    assert_equal @natalya, comment.author
    assert_not_equal @andre, comment.author
  end

  test 'guest comment creates a guest user and attributes the comment to them' do
    assert_difference 'User.count', 1 do
      post comments_path,
           params: { comment: { post_id: @post.id, content: 'Nice post!', first_name: 'Gary', last_name: 'Guest' } },
           xhr: true
    end
    comment = Comment.last
    assert comment.author.guest_1?
    assert_equal 'Gary', comment.author.first_name
  end

  test 'should redirect edit to forbidden path when logged in as wrong user' do
    comment = @post.comments.create!(user_id: @andre.id, content: 'Original comment')
    login_as(@natalya, 'password')
    get edit_comment_path(comment)
    assert_redirected_to errors_forbidden_path
  end

  test 'should redirect destroy to forbidden path when logged in as wrong user' do
    comment = @post.comments.create!(user_id: @andre.id, content: 'Original comment')
    login_as(@natalya, 'password')
    assert_no_difference 'Comment.count' do
      delete comment_path(comment)
    end
    assert_redirected_to errors_forbidden_path
  end
end
