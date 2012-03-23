desc "Delete orders, order_items, terminal_sync_data, cash_totals, terminal_ids, stored_receipt_htmls"
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