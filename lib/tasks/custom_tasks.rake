desc "Delete orders, order_items, terminal_sync_data, cash_totals, terminal_ids, stored_receipt_htmls, client_transactions, card_transactions, customer_transactions, payments"
task :delete_historical_data => :environment do
  @outlet_id = ENV['outlet_id']
  
  if !@outlet_id
    abort "You must provide an 'outlet_id' parameter"
  end
  
  @outlet = Outlet.find_by_id(@outlet_id)
  
  if !@outlet
    abort "Outlet not found for ID: #{@outlet_id}"
  end
  
  puts "Deleting historical data for outlet #{@outlet.name}!"
  
  @orders = @outlet.orders.all
  puts "Deleting #{@orders.length} orders"
  @orders.each(&:destroy)
  
  @order_items = @outlet.order_items.all
  puts "Deleting #{@order_items.length} order_items"
  @order_items.each(&:destroy)
  
  @terminal_sync_datas = @outlet.terminal_sync_data.all
  puts "Deleting #{@terminal_sync_datas.length} terminal_sync_datas"
  @terminal_sync_datas.each(&:destroy)
  
  @cash_totals = @outlet.cash_totals.all
  puts "Deleting #{@cash_totals.length} cash_totals"
  @cash_totals.each(&:destroy)
  
  @recpt_htmls = @outlet.stored_receipt_htmls.all
  puts "Deleting #{@recpt_htmls.length} receipt_htmls"
  @recpt_htmls.each(&:destroy) 
  
  @client_transactions = @outlet.client_transactions.all
  puts "Deleting #{@client_transactions.length} client_transactions"
  @client_transactions.each(&:destroy) 
  
  @card_transactions = @outlet.card_transactions.all
  puts "Deleting #{@card_transactions.length} card_transactions"
  @card_transactions.each(&:destroy) 
  
  @customer_transactions = @outlet.customer_transactions.all
  puts "Deleting #{@customer_transactions.length} customer_transactions"
  @customer_transactions.each(&:destroy) 
  
  @customer_points_allocations = @outlet.customer_points_allocations.all
  puts "Deleting #{@customer_points_allocations.length} customer_points_allocations"
  @customer_points_allocations.each(&:destroy) 
  
  @payments = @outlet.payments.all
  puts "Deleting #{@payments.length} payments"
  @payments.each(&:destroy) 
    
  @stock_transactions = @outlet.stock_transactions.all
  puts "Deleting #{@stock_transactions.length} stock_transactions"
  @stock_transactions.each(&:destroy)
  
  @deliveries = @outlet.deliveries.all
  puts "Deleting #{@deliveries.length} deliveries"
  @deliveries.each(&:destroy)
  
  puts "Clearing duplicate global_settings keys"
  GlobalSetting.clear_dup_keys_gs @outlet
  
  puts "Issuing a reset of all terminals"
  TerminalSyncData.request_hard_reload_app "Cluey Support", @outlet
  
  puts "Done!"
end

desc "Deletes all terminal_sync_data, and issues a hard reset of each terminal"
task :delete_sync_data => :environment do
  @outlet_id = ENV['outlet_id']
  
  if !@outlet_id
    abort "You must provide an 'outlet_id' parameter"
  end
  
  @outlet = Outlet.find_by_id(@outlet_id)
  
  if !@outlet
    abort "Outlet not found for ID: #{@outlet_id}"
  end
  
  puts "Deleting terminal sync data for outlet #{@outlet.name}"
  
  @terminal_sync_datas = @outlet.terminal_sync_data.all
  puts "Deleting #{@terminal_sync_datas.length} terminal_sync_datas"
  @terminal_sync_datas.each(&:destroy)
  
  puts "Clearing duplicate global_settings keys"
  GlobalSetting.clear_dup_keys_gs @outlet
  
  puts "Issuing a reset of all terminals"
  TerminalSyncData.request_hard_reload_app "Cluey Support", @outlet
  
  puts "Done!"
end

desc "Deletes all stored receipt data"
task :delete_recpt_data => :environment do
  @outlet_id = ENV['outlet_id']
  
  if !@outlet_id
    abort "You must provide an 'outlet_id' parameter"
  end
  
  @outlet = Outlet.find_by_id(@outlet_id)
  
  if !@outlet
    abort "Outlet not found for ID: #{@outlet_id}"
  end
  
  puts "Deleting receipt data for outlet #{@outlet.name}"
  
  @recpt_htmls = @outlet.stored_receipt_htmls.all
  puts "Deleting #{@recpt_htmls.length} receipt_htmls"
  @recpt_htmls.each(&:destroy) 
  
  puts "Done!"
end

desc "Clear duplicate keys in global settings"
task :clear_dup_keys_gs => :environment do
  @outlet_id = ENV['outlet_id']
  
  if !@outlet_id
    abort "You must provide an 'outlet_id' parameter"
  end
  
  @outlet = Outlet.find_by_id(@outlet_id)
  
  if !@outlet
    abort "Outlet not found for ID: #{@outlet_id}"
  end
  
  puts "Deleting duplicate gs keys for outlet #{@outlet.name}"
  
  GlobalSetting.clear_dup_keys_gs @outlet
end

desc "Issues a soft reset of each terminal"
task :issue_soft_reset => :environment do
  @outlet_id = ENV['outlet_id']
  
  if !@outlet_id
    abort "You must provide an 'outlet_id' parameter"
  end
  
  @outlet = Outlet.find_by_id(@outlet_id)
  
  if !@outlet
    abort "Outlet not found for ID: #{@outlet_id}"
  end
  
  puts "Issuing a soft reset of all terminals for outlet #{@outlet.name}"
  TerminalSyncData.request_reload_app "Cluey Support", @outlet
  
  puts "Done!"
end

desc "Issues a hard reset of each terminal"
task :issue_hard_reset => :environment do
  @outlet_id = ENV['outlet_id']
  
  if !@outlet_id
    abort "You must provide an 'outlet_id' parameter"
  end
  
  @outlet = Outlet.find_by_id(@outlet_id)
  
  if !@outlet
    abort "Outlet not found for ID: #{@outlet_id}"
  end
  
  puts "Issuing a hard reset of all terminals for outlet #{@outlet.name}"
  TerminalSyncData.request_hard_reload_app "Cluey Support", @outlet
  
  puts "Done!"
end

desc "Builds Stock Transactions for all existing sales"
task :build_stock_transactions => :environment do
  @outlet_id = ENV['outlet_id']
  
  if !@outlet_id
    abort "You must provide an 'outlet_id' parameter"
  end
  
  @outlet = Outlet.find_by_id(@outlet_id)
  
  if !@outlet
    abort "Outlet not found for ID: #{@outlet_id}"
  end
  
  ActiveRecord::Base.connection.execute("update products set quantity_in_stock = 0 where outlet_id = #{@outlet_id}")
  ActiveRecord::Base.connection.execute("delete from stock_transactions where outlet_id = #{@outlet_id}")
  ActiveRecord::Base.connection.execute("delete from deliveries where outlet_id = #{@outlet_id}")
    
  @all_count = @outlet.order_items.all.count
  puts "Building Stock Transactions For #{@all_count} Order Items for outlet #{@outlet.name}"
    
  @deduct_stock_during_training_mode = GlobalSetting.parsed_setting_for GlobalSetting::DEDUCT_STOCK_DURING_TRAINING_MODE, @outlet
    
  @count = 0
    
  @outlet.order_items.find_each do |oi|
    @count += 1
    puts "Processing OrderItem #{@count} of #{@all_count}"
    @order_item = oi
      
    next if !@order_item.stock_transactions.empty?
    next if @order_item.is_void
    next if @order_item.order.is_void
      
    @is_training_mode_sale = @order_item.order.training_mode_sale
      
    @item_stock_usage = @order_item.quantity.to_f
      
    if @order_item.is_double
      @item_stock_usage *= 2
    elsif @order_item.is_half
      @item_stock_usage /= 2
    end
        
    if @order_item.oia_data
      @order_item.oia_data.each do |index, oia|
        if !@is_training_mode_sale or @deduct_stock_during_training_mode
          if oia[:product_id] != "-1" and !oia[:product_id].blank?
            #decrement stock for this oia product
            @oia_stock_usage = @order_item.quantity.to_f
      
            if @order_item.is_double
              @oia_stock_usage *= 2
            elsif @order_item.is_half
              @oia_stock_usage /= 2
            end
      
            @oia_product = @outlet.products.find_by_id(oia[:product_id])
      
            @old_stock_amount = @oia_product.quantity_in_stock
            @actual_stock_usage = @oia_product.decrement_stock @oia_stock_usage
                
            #build a stock_transaction
            @st = @order_item.stock_transactions.build(:transaction_type => StockTransaction::SALE, 
              :outlet_id => @outlet_id, :employee_id => @order_item.employee_id, :product_id => @oia_product.id,
              :old_amount => @old_stock_amount, :change_amount => (-1 * @actual_stock_usage))
              
            @st.created_at = @order_item.created_at
            @st.updated_at = @order_item.created_at
            @st.save
          end
        end
      end
    end
        
    #decrement the stock for this item
    if @order_item.product.is_stock_item
      @old_stock_amount = @order_item.product.quantity_in_stock
      @actual_stock_usage = @order_item.product.decrement_stock @item_stock_usage
              
      #build a stock_transaction
      @st = @order_item.stock_transactions.build(:transaction_type => StockTransaction::SALE, 
        :outlet_id => @outlet_id, :employee_id => @order_item.employee_id, :product_id => @order_item.product.id,
        :old_amount => @old_stock_amount, :change_amount => (-1 * @actual_stock_usage))
              
      @st.created_at = @order_item.created_at
      @st.updated_at = @order_item.created_at
      @st.save
    end
            
    #decrement the ingredient stock
    @order_item.product.ingredients.each do |ingredient|
      if ingredient.product.is_stock_item
        @old_stock_amount = ingredient.product.quantity_in_stock
              
        @ingredient_usage = ingredient.stock_usage
        @actual_stock_usage = ingredient.product.decrement_stock @item_stock_usage * @ingredient_usage
                
        #build a stock_transaction
        @st = @order_item.stock_transactions.build(:transaction_type => StockTransaction::SALE, 
          :outlet_id => @outlet_id, :employee_id => @order_item.employee_id, :product_id => ingredient.product.id,
          :old_amount => @old_stock_amount, :change_amount => (-1 * @actual_stock_usage))
           
        @st.created_at = @order_item.created_at
        @st.updated_at = @order_item.created_at
        @st.save
      end
    end
  end
    
  puts "Finished Building Stock Transactions"
end