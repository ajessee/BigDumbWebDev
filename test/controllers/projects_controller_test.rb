require 'test_helper'

class ProjectsControllerTest < ActionDispatch::IntegrationTest
  test "should get projects" do
    get projects_projects_url
    assert_response :success
  end

  test "should get todo" do
    get projects_todo_url
    assert_response :success
  end

  test "should get calculator" do
    get projects_calculator_url
    assert_response :success
  end

  test "should get number_guesser" do
    get projects_number_guesser_url
    assert_response :success
  end

  test "should get contacts" do
    get projects_contacts_url
    assert_response :success
  end

end
