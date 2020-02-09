# frozen_string_literal: true

require 'test_helper'

class HelloControllerTest < ActionDispatch::IntegrationTest
  def setup
    @base_title = 'Big Dumb Web Dev'
  end

  test 'should get home page' do
    get hello_home_path
    assert_response :success
    assert_select 'title', @base_title.to_s
  end
end
