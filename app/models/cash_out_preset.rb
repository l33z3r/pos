class CashOutPreset < ActiveRecord::Base
  belongs_to :outlet
  
end



# == Schema Information
#
# Table name: cash_out_presets
#
#  id         :integer(8)      not null, primary key
#  label      :string(255)
#  created_at :datetime
#  updated_at :datetime
#  outlet_id  :integer(8)
#

