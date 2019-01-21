Rails.application.routes.draw do
  root 'hello#home'
  get 'projects/projects'
  get 'projects/todo'
  get 'projects/calculator'
  get 'projects/number_guesser'
  get 'projects/contacts'
  get 'hello/home'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
