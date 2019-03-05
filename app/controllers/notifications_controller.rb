class NotificationsController < ApplicationController

  @@forwarding_needed = false

  def cookie_info
  end

  def get_notifications
    if @@forwarding_needed 
      @@forwarding_needed = false
      @location = get_location
      clear_location
      @location
    elsif notification_message?
      @new_message = get_message
    end
  end

  def forwarding_ready
    @@forwarding_needed = true
  end
end
