# frozen_string_literal: true

require 'test_helper'

class TagTest < ActiveSupport::TestCase
  def setup
    @tag = Tag.new(name: 'ruby')
  end

  test 'should be valid' do
    assert @tag.valid?
  end

  test 'should be associated with posts through taggings' do
    @tag.save!
    post = posts(:most_recent)
    Tagging.create!(tag: @tag, post: post)
    assert_includes @tag.posts, post
  end

  test 'published_post? should be true when the tag has a published post' do
    @tag.save!
    post = posts(:most_recent)
    assert post.published?
    Tagging.create!(tag: @tag, post: post)
    assert @tag.published_post?
  end

  test 'published_post? should be false when the tag has no published posts' do
    @tag.save!
    assert_not @tag.published_post?
  end

  test '.counts should return the number of posts per tag' do
    @tag.save!
    Tagging.create!(tag: @tag, post: posts(:most_recent))
    Tagging.create!(tag: @tag, post: posts(:older_post))
    result = Tag.counts.find { |row| row.id == @tag.id }
    assert_equal 2, result.count.to_i
  end
end
