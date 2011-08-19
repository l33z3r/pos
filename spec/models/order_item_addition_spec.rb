require 'spec_helper'

describe OrderItemAddition do
  pending "add some examples to (or delete) #{__FILE__}"
end



# == Schema Information
#
# Table name: order_item_additions
#
#  id                          :integer(4)      not null, primary key
#  order_item_addition_grid_id :integer(4)
#  description                 :string(255)
#  add_charge                  :float
#  minus_charge                :float
#  available                   :boolean(1)      default(TRUE)
#  background_color            :string(255)
#  text_color                  :string(255)
#  text_size                   :integer(4)
#  pos_x                       :integer(4)
#  pos_y                       :integer(4)
#  created_at                  :datetime
#  updated_at                  :datetime
#

