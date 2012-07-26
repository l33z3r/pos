Pos::Application.routes.draw do

  #js error logging
  match 'js_error_log' => "home#js_error_log", :via => :post
  
  #temporary routes to forward print service requests as we cannot code for web sockets yet
  match 'forward_print_service_request' => "home#forward_print_service_request", :via => :post
  match 'forward_cash_drawer_request' => "home#forward_cash_drawer_request", :via => :post
  match 'forward_zalion_roomfile_request' => "home#forward_zalion_roomfile_request", :via => :get
  match 'forward_zalion_charge_request' => "home#forward_zalion_charge_request", :via => :post
  match 'forward_credit_card_charge_request' => "home#forward_credit_card_charge_request", :via => :post
  
  #customer payment
  match 'customer_payment' => "home#customer_payment", :via => :post
  
  #orders
  match 'order' => "order#create", :via => :post
  match 'sync_table_order' => "order#sync_table_order", :via => :post
  match 'delete_table_order' => "order#delete_table_order", :via => :post
  match 'transfer_order' => "order#transfer_order", :via => :post
  match 'cash_total' => "order#cash_total", :via => :post
  match 'add_float' => "order#add_float", :via => :post
  match 'float_history' => "order#float_history", :via => :get
  match 'cash_total_history' => "order#cash_total_history", :via => :get
  match 'outstanding_orders' => "order#create_outstanding", :via => :post

  #delivery
  match 'delivery' => "delivery#receive", :via => :post
  
  #routes for screens to login etc
  match 'home' => "home#index"
  get 'blank_receipt_for_print' => "home#blank_receipt_for_print"
  
  #kitchen screen
  match 'kitchen' => "kitchen#index"
  get "kitchen/index"
  get "kitchen/table_0_kitchen_div"
  post "kitchen/order_ready"
  
  #routes for mobile app
  match 'mbl' => "home#mobile_index"
  match 'last_receipt_for_terminal' => "home#last_receipt_for_terminal"
  match 'last_receipt_for_server' => "home#last_receipt_for_server"
  match 'last_receipt_for_table' => "home#last_receipt_for_table"
  
  #this route is to call home with js polling
  match 'call_home' => "home#call_home", :via => :post
  
  #misc routes to home
  get 'ping' => "home#ping"
  match 'request_terminal_reload' => "home#request_terminal_reload", :via => :post
  match 'clear_all_fragment_caches' => "home#clear_all_fragment_caches", :via => :post
  
  #appcache
  match 'cache_manifest' => "home#cache_manifest"
  
  #these routes load stock for a menu page and a stock receipt for a product
  match 'load_stock_for_menu_page' => "home#load_stock_for_menu_page", :via => :get
  match 'load_stock_receipt_for_product' => "home#load_stock_receipt_for_product", :via => :get
  match 'update_stock' => "home#update_stock", :via => :post

  # route for handling letter pagination when selecting from pre stored images
  #match "products/current_product_images(/:letter)" => "products#current_product_images", :as => :products_pagination
  
  #these routes load prices for a menu page and a price receipt for a product
  match 'load_price_for_menu_page' => "home#load_price_for_menu_page", :via => :get
  match 'load_price_receipt_for_product' => "home#load_price_receipt_for_product", :via => :get
  match 'update_price' => "home#update_price", :via => :post
  match 'update_cost_price' => "home#update_cost_price", :via => :post
  
  #init the sales screen buttons based on role permissions
  match 'init_sales_screen_buttons' => "home#init_sales_screen_buttons"

  match 'clockin' => "home#clockin", :via => :post
  match 'clockout' => "home#clockout", :via => :post
  match 'login' => "home#login", :via => :post
  match 'logout' => "home#logout", :via => :post
  match 'break_in' => "home#break_in", :via => :post
  match 'break_out' => "home#break_out", :via => :post
  match 'print_work_report' => "home#print_work_report", :via => :post
  
  #sync info page
  get 'sync_info' => "admin/home#sync_info"
  
  # admin homepage
  match 'admin' => "admin/home#index"

  namespace :admin do
    resources :displays do
      member do
        get 'builder'
        get 'duplicate'
        post 'default'
        post 'public'
        
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
    resources :modifier_categories
    resources :orders, :only => [:index] do
      collection do
        get 'previous_order'      
      end
    end
    
    resources :terminals, :only => [:index] do
      collection do
        post 'link_display'
        get 'check_for_unique'
      end
    end
    
    resources :roles do 
      collection do
        post 'pin_required_for_role'
        post 'login_allowed_for_role'
      end
    end
    
    resources :tax_rates, :only => [:create, :destroy] do
      member do
        post 'default'
      end
      collection do
        post 'update_multiple'
      end
    end
    
    resources :loyalty_levels, :only => [:create, :destroy] do
      member do
        post 'default'
      end
      collection do
        post 'update_multiple'
      end
    end
    
    resources :payment_methods, :only => [:create, :destroy] do
      member do
        post 'default'
      end
      collection do
        post 'update_multiple'
      end
    end
    
    resources :receipt_footers, :only => [:create, :destroy] do
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
        post 'mark_as_deleted'
      end
      collection do
        get 'search'
        get 'product_image_dialog'
        get 'csv_import'
        post 'csv_upload'
        get 'current_product_images'
      end
    end
    
    resources :customers do
      collection do
        get 'search'
      end
    end

    resources :previous_cash_totals, :only => [:index] do
      collection do
        get 'previous_cash_total'
        get 'cash_total_search'
      end
    end
    
    resources :rooms, :only => [:index, :new, :create, :update, :destroy] do
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
        
        post 'button_group_create'
        post 'button_group_update_multiple'
        post 'button_group_delete'
      end
    end
    
    resources :order_item_addition_grids, :only => [:index, :new, :create, :destroy] do
      member do
        get 'builder'
        post 'resize'
        post 'rename'
        post 'update_item'
        post 'delete_item'
        post 'default'
        
        #ajax functions
        post 'save_item'
      end
    end
    
    #system settings interface
    get 'global_settings' => "global_settings#index"
    post 'update_global_settings' => "global_settings#update_multiple"
    get 'cash_total_options' => "global_settings#cash_total_options"
    post 'toggle_cash_total_option' => "global_settings#toggle_cash_total_option"
    post 'update_show_report_in_cash_total' => "global_settings#update_show_report_in_cash_total"
    post 'toggle_print_receipt' => "global_settings#toggle_print_receipt"
    
    #dynamic css that picks up styles from the styles in the settings table
    get 'custom_themes' => "custom_themes#index"
    post 'update_custom_themes' => "custom_themes#update_multiple"
    get 'custom_theme' => "custom_themes#custom_theme"
    
  end

  namespace :reports do
    resources :glances, :only => [:index] do
      collection do
        get 'glances_search'
        get 'sales_search'
        get 'cash_search'
        get 'payments_search'
        get 'customers_search'
        get 'suppliers_search'
        get 'stock_search'
        get 'staff_search'
      end
    end
    resources :sales, :only => [:index] do
      collection do
        get 'glances_search'
        get 'sales_search'
        get 'set_params'
        get 'load_dropdown'
        get 'sales_print'
        get 'export_excel'
      end
    end
    resources :stocks, :only => [:index] do
      collection do
        get 'glances_search'
        get 'stocks_search'
        get 'set_params'
        get 'load_dropdown'
        get 'stocks_print'
        get 'export_excel'
      end
    end
    resources :payments, :only => [:index] do
      collection do
        get 'payments_search'
        get 'set_params'
        get 'load_dropdown'
        get 'payments_print'
        get 'export_excel'
      end
      end
    resources :staff, :only => [:index] do
      collection do
        get 'staff_search'
        get 'set_params'
        get 'load_dropdown'
        get 'staff_print'
        get 'export_excel'
      end
  end
  end

  namespace :api do 
    get 'menu' => "main#menu"
    get 'categories' => "main#categories"
    get 'products' => "main#products"
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
