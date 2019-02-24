Rails.application.routes.draw do

  root    'hello#home'
  
  get     'hello/home'
  
  get     '/signup',  to: 'users#new'
  
  post    '/signup',  to: 'users#create'
  
  get     '/login', to: 'sessions#new'
  
  post    '/login', to: 'sessions#create'
  
  delete  '/logout', to: 'sessions#destroy'
  
  get     '/cookie_info', to: 'sessions#info'

  get     'projects', to: 'projects#projects'

  get     'projects/todo', to: 'projects#todo'

  get     'projects/loan-calculator', to: 'projects#calculator'

  get     'projects/number-guesser', to: 'projects#number_guesser'

  get     'projects/contacts', to: 'projects#contacts'

  resources   :users

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
