# frozen_string_literal: true

module UserEdit
  def verify_user_edit_success_notification_ui
    assert find('p.notifications-message', text: "You\'ve successfully updated your profile")
  end

  def verify_user_show_data_ui(user)
    assert find('h2', text: "First Name: #{user.first_name}")
    assert find('h2', text: "Last Name: #{user.last_name}")
    assert find('h2', text: "Email Address: #{user.email}")
  end

  def verify_user_show_details_ui(user, new_user_info)
    assert find('div#user-show-details')
    assert find('h2', text: 'About You')
    assert find('div#user-show-details-container')
    assert find('div.trix-content')
    assert find('a#edit-user-details-button').click
    assert find('form#add-user-details')
    assert find("input#user_details_trix_input_user_#{user.id}", visible: false)
    assert find('trix-toolbar')
    assert find('trix-editor#user_details').find('div', text: user.details.body.to_plain_text)
    assert find('#cancel-edit-user-details-button').click
    assert find('#edit-user-details-button').click
    assert find('trix-editor').click.set(new_user_info[:details])
    assert find('#new-user-details-submit-button').click
    assert find('div#user-show-details-container').find('div.trix-content').find('div', text: user.details.body.to_plain_text)
  end

  def verify_user_show_picture_ui(_user)
    assert find('h2', text: 'Your Picture')
    assert find('form#add-user-image')
    assert find('div#new-user-image').find('input#user-image-choose-file')
    assert attach_file('user[image]', Rails.root + 'app/assets/images/ruby.png', make_visible: true)
    assert_not find('#edit-user-picture-button').disabled?
    assert find('#edit-user-picture-button').click
    assert find('div#user-show-picture').find('img')['src'].include? 'ruby.png'
    assert_not find('#edit-user-picture-button').disabled?
    assert find('#edit-user-picture-button').click
    assert find('#remove-user-image-button').click
    accept_confirm
    assert find('h2', text: 'Your Picture')
    assert find('form#add-user-image')
    assert find('div#new-user-image').find('input#user-image-choose-file')
    assert attach_file('user[image]', Rails.root + 'app/assets/images/ruby.png', make_visible: true)
    assert find('#cancel-user-picture-edit').click
    assert find('form#add-user-image')
    assert find('div#new-user-image').find('input#user-image-choose-file')
    assert find('#edit-user-picture-button').disabled?
  end
end
