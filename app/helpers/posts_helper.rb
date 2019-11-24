module PostsHelper
  def generate_random_hex_color
    '#' + Random.new.bytes(3).unpack("H*")[0]
  end

  def create_diff_payload(currentContent, savedContent)
    titleDiff = Diffy::SplitDiff.new(currentContent["title"], savedContent["title"], :format => :html)
    titleDiffText = Diffy::Diff.new(currentContent["title"], savedContent["title"], ignore_crlf: true).string2
    titleDiffEmpty = titleDiffText ? titleDiffText.empty? : true
    contentDiff = Diffy::SplitDiff.new(currentContent["content"], savedContent["content"], :format => :html)
    contentDiffText = Diffy::SplitDiff.new(currentContent["content"], savedContent["content"]).instance_values["diff"]
    contentDiffEmpty = contentDiffText.empty?
    tagsDiff = Diffy::SplitDiff.new(currentContent["tags"], savedContent["tags"], :format => :html)
    tagsDiffText = Diffy::Diff.new(currentContent["tags"], savedContent["tags"], ignore_crlf: true).string2
    tagsDiffEmpty = tagsDiffText ? tagsDiffText.empty? : true
    publishedDiff = Diffy::SplitDiff.new(currentContent["published"], savedContent["published"], :format => :html) 
    publishedDiffTextDiff = Diffy::Diff.new(currentContent["published"], savedContent["published"], ignore_crlf: true)
    publishedDiffEmpty = publishedDiffTextDiff.diff.empty? 
    publishedDiffText = publishedDiffEmpty ? "" : publishedDiffTextDiff.string2 
    allEmpty = titleDiffEmpty && contentDiffEmpty && tagsDiffEmpty && publishedDiffEmpty
    newPost = currentContent["empty"] == "true"
    response_hash =  {
        currentContent: currentContent,
        savedContent: savedContent,
        titleDiff: titleDiff,
        titleDiffText: titleDiffText,
        titleDiffEmpty: titleDiffEmpty,
        contentDiff: contentDiff,
        contentDiffText: contentDiffText,
        contentDiffEmpty: contentDiffEmpty,
        tagsDiff: tagsDiff,
        tagsDiffText: tagsDiffText,
        tagsDiffEmpty: tagsDiffEmpty,
        publishedDiff: publishedDiff,
        publishedDiffText: publishedDiffText,
        publishedDiffEmpty: publishedDiffEmpty,
        allEmpty: allEmpty,
        newPost: newPost
      }
  end

end
