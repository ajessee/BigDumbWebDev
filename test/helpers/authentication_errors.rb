# frozen_string_literal: true

module AuthenticationErrors
  def forbidden_user_not_admin
    assert find('section.http-error-container')
    assert find('p', text: 'Only admin users are allowed to do that')
    assert find('h3', text: 'HTTP Status Code: 403')
    assert page.current_path == '/errors/forbidden'
    assert find('a', text: 'Take Me Home').click
    assert page.current_path == '/'
  end

  def forbidden_incorrect_user
    assert find('section.http-error-container')
    assert find('p', text: 'You definitely shouldn\'t be trying to access another user\'s resources')
    assert find('h3', text: 'HTTP Status Code: 403')
    assert page.current_path == '/errors/forbidden'
    assert find('a', text: 'Take Me Home').click
    assert page.current_path == '/'
  end

  def forbidden_user_not_logged_in
    assert find('section.http-error-container')
    assert find('p', text: 'You need to log in to do that')
    assert find('h3', text: 'HTTP Status Code: 401')
    assert page.current_path == '/errors/unauthorized'
    assert find('a', text: 'Log In').click
    assert page.current_path == '/'
  end
end
