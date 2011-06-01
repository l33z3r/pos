class AddDisplayButtons6 < ActiveRecord::Migration
  def self.up
    
    #Client - Opens a dialog to lookup a client name to charge the order to an account
    DisplayButton.create({:button_text => "Client", :perm_id => 23})

    #Waste - opens a dialog to mark an item as wasted (deducts it from stock)
    DisplayButton.create({:button_text => "Waste", :perm_id => 24})

    #Complimentary - opens a dialog that marks the item as complimentary (no charge)
    DisplayButton.create({:button_text => "Free", :perm_id => 25})

    #Change Price - allows the user to manually change a price of a product
    DisplayButton.create({:button_text => "Change Price", :perm_id => 26})

    #Float - switches to the screen to enter the opening float amount
    DisplayButton.create({:button_text => "Float", :perm_id => 27})

    #No sale - opens the cash drawer
    DisplayButton.create({:button_text => "No Sale", :perm_id => 28})

    #Refund - refund the last item on the till roll
    DisplayButton.create({:button_text => "Refund", :perm_id => 29})

    #Remove - Removes the item from the till roll
    DisplayButton.create({:button_text => "Remove Item", :perm_id => 30})

    #Note - Add a note to the order
    DisplayButton.create({:button_text => "Add Note", :perm_id => 31})

    #Server - select a different server to continue with order
    DisplayButton.create({:button_text => "Change Waiter", :perm_id => 32})

    #Printers - set up printers
    DisplayButton.create({:button_text => "Printers", :perm_id => 33})

    #Transfer Order - transfer the current order to another table
    DisplayButton.create({:button_text => "Transfer Order", :perm_id => 34})

    #Split - When paying this split the order between 2 or more people
    DisplayButton.create({:button_text => "Split Order", :perm_id => 35})

    #Stock Take - enter the current stock levels of products
    DisplayButton.create({:button_text => "Stock Take", :perm_id => 36})

    #Delivery - Enter the quantity of products received
    DisplayButton.create({:button_text => "Delivery", :perm_id => 37})

    #Cash Out - Pay for something from the cash drawer. This opens a note screen to record what the payment is for.
    DisplayButton.create({:button_text => "Cash Out", :perm_id => 38})

    #Receipt Setup - setup where and what to print on receipts
    DisplayButton.create({:button_text => "Receipt Setup", :perm_id => 39})

    #Payment Methods - Setup payments methods, e.g., cash, Visa, American Express, Vouchers
    DisplayButton.create({:button_text => "Payment Methods", :perm_id => 40})

    #Gift Voucher - Create a gift voucher sale
    DisplayButton.create({:button_text => "Gift Voucher", :perm_id => 41})

    #Order Types - Setup order types, e.g., Dine In, Take Away, Delivery
    DisplayButton.create({:button_text => "Order Types", :perm_id => 42})

    #Discounts/Surcharges - Setup different discounts/surcharge for different types of customer, e.g. 
    #staff, members, VIP. Minus value for discount and positive for surcharge, (e.g. after 12am)
    DisplayButton.create({:button_text => "Set Up Discounts", :perm_id => 43})

    #Print Receipt - Prints the receipt for the order so far but doesn't total it. 
    DisplayButton.create({:button_text => "Print Receipt", :perm_id => 44})

  end

  def self.down
    DisplayButton.find_all_by_perm_id(23..44).each do |db|
      db.destroy
    end
  end
end
