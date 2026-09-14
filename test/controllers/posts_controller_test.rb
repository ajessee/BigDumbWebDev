# frozen_string_literal: true

require 'test_helper'

class PostsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @andre = users(:one) # the only admin; PostsController assumes @andre is the site's one author
    @natalya = users(:three)
    @published_post = posts(:most_recent)
    @unpublished_post = posts(:older_post)
    @unpublished_post.update!(published: false)
  end

  test 'should get index' do
    get posts_path
    assert_response :success
  end

  test 'should get index when logged in as admin' do
    login_as(@andre, Rails.application.credentials.dig(:password, :admin_user_password))
    get posts_path
    assert_response :success
  end

  test 'should show a published post to a non-admin visitor' do
    get post_path(@published_post)
    assert_response :success
  end

  test 'should not show an unpublished post to a non-admin visitor' do
    get post_path(@unpublished_post)
    assert_redirected_to errors_not_found_path
  end

  test 'should show an unpublished post to an admin' do
    login_as(@andre, Rails.application.credentials.dig(:password, :admin_user_password))
    get post_path(@unpublished_post)
    assert_response :success
  end

  test 'should redirect to forbidden path when a non-admin tries to create a post' do
    login_as(@natalya, 'password') # matches test/fixtures/users.yml
    assert_no_difference 'Post.count' do
      post posts_path, params: { post: { title: 'New Post', content: 'Some content' } }
    end
    assert_redirected_to errors_forbidden_path
  end

  test 'admin can create a post' do
    login_as(@andre, Rails.application.credentials.dig(:password, :admin_user_password))
    assert_difference 'Post.count', 1 do
      post posts_path, params: { post: { title: 'New Post', content: 'Some content' } }
    end
    assert_redirected_to post_path(Post.find_by!(title: 'New Post'))
  end

  test 'should redirect to forbidden path when a non-admin tries to update a post' do
    login_as(@natalya, 'password')
    patch post_path(@published_post), params: { post: { title: 'Hijacked title' } }
    assert_redirected_to errors_forbidden_path
    assert_not_equal 'Hijacked title', @published_post.reload.title
  end

  test 'should redirect to forbidden path when a non-admin tries to destroy a post' do
    login_as(@natalya, 'password')
    assert_no_difference 'Post.count' do
      delete post_path(@published_post)
    end
    assert_redirected_to errors_forbidden_path
  end

  test 'admin can destroy a post' do
    login_as(@andre, Rails.application.credentials.dig(:password, :admin_user_password))
    assert_difference 'Post.count', -1 do
      delete post_path(@published_post)
    end
  end

  test 'check_diffs reports no differences when content is unchanged' do
    # Diffy's diff text isn't empty just because the two inputs are equal (it still
    # returns the content itself) - all_empty really means "nothing typed in either yet".
    payload = { title: '', content: '', tags: '', published: 'true' }.stringify_keys
    post check_diffs_path,
         params: { currentContent: payload, savedContent: payload }.to_json,
         headers: { 'CONTENT_TYPE' => 'application/json' }
    assert_response 204
  end

  test 'check_diffs reports differences when content changed' do
    current = { title: 'New Title', content: 'Same', tags: '', published: 'true' }.stringify_keys
    saved = { title: 'Old Title', content: 'Same', tags: '', published: 'true' }.stringify_keys
    post check_diffs_path,
         params: { currentContent: current, savedContent: saved }.to_json,
         headers: { 'CONTENT_TYPE' => 'application/json' }
    assert_response :success
    body = JSON.parse(response.body)
    assert_not body['payload']['titleDiffEmpty']
  end
end
