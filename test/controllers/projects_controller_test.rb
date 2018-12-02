require 'test_helper'

class ProjectsControllerTest < ActionDispatch::IntegrationTest

  def setup
    @base_title = "| BDWD"
  end

  test "should get projects page" do
    get projects_url
    assert_response :success
    assert_select "title", "Projects #{@base_title}"
  end

  test "should get projects/todo page" do
    get projects_todo_url
    assert_response :success
    assert_select "title", "Todo List #{@base_title}"
  end

  test "should get projects/loan-calculator page" do
    get projects_loan_calculator_url
    assert_response :success
    assert_select "title", "Loan Calculator #{@base_title}"
  end

  test "should get projects/number-guesser page" do
    get projects_number_guesser_url
    assert_response :success
    assert_select "title", "Number Guesser #{@base_title}"
  end

  test "should get projects/contacts page" do
    get projects_contacts_url
    assert_response :success
    assert_select "title", "Contact List #{@base_title}"
  end
end
