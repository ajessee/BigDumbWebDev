# frozen_string_literal: true

require 'test_helper'

class ProjectsControllerTest < ActionDispatch::IntegrationTest
  # Remember that these controller tests use fixtures instead of the data that is in the database
  def setup
    @base_title = '| BDWD'
  end

  test 'should get projects page' do
    get projects_path
    assert_response :success
    assert_select 'title', "Projects #{@base_title}"
  end

  test 'should get projects/todo page' do
    get project_path(slug: 'todo-list')
    assert_response :success
    assert_select 'title', "Todo List #{@base_title}"
  end

  test 'should get projects/loan-calculator page' do
    get project_path(slug: 'loan-calculator')
    assert_response :success
    assert_select 'title', "Loan Calculator #{@base_title}"
  end

  test 'should get projects/number-guesser page' do
    get project_path(slug: 'yoda-number-guesser')
    assert_response :success
    assert_select 'title', "Number Guesser #{@base_title}"
  end

  test 'should get projects/contacts page' do
    get project_path(slug: 'contacts-list')
    assert_response :success
    assert_select 'title', "Contact List #{@base_title}"
  end
end
