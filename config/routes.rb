Rails.application.routes.draw do
  devise_for :users, path: "/api/v1", :controllers => { passwords: 'passwords',
    sessions: 'sessions', registrations: 'registrations' }
  # match '*path', to: 'hello_world#index'
  root 'welcome#index'
  namespace :api do
    namespace :v1 do
      resources :lesson_statuses, only: [:index]
      resources :sections, only: [:index, :create]
      resources :students, only: [:index, :show, :create]
      resources :lesson_date_times, only: [:index, :create, :show, :update, :destroy] do
        post 'move'
        post 'resize'
        resources :lesson_date_time_horses, only: [:index]
        collection do
          get 'get_makeupLessons'
        end
      end
      resources :enrollment_statuses, only: [:index]
      resources :horses, only: [:index, :create] do
        get "horses_report", on: :collection
      end
      resources :programs, only: [:index, :create]
      resources :program_types, only: [:index, :create]
      resources :products, only: [:index, :create]
      resources :instructors, only: [:index, :create]
      resources :farms, only: [:index, :create]
      resources :locations, only: [:index, :create]
      resources :day_of_weeks, only: [:index, :create]
      resources :repeat_types, only: [:index, :create]
      resources :reporting_categories, only: [:index, :create]
      resources :lesson_people, only: [:index, :create] do
        collection do
          post 'actionStatus'
        end
      end
      resources :clients, only: [:index, :create] do
        post 'client'
        post 'lessons'
        collection do
          post 'addClient'
        end
      end
    end
  end
  get '*path' , to: 'welcome#index'
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end