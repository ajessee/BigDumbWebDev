source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem 'rails'                   
gem 'bcrypt'                  
gem 'faker'                  
gem 'carrierwave'            
gem 'mini_magick'            
gem 'will_paginate'          
gem 'bootstrap-will_paginate'
gem 'bootstrap-sass'         
gem 'puma'                   
gem 'sass-rails'             
gem 'uglifier'               
gem 'jquery-rails'           
gem 'jbuilder'               

group :development, :test do
  gem 'byebug',  '9.0.6', platform: :mri
end

group :development do
  gem 'web-console'           
  gem 'listen'                
  gem 'spring'                
  gem 'spring-watcher-listen' 
end

group :test do
  gem 'rails-controller-testing' 
  gem 'minitest-reporters'       
  gem 'guard'                    
  gem 'guard-minitest'           
end

group :production do
  gem 'pg'  
  gem 'fog' 
end
