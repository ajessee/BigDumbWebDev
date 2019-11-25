module PostsHelper
  def generate_random_hex_color
    '#' + Random.new.bytes(3).unpack("H*")[0]
  end

  def create_diff_payload(currentContent, savedContent)
    newPost = currentContent["newPost"]
    titleDiff = Diffy::SplitDiff.new(currentContent["title"], savedContent["title"], :format => :html)
    titleDiffText = Diffy::Diff.new(currentContent["title"], savedContent["title"], ignore_crlf: true).string2
    titleDiffEmpty = titleDiffText ? titleDiffText.empty? : true
    contentDiff = Diffy::SplitDiff.new(currentContent["content"], savedContent["content"], :format => :html)
    contentDiffTest = Diffy::Diff.new(currentContent["content"], savedContent["content"], ignore_crlf: true)
    contentDiffText = Diffy::SplitDiff.new(currentContent["content"], savedContent["content"]).instance_values["diff"]
    contentDiffEmpty = contentDiffText.empty?
    tagsDiff = Diffy::SplitDiff.new(currentContent["tags"], savedContent["tags"], :format => :html)
    tagsDiffTest = Diffy::Diff.new(currentContent["tags"], savedContent["tags"], ignore_crlf: true)
    tagsDiffEmpty = tagsDiffTest.diff.empty?
    tagsDiffText = tagsDiffTest.string2
    if savedContent["published"] == nil
      publishedDiffEmpty = true
    else
      publishedDiffEmpty = currentContent["published"] == savedContent["published"] ? true : false
    end
    publishedDiff = Diffy::SplitDiff.new(currentContent["published"], savedContent["published"], :format => :html) 
    currentPublished = currentContent["published"] 
    savedPublished = savedContent["published"] 
    allEmpty = titleDiffEmpty && contentDiffEmpty && tagsDiffEmpty && publishedDiffEmpty
    
    response_hash =  {
        currentContent: currentContent,
        savedContent: savedContent,
        titleDiff: titleDiff,
        titleDiffText: titleDiffText,
        titleDiffEmpty: titleDiffEmpty,
        contentDiff: contentDiff,
        contentDiffTest: contentDiffTest,
        contentDiffText: contentDiffText,
        contentDiffEmpty: contentDiffEmpty,
        tagsDiff: tagsDiff,
        tagsDiffText: tagsDiffText,
        tagsDiffTest: tagsDiffTest,
        tagsDiffEmpty: tagsDiffEmpty,
        publishedDiff: publishedDiff,
        publishedDiffEmpty: publishedDiffEmpty,
        currentPublished: currentPublished,
        savedPublished: savedPublished,
        allEmpty: allEmpty,
        newPost: newPost
      }
  end

end
