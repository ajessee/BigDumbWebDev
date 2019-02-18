require 'test_helper'

class UserTest < ActiveSupport::TestCase
  # assert( test, [msg] )	Ensures that test is true.
  # refute( test, [msg] )	Ensures that test is false.
  # assert_equal( expected, actual, [msg] )	Ensures that expected == actual is true.

  def setup
    @user = User.new(name: "Testy McTests", email: "testerDude@testy.com", password: "testThis", password_confirmation: "testThis")
  end

  test "should be a valid user" do
    assert @user.valid?
  end

  test "user name should be present" do
    @user.name = "      "
    refute @user.valid?
  end

  test "user email should be present" do
    @user.email = "      "
    refute @user.valid?
  end

  test "user name should not be longer than 50 characters" do
    @user.name = "a" * 51
  end

  test "user email should not be longer than 255 characters" do
    @user.email = "a" * 244 + "@example.com"
  end

  test "user email validation should accept valid user email addresses" do
    valid_addresses = %w[user@example.com USER@foo.COM A_US-ER@foo.bar.org first.last@foo.jp alice+bob@baz.cn]
    valid_addresses.each do |valid_address|
      @user.email = valid_address
      assert @user.valid?, "#{valid_address.inspect} should be valid" #string is second parameter, lets you add custom error message
    end
  end

  test "user email validation should reject invalid user email addresses" do
    invalid_addresses = %w[user@example,com user_at_foo.org user.name@example. foo@bar_baz.com foo@bar+baz.com]
    invalid_addresses.each do |invalid_address|
      @user.email = invalid_address
      refute @user.valid?, "#{invalid_address.inspect} should be valid" #string is second parameter, lets you add custom error message
    end
  end

  test "user email should be unique" do
    duplicate_user = @user.dup #create duplicate user
    duplicate_user.email = @user.email.upcase #upcase the dup user email to confirm uniqueness (see user_test.rb)
    @user.save #actually save to test database 
    refute duplicate_user.valid?
  end

  test "user email addresses should be saved as lower-case" do
    mixed_case_email = "Foo@ExAMPle.CoM"
    @user.email = mixed_case_email
    @user.save
    assert_equal mixed_case_email.downcase, @user.reload.email
  end

  test "user password should be present (nonblank)" do
    @user.password = @user.password_confirmation = " " * 6 # multiple assignment, both password and password_confirmation are being assigned
    refute @user.valid?
  end

  test "user password should have a minimum length" do
    @user.password = @user.password_confirmation = "a" * 7
    refute @user.valid?
  end

  test "authenticated? should return false for a user with nil digest" do
    assert_not @user.authenticated?('')
  end

end
