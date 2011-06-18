Pos::Application.routes.draw do

  #orders
  match 'order' => "order#create", :via => :post
  match 'sync_table_order' => "order#sync_table_order", :via => :post
  match 'cash_total' => "order#cash_total", :via => :post
  match 'outstanding_orders' => "order#create_outstanding", :via => :post

  #routes for screens to login etc
  match 'home' => "home#index"
  get "home/active_employees"
  get 'blank_receipt_for_print' => "home#blank_receipt_for_print"
  
  #this route is to call home with js polling
  match 'call_home' => "home#call_home"
  match 'request_terminal_reload' => "home#request_terminal_reload", :via => :post
        
  #init the sales screen buttons based on role permissions
  match 'init_sales_screen_buttons' => "home#init_sales_screen_buttons"

  match 'login' => "home#login", :via => :post
  match 'logout' => "home#logout", :via => :post
  match 'clockin' => "home#clockin", :via => :post
  match 'clockout' => "home#clockout", :via => :post

  #sync info page
  get 'sync_info' => "admin/home#sync_info"
  
  # admin homepage
  match 'admin' => "admin/home#index"

  namespace :admin do
    resources :displays do
      member do
        get 'builder'
        post 'duplicate'
        post 'default'
        
        #menu builder ajax functions
        post 'place_product'
        post 'delete_menu_item'
        post 'create_menu_page'
        post 'delete_menu_page'
        post 'rename_menu_page'
        post 'rename_menu_item'
        post 'rename_display'
      end
    end
       
    resources :employees
    resources :categories
    resources :roles
    resources :modifier_categories
    
    resources :tax_rates, :only => [:create, :destroy] do
      member do
        post 'default'
      end
      collection do
        post 'update_multiple'
      end
    end
    
    resources :discounts, :only => [:create, :destroy] do
      member do
        post 'default'
      end
      collection do
        post 'update_multiple'
      end
    end
    
    resources :products do
      member do
        post 'update_price'
      end
    end
    
    resources :rooms, :only => [:index, :new, :create, :destroy] do
      member do
        get 'builder'
        
        #room builder ajax functions
        post 'place_object'
        post 'label_table'
        post 'remove_table'
        post 'remove_wall'
        post 'update_grid_resolution'
        post 'dimension_change'
        post 'rename_room'
      end
    end
    
    #display_button routes
    resources :display_buttons, :only => [:index] do
      collection do
        get 'screen'
        get 'access'
        get 'edit_multiple'
        
        post 'update_admin_screen_button_role'
        post 'update_sales_screen_button_role'
        post 'update_multiple'
        post 'create_button_group'
        post 'update_multiple_groups'
        post 'destroy_button_group'
      end
    end
    
    #system settings interface
    get 'global_settings' => "global_settings#index"
    post 'update_global_settings' => "global_settings#update_multiple"

    #dynamic css that picks up styles from the styles in the settings table
    get 'custom_themes' => "custom_themes#index"
    post 'update_custom_themes' => "custom_themes#update_multiple"
    get 'custom_theme' => "custom_themes#custom_theme"
    
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
