Rails.application.routes.draw do

  root 'hello#home'
  
  get 'hello/home'

  get 'projects', to: 'projects#projects'

  get 'projects/todo', to: 'projects#todo'

  get 'projects/loan-calculator', to: 'projects#calculator'

  get 'projects/number-guesser', to: 'projects#number_guesser'

  get 'projects/contacts', to: 'projects#contacts'

  get  '/signup',  to: 'users#new'
  
  post  '/signup',  to: 'users#create'

  resources :users

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
