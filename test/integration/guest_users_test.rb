# frozen_string_literal: true

require 'test_helper'

class GuestUsersTest < ActionDispatch::IntegrationTest
  # Remember that these controller tests use fixtures instead of the data that is in the database
  # This setup method will be called at the beginning of each test run
  def setup
    Capybara.current_driver = :selenium_chrome
  end

  test 'Create guest comment with first and last name and comment' do
    guest_first_name = 'John'
    guest_last_name = 'BarleyCorn'
    guest_comment = 'I really like what you\'ve done here!'
    visit('/posts')
    first('a').click
    assert page.find('a#add-new-comment-button', text: 'Add Comment').click
    assert page.find('form#new-comment')
    assert page.find('input#comment_first_name')
    assert fill_in 'comment[first_name]', with: guest_first_name
    assert page.find('input#comment_last_name')
    assert fill_in 'comment[last_name]', with: guest_last_name
    assert page.find('trix-editor#comment_content')
    assert page.find('trix-editor').click.set(guest_comment)
    assert page.find('#new-comment-submit-button').click
    assert page.find('div.show-comment-body', text: guest_first_name + ' ' + guest_last_name)
    assert page.find('div.trix-content', text: guest_comment)
    guest_user = User.last
    comment = Comment.find_by(user_id: guest_user.id)
    assert guest_user.first_name == guest_first_name
    assert guest_user.last_name == guest_last_name
    assert guest_user.guest_1?
    assert comment.content.body.to_plain_text.include? guest_comment
  end

  test 'Create guest comment with no first or last name provided' do
    guest_comment = 'I really like what you\'ve done here!'
    visit('/posts')
    first('a').click
    assert page.find('a#add-new-comment-button', text: 'Add Comment').click
    assert page.find('form#new-comment')
    assert page.find('input#comment_first_name')
    assert page.find('input#comment_last_name')
    assert page.find('trix-editor#comment_content')
    assert page.find('trix-editor').click.set(guest_comment)
    assert page.find('#new-comment-submit-button').click
    assert page.find('div.show-comment-body', text: 'Anonymous Guest User')
    assert page.find('div.trix-content', text: guest_comment)
    guest_user = User.last
    comment = Comment.find_by(user_id: guest_user.id)
    assert guest_user.first_name == 'Anonymous'
    assert guest_user.last_name == 'Guest User'
    assert guest_user.guest_1?
    assert comment.content.body.to_plain_text.include? guest_comment
  end

  test 'Create guest comment with first and last name and comment, then sign up for full user account' do
    guest_first_name = 'John'
    guest_last_name = 'BarleyCorn'
    guest_comment = 'I really like what you\'ve done here!'
    guest_email = 'john@barleycorn.com'
    guest_password = 'lovefarmers123'
    visit('/posts')
    first('a').click
    assert page.find('a#add-new-comment-button', text: 'Add Comment').click
    assert fill_in 'comment[first_name]', with: guest_first_name
    assert fill_in 'comment[last_name]', with: guest_last_name
    assert page.find('trix-editor').click.set(guest_comment)
    assert page.find('#new-comment-submit-button').click
    assert page.find('div.trix-content', text: guest_comment)
    guest_user = User.last
    comment = Comment.find_by(user_id: guest_user.id)
    assert guest_user.first_name == guest_first_name
    assert guest_user.last_name == guest_last_name
    assert guest_user.guest_1?
    assert comment.content.body.to_plain_text.include? guest_comment
    assert page.find('a#add-new-comment-button', text: 'Add Comment').click
    assert page.find('button#get-edit-guest-user-button', text: 'Sign Up').click
    assert page.find('p.notifications-message', text: 'It looks like you\'ve made a comment before, so we\'ve stored your name to make it a little easier to sign up for an account')
    assert page.find('form#new-user').find_field('First name').value == guest_first_name
    assert page.find('form#new-user').find_field('Last name').value == guest_last_name
    assert page.find('form#new-user').find_field('Email')
    assert fill_in 'user[email]', with: guest_email
    assert page.find('form#new-user').find_field('Password')
    assert fill_in 'user[password]', with: guest_password
    assert page.find('form#new-user').find_field('Confirmation')
    assert fill_in 'user[password_confirmation]', with: guest_password
    assert page.find('form#new-user').find('input#new-user-submit-button').click
    assert page.find('p.notifications-message', text: 'Thanks for submitting your information. Please check your email to activate your account.')
    new_user = User.find_by(email: guest_email)
    assert new_user.first_name == guest_first_name
    assert new_user.last_name == guest_last_name
    assert new_user.email == guest_email
    assert new_user.user?
  end

  test 'Create guest comment with first and last name and comment, then sign up for full user account with bad email' do
    guest_first_name = 'John'
    guest_last_name = 'BarleyCorn'
    guest_comment = 'I really like what you\'ve done here!'
    guest_password = 'lovefarmers123'
    visit('/posts')
    first('a').click
    assert page.find('a#add-new-comment-button', text: 'Add Comment').click
    assert fill_in 'comment[first_name]', with: guest_first_name
    assert fill_in 'comment[last_name]', with: guest_last_name
    assert page.find('trix-editor').click.set(guest_comment)
    assert page.find('#new-comment-submit-button').click
    assert page.find('div.trix-content', text: guest_comment)
    guest_user = User.last
    comment = Comment.find_by(user_id: guest_user.id)
    assert guest_user.first_name == guest_first_name
    assert guest_user.last_name == guest_last_name
    assert guest_user.guest_1?
    assert comment.content.body.to_plain_text.include? guest_comment
    assert page.find('a#add-new-comment-button', text: 'Add Comment').click
    assert page.find('button#get-edit-guest-user-button', text: 'Sign Up').click
    assert fill_in 'user[email]', with: 'a!@c.com'
    assert fill_in 'user[password]', with: guest_password
    assert fill_in 'user[password_confirmation]', with: guest_password
    assert page.find('form#new-user').find('input#new-user-submit-button').click
    assert page.find('span.error_explanation', text: 'Email is invalid')
  end

  test 'Create guest comment with first and last name and comment, then sign up for full user account with bad password' do
    guest_first_name = 'John'
    guest_last_name = 'BarleyCorn'
    guest_comment = 'I really like what you\'ve done here!'
    guest_email = 'john@barleycorn.com'
    guest_password = 'lovefarmers123'
    visit('/posts')
    first('a').click
    assert page.find('a#add-new-comment-button', text: 'Add Comment').click
    assert fill_in 'comment[first_name]', with: guest_first_name
    assert fill_in 'comment[last_name]', with: guest_last_name
    assert page.find('trix-editor').click.set(guest_comment)
    assert page.find('#new-comment-submit-button').click
    assert page.find('div.trix-content', text: guest_comment)
    guest_user = User.last
    comment = Comment.find_by(user_id: guest_user.id)
    assert guest_user.first_name == guest_first_name
    assert guest_user.last_name == guest_last_name
    assert guest_user.guest_1?
    assert comment.content.body.to_plain_text.include? guest_comment
    assert page.find('a#add-new-comment-button', text: 'Add Comment').click
    assert page.find('button#get-edit-guest-user-button', text: 'Sign Up').click
    assert fill_in 'user[email]', with: guest_email
    assert fill_in 'user[password]', with: 'nope'
    assert fill_in 'user[password_confirmation]', with: guest_password
    assert page.find('form#new-user').find('input#new-user-submit-button').click
    assert page.find('span.error_explanation', text: 'Password is too short')
  end
end
