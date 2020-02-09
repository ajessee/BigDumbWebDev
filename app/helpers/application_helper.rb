# frozen_string_literal: true

module ApplicationHelper
  def show_svg(path)
    File.open("app/assets/images/#{path}", 'rb') do |file|
      raw file.read
    end
  end

  def full_title(page_title = '')
    base_title = 'Big Dumb Web Dev'
    short_title = 'BDWD'
    if page_title.empty?
      base_title
    else
      page_title + ' | ' + short_title
    end
  end

  def tag_cloud(tags, classes)
    max = tags.max_by(&:count)
    tags.each do |tag|
      index = tag.count.to_f / max.count * (classes.size - 1)
      yield(tag, classes[index.round])
    end
  end

  def mobile_device
    agent = request.user_agent
    return 'tablet' if agent =~ /(tablet|ipad)|(android(?!.*mobile))/i
    return 'mobile' if agent =~ /Mobile/

    'desktop'
  end
end
