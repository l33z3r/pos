# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20111208140023) do

  create_table "cash_totals", :force => true do |t|
    t.string   "total_type"
    t.float    "total"
    t.integer  "start_calc_order_id"
    t.integer  "end_calc_order_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "employee_id"
    t.string   "terminal_id"
    t.integer  "report_num"
    t.text     "report_data"
  end

  create_table "categories", :force => true do |t|
    t.string   "name"
    t.integer  "parent_category_id"
    t.string   "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "tax_rate_id"
    t.string   "printers",           :default => ""
  end

  create_table "discounts", :force => true do |t|
    t.string   "name"
    t.float    "percent"
    t.boolean  "is_default"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "display_button_groups", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "display_button_roles", :force => true do |t|
    t.integer  "display_button_id"
    t.integer  "role_id"
    t.boolean  "show_on_sales_screen", :default => false
    t.boolean  "show_on_admin_screen", :default => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "passcode_required",    :default => false
  end

  create_table "display_buttons", :force => true do |t|
    t.string   "button_text"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "perm_id"
    t.integer  "display_button_group_id"
  end

  create_table "displays", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "is_default",                  :default => false
    t.integer  "order_item_addition_grid_id"
  end

  create_table "employees", :force => true do |t|
    t.string   "staff_id"
    t.string   "name"
    t.string   "nickname"
    t.string   "passcode"
    t.string   "address"
    t.string   "telephone"
    t.float    "hourly_rate"
    t.float    "overtime_rate"
    t.datetime "last_login",                  :default => '2011-05-01 13:22:42'
    t.datetime "last_active",                 :default => '2011-05-01 13:22:42'
    t.datetime "last_logout",                 :default => '2011-05-01 13:22:42'
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "role_id",                     :default => 1
    t.string   "employee_image_file_name"
    t.string   "employee_image_content_type"
    t.integer  "employee_image_file_size"
    t.datetime "employee_image_updated_at"
    t.string   "clockin_code"
  end

  create_table "global_settings", :force => true do |t|
    t.string   "key"
    t.string   "value"
    t.string   "label_text"
    t.string   "logo_file_name"
    t.string   "logo_content_type"
    t.integer  "logo_file_size"
    t.datetime "logo_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "menu_items", :force => true do |t|
    t.integer  "menu_page_id"
    t.integer  "product_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "order_num",    :default => 0
  end

  create_table "menu_pages", :force => true do |t|
    t.string   "name"
    t.integer  "display_id"
    t.integer  "page_num"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "modifier_categories", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "modifiers", :force => true do |t|
    t.integer  "modifier_category_id"
    t.string   "name"
    t.float    "price"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "order_item_addition_grids", :force => true do |t|
    t.string   "name"
    t.integer  "grid_x_size"
    t.integer  "grid_y_size"
    t.boolean  "is_default",  :default => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "order_item_additions", :force => true do |t|
    t.integer  "order_item_addition_grid_id"
    t.string   "description"
    t.float    "add_charge"
    t.float    "minus_charge"
    t.boolean  "available",                   :default => true
    t.string   "background_color"
    t.string   "text_color"
    t.integer  "text_size"
    t.integer  "pos_x"
    t.integer  "pos_y"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "background_color_2"
    t.boolean  "hide_on_receipt",             :default => false
    t.boolean  "is_addable",                  :default => true
  end

  create_table "order_items", :force => true do |t|
    t.integer  "order_id"
    t.integer  "employee_id"
    t.integer  "product_id"
    t.float    "quantity"
    t.float    "total_price"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "modifier_name"
    t.float    "modifier_price"
    t.float    "discount_percent"
    t.float    "pre_discount_price"
    t.float    "tax_rate"
    t.string   "terminal_id"
    t.string   "time_added"
    t.boolean  "show_server_added_text", :default => false
    t.string   "product_name"
    t.boolean  "is_double",              :default => false
  end

  create_table "orders", :force => true do |t|
    t.integer  "employee_id"
    t.float    "total"
    t.string   "payment_type"
    t.float    "amount_tendered"
    t.boolean  "is_table_order",                     :default => false
    t.integer  "num_persons"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "table_info_id"
    t.float    "discount_percent"
    t.float    "pre_discount_price"
    t.string   "terminal_id"
    t.string   "table_info_label"
    t.boolean  "tax_chargable",                      :default => false
    t.float    "global_sales_tax_rate"
    t.float    "service_charge"
    t.float    "cashback"
    t.integer  "void_order_id"
    t.boolean  "is_void",                            :default => false
    t.integer  "order_num",             :limit => 8
  end

  create_table "payment_methods", :force => true do |t|
    t.string   "name"
    t.boolean  "is_default"
    t.string   "logo_file_name"
    t.string   "logo_content_type"
    t.integer  "logo_file_size"
    t.datetime "logo_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "products", :force => true do |t|
    t.string   "brand"
    t.string   "name"
    t.integer  "category_id"
    t.string   "description"
    t.float    "size"
    t.string   "unit"
    t.integer  "items_per_unit"
    t.float    "sales_tax_rate"
    t.float    "price"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "product_image_file_name"
    t.string   "product_image_content_type"
    t.integer  "product_image_file_size"
    t.datetime "product_image_updated_at"
    t.integer  "modifier_category_id"
    t.integer  "tax_rate_id"
    t.integer  "parent_product_id"
    t.string   "printers",                   :default => ""
    t.text     "kitchen_note"
    t.float    "quantity_in_stock",          :default => 0.0
    t.integer  "code_num"
    t.integer  "upc"
    t.float    "price_2"
    t.float    "price_3"
    t.float    "price_4"
    t.float    "margin_percent"
    t.float    "cost_price"
    t.float    "shipping_cost"
    t.float    "commission_percent"
    t.integer  "container_type_id"
    t.float    "quantity_per_container",     :default => 1.0
    t.boolean  "is_active",                  :default => true
    t.boolean  "is_service",                 :default => false
    t.boolean  "show_price_prompt",          :default => false
    t.boolean  "show_quantity_prompt",       :default => false
    t.boolean  "show_serial_num_prompt",     :default => false
    t.boolean  "show_add_note_prompt",       :default => false
    t.boolean  "sell_if_out_of_stock",       :default => true
    t.boolean  "show_on_web",                :default => true
    t.boolean  "notify_stock_manager",       :default => true
    t.boolean  "use_weigh_scales",           :default => false
    t.float    "minimum_quantity",           :default => 1.0
    t.float    "order_quantity"
    t.integer  "supplier_1_id"
    t.float    "supplier_1_cost"
    t.float    "supplier_1_code_num"
    t.integer  "supplier_2_id"
    t.float    "supplier_2_cost"
    t.float    "supplier_2_code_num"
    t.string   "button_text_line_1"
    t.string   "button_text_line_2"
    t.string   "button_text_line_3"
    t.string   "button_bg_color"
    t.string   "button_text_color"
    t.string   "button_vertical_align"
    t.boolean  "show_button_image",          :default => true
    t.integer  "menu_button_width",          :default => 1
    t.integer  "menu_button_height",         :default => 1
    t.string   "menu_page_1_id"
    t.string   "menu_page_2_id"
    t.string   "button_bg_color_2"
    t.boolean  "is_special",                 :default => false
    t.boolean  "is_deleted",                 :default => false
    t.boolean  "show_price_on_receipt",      :default => true
    t.float    "double_price",               :default => 0.0
    t.string   "display_image"
  end

  create_table "roles", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "pin_required", :default => false
  end

  create_table "room_objects", :force => true do |t|
    t.string   "object_type"
    t.string   "permid"
    t.string   "label"
    t.integer  "room_id"
    t.integer  "grid_x"
    t.integer  "grid_y"
    t.integer  "grid_x_size"
    t.integer  "grid_y_size"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "rooms", :force => true do |t|
    t.string   "name"
    t.integer  "grid_x_size"
    t.integer  "grid_y_size"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "grid_resolution",                :default => 5
    t.float    "default_service_charge_percent"
  end

  create_table "sessions", :force => true do |t|
    t.string   "session_id", :null => false
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], :name => "index_sessions_on_session_id"
  add_index "sessions", ["updated_at"], :name => "index_sessions_on_updated_at"

  create_table "stock_transactions", :force => true do |t|
    t.integer  "product_id"
    t.integer  "employee_id"
    t.float    "old_amount"
    t.float    "change_amount"
    t.integer  "transaction_type"
    t.string   "note"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "stored_receipt_htmls", :force => true do |t|
    t.string   "receipt_type"
    t.string   "receipt_key"
    t.text     "stored_html"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "table_infos", :force => true do |t|
    t.string   "perm_id"
    t.integer  "room_object_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tax_rates", :force => true do |t|
    t.string   "name"
    t.float    "rate"
    t.boolean  "is_default"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "terminal_display_links", :force => true do |t|
    t.string   "terminal_id"
    t.integer  "display_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "terminal_sync_data", :force => true do |t|
    t.integer  "sync_type"
    t.string   "time"
    t.text     "data",       :limit => 2147483647
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
