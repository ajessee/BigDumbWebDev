# frozen_string_literal: true

module PostsHelper
  def generate_random_hex_color
    '#' + Random.new.bytes(3).unpack1('H*')
  end

  def create_diff_payload(current_content, saved_content)
    new_post = current_content['new_post']
    title_diff = Diffy::SplitDiff.new(current_content['title'], saved_content['title'], format: :html)
    title_diff_test = Diffy::Diff.new(current_content['title'], saved_content['title'], ignore_crlf: true)
    title_diff_text = title_diff_test.string2
    title_diff_empty = title_diff_text ? title_diff_text.empty? : true
    content_diff = Diffy::SplitDiff.new(current_content['content'], saved_content['content'], format: :html)
    content_diff_test = Diffy::Diff.new(current_content['content'], saved_content['content'], ignore_crlf: true)
    content_diff_text = content_diff_test.string2
    content_diff_empty = content_diff_text ? content_diff_text.empty? : true
    tags_diff = Diffy::SplitDiff.new(current_content['tags'], saved_content['tags'], format: :html)
    tags_diff_test = Diffy::Diff.new(current_content['tags'], saved_content['tags'], ignore_crlf: true)
    tags_diff_text = tags_diff_test.string2
    tags_diff_empty = tags_diff_text ? tags_diff_text.empty? : true
    published_diff_empty = if saved_content['published'].nil?
                             true
                           else
                             current_content['published'] == saved_content['published']
                           end
    published_diff = Diffy::SplitDiff.new(current_content['published'], saved_content['published'], format: :html)
    current_published = current_content['published']
    saved_published = saved_content['published']
    all_empty = title_diff_empty && content_diff_empty && tags_diff_empty && published_diff_empty

    {
      current_content: current_content,
      saved_content: saved_content,
      title_diff: title_diff,
      title_diff_text: title_diff_text,
      title_diff_empty: title_diff_empty,
      content_diff: content_diff,
      content_diff_text: content_diff_text,
      content_diff_empty: content_diff_empty,
      tags_diff: tags_diff,
      tags_diff_text: tags_diff_text,
      tags_diff_empty: tags_diff_empty,
      published_diff: published_diff,
      published_diff_empty: published_diff_empty,
      current_published: current_published,
      saved_published: saved_published,
      all_empty: all_empty,
      new_post: new_post
    }
  end
end
