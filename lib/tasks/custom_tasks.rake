desc "Delete orders, order_items, terminal_sync_data, cash_totals, terminal_ids, stored_receipt_htmls, client_transactions, card_transactions, customer_transactions, payments"
task :delete_historical_data => :environment do
  puts "Deleting historical data!"
  
  @orders = Order.all
  puts "Deleting #{@orders.length} orders"
  @orders.each(&:destroy)
  
  @order_items = OrderItem.all
  puts "Deleting #{@order_items.length} order_items"
  @order_items.each(&:destroy)
  
  @terminal_sync_datas = TerminalSyncData.all
  puts "Deleting #{@terminal_sync_datas.length} terminal_sync_datas"
  @terminal_sync_datas.each(&:destroy)
  
  @cash_totals = CashTotal.all
  puts "Deleting #{@cash_totals.length} cash_totals"
  @cash_totals.each(&:destroy)
  
  @recpt_htmls = StoredReceiptHtml.all
  puts "Deleting #{@recpt_htmls.length} receipt_htmls"
  @recpt_htmls.each(&:destroy) 
  
  @client_transactions = ClientTransaction.all
  puts "Deleting #{@client_transactions.length} client_transactions"
  @client_transactions.each(&:destroy) 
  
  @card_transactions = CardTransaction.all
  puts "Deleting #{@card_transactions.length} card_transactions"
  @card_transactions.each(&:destroy) 
  
  @customer_transactions = CustomerTransaction.all
  puts "Deleting #{@customer_transactions.length} customer_transactions"
  @customer_transactions.each(&:destroy) 
  
  @payments = Payment.all
  puts "Deleting #{@payments.length} payments"
  @payments.each(&:destroy) 
    
  @stock_transactions = StockTransaction.all
  puts "Deleting #{@stock_transactions.length} stock_transactions"
  @stock_transactions.each(&:destroy)
  
  puts "Issuing a reset of all terminals"
  TerminalSyncData.request_hard_reload_app "Master Terminal"
  
  puts "Done!"
end

desc "Deletes all terminal_sync_data, and issues a hard reset of each terminal"
task :delete_sync_data => :environment do
  @terminal_sync_datas = TerminalSyncData.all
  puts "Deleting #{@terminal_sync_datas.length} terminal_sync_datas"
  @terminal_sync_datas.each(&:destroy)
  
  puts "Issuing a reset of all terminals"
  TerminalSyncData.request_hard_reload_app "Master Terminal"
  
  puts "Done!"
end

desc "Deletes all stored receipt data"
task :delete_recpt_data => :environment do
  @recpt_htmls = StoredReceiptHtml.all
  puts "Deleting #{@recpt_htmls.length} receipt_htmls"
  @recpt_htmls.each(&:destroy) 
  
  puts "Done!"
end

desc "Clear duplicate keys in global settings"
task :clear_dup_keys_gs => :environment do
  GlobalSetting.all.group_by(&:key).each do |gs_key, gs_set|
    if gs_set.size > 1
      #we have duplicates
      @del_count = gs_set.size - 1
      
      puts "Found #{gs_set.size} duplicate keys for Key: #{gs_key} Label: '#{gs_set.first.label_text}'. Removing #{@del_count} duplicates!"
      
      gs_set.each do |gs|
        break if @del_count == 0
        gs.destroy
        @del_count -= 1
      end
    end
  end
end

desc "Issues a hard reset of each terminal"
task :issue_reset => :environment do
  puts "Issuing a reset of all terminals"
  TerminalSyncData.request_hard_reload_app "Master Terminal"
  
  puts "Done!"
end