# == Schema Information
# Schema version: 20110512185508
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
#  passcode_required    :boolean(1)
#

class DisplayButtonRole < ActiveRecord::Base
  belongs_to :role
  belongs_to :display_button

  def self.admin_screen_buttons_for_role role_id
    #bypass permissions for super user role
    if role_id == Role::SUPER_USER_ROLE_ID
      return DisplayButton.find(:all, :conditions => "perm_id != #{ButtonMapper::MORE_OPTIONS_BUTTON}")
    end

    find(:all, :include => "display_button", :conditions => "role_id = #{role_id} and show_on_admin_screen = 1 
      and display_buttons.perm_id != #{ButtonMapper::MORE_OPTIONS_BUTTON}").collect(&:display_button)
  end

  def show_on_admin_screen
    return true if role.id == Role::SUPER_USER_ROLE_ID
    super
  end
end
