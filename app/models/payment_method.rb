class PaymentMethod < ActiveRecord::Base
  validates :name, :presence => true
  validates :name, :uniqueness => true
  
  PAYMENT_INTEGRATION_ZALION = 1
  
  PAYMENT_INTEGRATION_TYPES_MAP = {
    PAYMENT_INTEGRATION_ZALION => "Zalion"
  }
  
  PAYMENT_INTEGRATION_TYPES = [
    PAYMENT_INTEGRATION_ZALION
  ]
  
  has_attached_file :logo, PAPERCLIP_STORAGE_OPTIONS.merge(:styles => { :medium => "300x300>", :thumb => "115x115>" })
  
  def self.payment_integration_options_for_select
    @options = []
    
    PAYMENT_INTEGRATION_TYPES_MAP.each do |key, val|
      @options << [val, key]
    end
    
    #the none option
    @options << ["None", 0]
    
    @options
  end
  
  def self.load_default
    payment_method = find_by_is_default(true)
    
    if !payment_method
      payment_method = find(:first)
      
      payment_method.is_default = true
      payment_method.save
    end

    payment_method
  end
  
  def has_logo?
    return (!logo_file_name.nil? and !logo_file_name.blank?)
  end
  
end

# == Schema Information
#
# Table name: payment_methods
#
#  id                     :integer(4)      not null, primary key
#  name                   :string(255)
#  is_default             :boolean(1)
#  logo_file_name         :string(255)
#  logo_content_type      :string(255)
#  logo_file_size         :integer(4)
#  logo_updated_at        :datetime
#  created_at             :datetime
#  updated_at             :datetime
#  payment_integration_id :integer(4)      default(0)
#

