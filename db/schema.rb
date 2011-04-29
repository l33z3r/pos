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

ActiveRecord::Schema.define(:version => 20110429080107) do

  create_table "categories", :force => true do |t|
    t.string   "name"
    t.integer  "parent_category_id"
    t.string   "description"
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
  end

  create_table "display_buttons", :force => true do |t|
    t.string   "button_text"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "perm_id"
  end

  create_table "displays", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "is_default", :default => false
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
    t.datetime "last_login",    :default => '2011-03-31 09:40:41'
    t.datetime "last_active",   :default => '2011-03-31 09:40:41'
    t.datetime "last_logout",   :default => '2011-03-31 09:40:41'
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "role_id",       :default => 1
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

  create_table "order_items", :force => true do |t|
    t.integer  "order_id"
    t.integer  "employee_id"
    t.integer  "product_id"
    t.integer  "quantity"
    t.integer  "total_price"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "modifier_name"
    t.integer  "modifier_price"
  end

  create_table "orders", :force => true do |t|
    t.integer  "employee_id"
    t.integer  "total"
    t.string   "payment_type"
    t.integer  "amount_tendered"
    t.boolean  "is_table_order",  :default => false
    t.integer  "num_persons"
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
  end

  create_table "roles", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "sessions", :force => true do |t|
    t.string   "session_id", :null => false
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], :name => "index_sessions_on_session_id"
  add_index "sessions", ["updated_at"], :name => "index_sessions_on_updated_at"

end
