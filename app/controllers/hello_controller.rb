class HelloController < ApplicationController
  def home
    if flash[:warning]
      store_message({
        title: 'Account Not Activated',
        message: flash[:warning],
        type: 'alert'
      })
    end
  end
end
