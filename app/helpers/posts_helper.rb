module PostsHelper
  def generate_random_hex_color
    '#' + Random.new.bytes(3).unpack("H*")[0]
  end
end
