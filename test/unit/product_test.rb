require 'test_helper'

class ProductTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end

















# == Schema Information
#
# Table name: products
#
#  id                                       :integer(4)      not null, primary key
#  brand                                    :string(255)
#  name                                     :string(255)
#  category_id                              :integer(4)
#  description                              :string(255)
#  size                                     :float
#  unit                                     :string(255)
#  items_per_unit                           :integer(4)
#  sales_tax_rate                           :float
#  price                                    :float
#  created_at                               :datetime
#  updated_at                               :datetime
#  product_image_file_name                  :string(255)
#  product_image_content_type               :string(255)
#  product_image_file_size                  :integer(4)
#  product_image_updated_at                 :datetime
#  modifier_category_id                     :integer(4)
#  tax_rate_id                              :integer(4)
#  parent_product_id                        :integer(4)
#  printers                                 :string(255)     default("")
#  quantity_in_stock                        :float           default(0.0)
#  code_num                                 :integer(4)
#  upc                                      :string(255)
#  price_2                                  :float
#  price_3                                  :float
#  price_4                                  :float
#  margin_percent                           :float
#  cost_price                               :float
#  shipping_cost                            :float
#  commission_percent                       :float
#  container_type_id                        :integer(4)
#  quantity_per_container                   :float           default(1.0)
#  is_active                                :boolean(1)      default(TRUE)
#  is_service                               :boolean(1)      default(FALSE)
#  show_price_prompt                        :boolean(1)      default(FALSE)
#  show_quantity_prompt                     :boolean(1)      default(FALSE)
#  show_serial_num_prompt                   :boolean(1)      default(FALSE)
#  show_add_note_prompt                     :boolean(1)      default(FALSE)
#  sell_if_out_of_stock                     :boolean(1)      default(TRUE)
#  show_on_web                              :boolean(1)      default(TRUE)
#  notify_stock_manager                     :boolean(1)      default(TRUE)
#  use_weigh_scales                         :boolean(1)      default(FALSE)
#  minimum_quantity                         :float           default(1.0)
#  order_quantity                           :float
#  supplier_1_id                            :integer(4)
#  supplier_1_cost                          :float
#  supplier_1_code_num                      :float
#  supplier_2_id                            :integer(4)
#  supplier_2_cost                          :float
#  supplier_2_code_num                      :float
#  button_text_line_1                       :string(255)
#  button_text_line_2                       :string(255)
#  button_text_line_3                       :string(255)
#  button_bg_color                          :string(255)
#  button_text_color                        :string(255)
#  button_vertical_align                    :string(255)
#  show_button_image                        :boolean(1)      default(TRUE)
#  menu_button_width                        :integer(4)      default(1)
#  menu_button_height                       :integer(4)      default(1)
#  menu_page_1_id                           :string(255)
#  menu_page_2_id                           :string(255)
#  button_bg_color_2                        :string(255)
#  is_special                               :boolean(1)      default(FALSE)
#  is_deleted                               :boolean(1)      default(FALSE)
#  show_price_on_receipt                    :boolean(1)      default(TRUE)
#  double_price                             :float           default(0.0)
#  display_image                            :string(255)
#  hide_on_printed_receipt                  :boolean(1)      default(FALSE)
#  order_item_addition_grid_id              :integer(4)
#  order_item_addition_grid_id_is_mandatory :boolean(1)      default(FALSE)
#  course_num                               :integer(4)      default(0)
#  is_stock_item                            :boolean(1)      default(TRUE)
#

