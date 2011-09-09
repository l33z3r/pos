class AddFieldsToProducts < ActiveRecord::Migration
  def self.up
    change_table :products do |t|
      t.integer :parent_product_id
      t.string :printers, :default => ""
      t.text :kitchen_note
      t.float :quantity_in_stock
      t.integer :code_num
      t.integer :upc
      
      t.float :price_2
      t.float :price_3
      t.float :price_4
      
      t.float :margin_percent
      t.float :cost_price
      t.float :shipping_cost
      
      t.float :commission_percent
      t.integer :container_type_id
      t.float :quantity_per_container
      
      t.boolean :is_active, :default => true
      t.boolean :is_service, :default => false
      
      t.boolean :show_price_prompt, :default => false
      t.boolean :show_quantity_prompt, :default => false
      t.boolean :show_serial_num_prompt, :default => false
      
      t.boolean :show_add_note_prompt, :default => false
      t.boolean :sell_if_out_of_stock, :default => true
      t.boolean :show_on_web, :default => true
      t.boolean :notify_stock_manager, :default => true
      t.boolean :use_weigh_scales, :default => false
      
      #stock
      t.float :minimum_quantity, :default => 1
      t.float :order_quantity
      
      t.integer :supplier_1_id
      t.float :supplier_1_cost
      t.float :supplier_1_code_num
      
      t.integer :supplier_2_id
      t.float :supplier_2_cost
      t.float :supplier_2_code_num
      
      #button appearance
      t.string :button_text_line_1
      t.string :button_text_line_2
      t.string :button_text_line_3
      
      t.string :button_bg_color
      t.string :button_text_color
      t.string :button_vertical_align
      
      t.boolean :show_button_image, :default => true
      
      t.integer :menu_button_width, :default => 1
      t.integer :menu_button_height, :default => 1
      
      #menu displays
      t.string :menu_page_1_id
      t.string :menu_page_2_id
    end
  end

  def self.down
    change_table :products do |t|
      t.remove :parent_product_id, :printers, :kitchen_note, :quantity_in_stock
      t.remove :code_num, :upc, :price_2, :price_3, :price_4
      
      t.remove :margin_percent, :cost_price, :shipping_cost, :commission_percent
      t.remove :container_type_id, :quantity_per_container
      t.remove :is_active, :is_service
      
      t.remove :show_price_prompt, :show_quantity_prompt, :show_serial_num_prompt
      t.remove :show_add_note_prompt, :sell_if_out_of_stock, :show_on_web
      t.remove :notify_stock_manager, :use_weigh_scales
      
      #stock
      t.remove :minimum_quantity, :order_quantity
      
      t.remove :supplier_1_id, :supplier_1_cost, :supplier_1_code_num
      t.remove :supplier_2_id, :supplier_2_cost, :supplier_2_code_num
      
      #button appearance
      t.remove :button_text_line_1, :button_text_line_2, :button_text_line_3
      t.remove :button_bg_color, :button_text_color, :button_vertical_align
      t.remove :show_button_image
      
      t.remove :menu_button_width, :menu_button_height
      
      t.remove :menu_page_1_id, :menu_page_2_id
    end
  end
end
