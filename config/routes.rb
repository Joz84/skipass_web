Rails.application.routes.draw do
  resources :stations
  devise_for :users
  root to: 'pages#home'
end
