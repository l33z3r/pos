class Outlet < ActiveRecord::Base
  belongs_to :cluey_account
  
  validates :name, :presence => true
  validates_uniqueness_of :name, :case_sensitive => false, :scope => :cluey_account_id
  
  attr_accessor :password
  before_save :encrypt_password
  
  validates :password, :presence => {:on => :create}, :confirmation => true, :length => {:minimum => 5}
  
  has_many :products
  has_many :displays
  has_many :menu_pages
  has_many :menu_items
  has_many :global_settings
  has_many :card_transactions
  has_many :cash_outs
  has_many :cash_out_presets
  has_many :cash_totals
  has_many :categories
  has_many :client_transactions
  has_many :customers
  has_many :customer_points_allocations
  has_many :customer_transactions
  has_many :deliveries
  has_many :discounts
  has_many :display_buttons
  has_many :display_button_groups
  has_many :display_button_roles
  has_many :employees
  has_many :ingredients
  has_many :loyalty_levels
  has_many :modifiers
  has_many :modifier_categories
  has_many :orders
  has_many :order_items
  has_many :order_item_additions
  has_many :order_item_addition_grids
  has_many :payments
  has_many :payment_methods
  has_many :receipt_footers
  has_many :roles
  has_many :rooms
  has_many :room_objects
  has_many :shift_timestamps
  has_many :stock_transactions
  has_many :stored_receipt_htmls
  has_many :table_infos
  has_many :tax_rates
  has_many :terminal_display_links
  has_many :terminal_sync_data, :class_name => "TerminalSyncData", :foreign_key => "outlet_id"
  has_many :work_reports   
  has_many :printers
  
  before_save :downcase_fields
  
  def downcase_fields
    self.name.downcase
  end
  
  def encrypt_password
    if password.present?
      self.password_salt = BCrypt::Engine.generate_salt
      self.password_hash = BCrypt::Engine.hash_secret(password, password_salt)
    end
  end
end


# == Schema Information
#
# Table name: outlets
#
#  id               :integer(4)      not null, primary key
#  cluey_account_id :integer(4)
#  name             :string(255)
#  username         :string(255)
#  password_hash    :string(255)
#  created_at       :datetime
#  updated_at       :datetime
#  has_seed_data    :boolean(1)      default(FALSE)
#  password_salt    :string(255)
#

