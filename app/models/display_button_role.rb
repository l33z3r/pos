class DisplayButtonRole < ActiveRecord::Base
  belongs_to :role
  belongs_to :display_button

  def self.admin_screen_buttons_for_role role_id
    where("role_id = ?", role_id).where("show_on_admin_screen = ?", true).includes(:display_button)
  end
  
  def self.menu_screen_buttons_for_role role_id
    find(:all, :include => "display_button",
      :conditions => "role_id = #{role_id} and (show_on_sales_screen is true 
          and (show_on_admin_screen is true or role_id = #{Role::SUPER_USER_ROLE_ID}) 
          or (display_buttons.perm_id = #{ButtonMapper::MORE_OPTIONS_BUTTON} and role_id = #{Role::SUPER_USER_ROLE_ID}))")
  end

  def show_on_admin_screen
    return true if role.id == Role::SUPER_USER_ROLE_ID
    super
  end
  
  def self.ensure_super_user_access
    find(:all, :conditions => "role_id = #{Role::SUPER_USER_ROLE_ID}").each do |dbr|
      dbr.show_on_admin_screen = true
      dbr.save
    end
  end
  
  def self.ensure_hidden_buttons_restricted
    DisplayButton.find_all_by_perm_id(ButtonMapper::RESTRICTED_BUTTON_IDS).each do |button|
      button.display_button_roles.each do |dbr|
        dbr.show_on_sales_screen = false
        dbr.show_on_admin_screen = false
        dbr.save
      end
    end
  end
end

# == Schema Information
#
# Table name: display_button_roles
#
#  id                   :integer(4)      not null, primary key
#  display_button_id    :integer(4)
#  role_id              :integer(4)
#  show_on_sales_screen :boolean(1)      default(FALSE)
#  show_on_admin_screen :boolean(1)      default(FALSE)
#  created_at           :datetime
#  updated_at           :datetime
#  passcode_required    :boolean(1)      default(FALSE)
#

