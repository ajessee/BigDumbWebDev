# frozen_string_literal: true

module NavMenu
  def open_nav_menu
    page.driver.browser.execute_script("document.querySelector('#nav-button-container').style.transition = 'none'")
    page.driver.browser.execute_script("document.querySelector('#nav-button-container').style.top = '0'")
    page.driver.browser.execute_script("document.querySelector('#nav-button-container').style.display = 'block'")
    assert find('button#nav-button').click
  end
end
