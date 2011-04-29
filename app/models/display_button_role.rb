# == Schema Information
# Schema version: 20110420190211
#
# Table name: display_button_roles
#
#  id                   :integer(4)      not null, primary key
#  display_button_id    :integer(4)
#  role_id              :integer(4)
#  show_on_sales_screen :boolean(1)
#  show_on_admin_screen :boolean(1)
#  created_at           :datetime
#  updated_at           :datetime
#

class DisplayButtonRole < ActiveRecord::Base
  belongs_to :role
  belongs_to :display_button

  def self.admin_screen_buttons_for_role role_id
    @super_user_role_id = Role::SUPER_USER_ROLE_ID

    #bypass permissions for super user role
    find(:all, :conditions => "role_id = #{role_id} and (show_on_admin_screen = 1 or role_id = #{@super_user_role_id})")
  end

  def show_on_admin_screen
    return true if role.id == Role::SUPER_USER_ROLE_ID
    super
  end
end
