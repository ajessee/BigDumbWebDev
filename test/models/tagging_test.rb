# frozen_string_literal: true

require 'test_helper'

class TaggingTest < ActiveSupport::TestCase
  def setup
    @tagging = Tagging.new(post: posts(:most_recent), tag: Tag.create!(name: 'ruby'))
  end

  test 'should be valid' do
    assert @tagging.valid?
  end

  test 'post should be present' do
    @tagging.post = nil
    assert_not @tagging.valid?
  end

  test 'tag should be present' do
    @tagging.tag = nil
    assert_not @tagging.valid?
  end
end
