Pos::Application.routes.draw do

  #orders
  match 'order' => "order#create", :via => :post
  match 'outstanding_orders' => "order#create_outstanding", :via => :post

  #menu_pages routes
  post "menu_page/create"
  put "menu_page/update"
  delete "menu_page/destroy"

  #menu_items routes
  post "menu_item/create"
  put "menu_item/update"
  delete "menu_item/destroy"

  #routes for screens to login etc
  match 'home' => "home#index"
  get "home/active_employees"

  #init the sales screen buttons based on role permissions
  match 'init_sales_screen_buttons' => "home#init_sales_screen_buttons"

  match 'login' => "home#login", :via => :post
  match 'logout' => "home#logout", :via => :post
  match 'clockout' => "home#clockout", :via => :post

  # admin homepage
  match 'admin' => "admin/home#index"

  namespace :admin do
    resources :displays do
      member do
        get 'builder'
        post 'default'
        
        #menu builder ajax functions
        post 'place_product'
        post 'delete_menu_item'
        post 'create_menu_page'
        post 'delete_menu_page'
        post 'rename_menu_page'
      end
    end
       
    resources :employees
    resources :categories
    resources :products
    resources :roles
    resources :modifier_categories
    
    #display_button routes
    resources :display_buttons, :only => [:index] do
      collection do
        get 'screen'
        get 'access'
        post 'update_admin_screen_button_role'
        post 'update_sales_screen_button_role'
      end
    end

  end

  match 'javascripts/:action.:format' => "javascripts"

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
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

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => "home#index"

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
