# frozen_string_literal: true

module UserComment
  def go_to_first_post
    visit('/posts')
    first('a').click
  end

  def open_comment_section
    assert find('a#add-new-comment-button', text: 'Add Comment').click
  end

  def fill_and_submit_comment(guest)
    assert fill_in 'comment[first_name]', with: guest[:first_name]
    assert fill_in 'comment[last_name]', with: guest[:last_name]
    assert find('trix-editor').click.set(guest[:comment])
    assert find('#new-comment-submit-button').click
  end

  def verify_comment_form_elements_ui
    assert find('form#new-comment')
    assert find('input#comment_first_name')
    assert find('input#comment_last_name')
    assert find('trix-editor#comment_content')
  end

  def verify_comment_created_correctly_ui(guest)
    assert find('div.show-comment-body', text: guest[:first_name] + ' ' + guest[:last_name])
    assert find('div.trix-content', text: guest[:comment])
  end

  def verify_returning_guest_user_notification_ui
    assert find('p.notifications-message', text: 'It looks like you\'ve made a comment before, so we\'ve stored your name to make it a little easier to sign up for an account')
  end

  def pull_guest_comment_from_database(guest_user)
    Comment.find_by(user_id: guest_user.id)
  end

  def validate_guest_user(guest, guest_user)
    assert guest_user.first_name == guest[:first_name]
    assert guest_user.last_name == guest[:last_name]
    assert guest_user.guest_1?
  end

  def validate_new_user(guest, new_user)
    assert new_user.first_name == guest[:first_name]
    assert new_user.last_name == guest[:last_name]
    assert new_user.email == guest[:email]
    assert new_user.user?
  end

  def validate_comment_text(guest, comment)
    assert comment.content.body.to_plain_text.include? guest[:comment]
  end
end
