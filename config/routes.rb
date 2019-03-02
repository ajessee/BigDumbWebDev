Rails.application.routes.draw do

  # Root

  root    'hello#home'
  
  get     'hello/home'

  # Sessions and new users
  
  get     '/signup',  to: 'users#new'
  
  post    '/signup',  to: 'users#create'
  
  get     '/login', to: 'sessions#new'
  
  post    '/login', to: 'sessions#create'
  
  delete  '/logout', to: 'sessions#destroy'
  
  get     '/cookie_info', to: 'sessions#info'

  # Projects (TODO: Convert to resource?)

  get     'projects', to: 'projects#projects'

  get     'projects/todo', to: 'projects#todo'

  get     'projects/loan-calculator', to: 'projects#calculator'

  get     'projects/number-guesser', to: 'projects#number_guesser'

  get     'projects/contacts', to: 'projects#contacts'

  # Users

  resources   :users

  # Custom HTTP status pages

  get 'errors/bad_request'

  get 'errors/unauthorized'

  get 'errors/forbidden'

  get 'errors/not_found'

  get 'errors/internal_server_error'

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
