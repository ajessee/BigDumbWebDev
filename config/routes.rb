# frozen_string_literal: true

Rails.application.routes.draw do
  # Health check endpoint for uptime monitors / Heroku, matching Rails 8's own generator default.
  get "up" => "rails/health#show", as: :rails_health_check

  # Root
  root    'hello#home'
  get     'hello/home'

  # iFrame for 3d scroll
  get '/scroll3d', to: 'projects#scroll3d'

  # Sessions and new users
  get '/signup', to: 'users#new'
  post '/signup', to: 'users#create'
  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'
  get '/cookie_info', to: 'notifications#cookie_info'
  get '/signup_login_info', to: 'notifications#signup_login_info'
  get '/notifications', to: 'notifications#fetch_notifications'
  post '/fowarding_info', to: 'notifications#forwarding_ready'
  post '/check_diffs', to: 'posts#check_diffs'
  # These three were originally GET (state-changing routes shouldn't be - see
  # UPGRADE-PLAN.md): demote_guest reverts a guest_2 back to guest_1, remove_image/
  # remove_resume detach an attachment. PATCH for the former (an update), DELETE for the
  # latter two (a removal).
  patch '/demote_guest', to: 'users#demote_guest'
  delete '/remove_user_image/:id', to: 'users#remove_image', as: 'remove_user_image'
  delete '/remove_user_resume/:id', to: 'users#remove_resume', as: 'remove_user_resume'

  # Account Activation
  resources :account_activations, only: [:edit]

  # Password Resets
  resources :password_resets, only: %i[new create edit update]

  # Projects
  resources :projects, param: :slug

  # Users
  resources   :users

  # Posts
  resources   :posts, param: :slug

  # Comments
  resources   :comments

  # Tags
  resources   :tags

  # Custom HTTP status pages
  get 'errors/bad_request'
  get '/400', to: 'errors#bad_request'
  get 'errors/unauthorized'
  get '/401', to: 'errors#unauthorized'
  get 'errors/forbidden'
  get '/403', to: 'errors#forbidden'
  get 'errors/not_found'
  get '/404', to: 'errors#not_found'
  get 'errors/internal_server_error'
  get '/500', to: 'errors#internal_server_error'

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
