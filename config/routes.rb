Rails.application.routes.draw do
  
  root 'hello#home'
  
  get 'hello/home'

  get 'projects/todo' => 'projects#todo'

  get 'projects/loan-calculator' => 'projects#calculator'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
