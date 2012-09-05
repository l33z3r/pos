class DisplayButtonRole < ActiveRecord::Base
  belongs_to :outlet
  
  belongs_to :role, :dependent => :destroy
  belongs_to :display_button

  def self.admin_screen_buttons_for_role current_outlet, role_id
    @dbrs = current_outlet.display_button_roles.where("role_id = ?", role_id).where("show_on_admin_screen = ?", true).where("display_buttons.perm_id != #{ButtonMapper::MORE_OPTIONS_BUTTON}").includes(:display_button)
    
    @dbrs = DisplayButtonRole.remove_unused_pm_shortcut_buttons @dbrs, current_outlet
    DisplayButtonRole.remove_hidden_buttons @dbrs
    
    @dbrs
  end
  
  def self.menu_screen_buttons_for_role current_outlet, role_id
    @dbrs = current_outlet.display_button_roles.find(:all, :include => "display_button",
      :conditions => "role_id = #{role_id} and (show_on_sales_screen is true 
          and (show_on_admin_screen is true or role_id = #{Role::super_user_role_id(current_outlet)}) 
          or (display_buttons.perm_id = #{ButtonMapper::MORE_OPTIONS_BUTTON} and role_id = #{Role::super_user_role_id(current_outlet)}))")
    
    DisplayButtonRole.remove_unused_pm_shortcut_buttons @dbrs, current_outlet
    DisplayButtonRole.remove_hidden_buttons @dbrs
    
    @dbrs
  end

  def self.ensure_super_user_access current_outlet 
    current_outlet.display_button_roles.find(:all, :conditions => "role_id = #{Role::super_user_role_id(current_outlet)}").each do |dbr|
      dbr.show_on_admin_screen = true
      dbr.save
    end
  end
  
  def self.remove_unused_pm_shortcut_buttons dbrs, current_outlet
    #take out the payment shortcut buttons if they have an id of 0
    @pm_shortcut_buttons = ButtonMapper.pm_shortcut_buttons
    
    dbrs.keep_if do |dbr|
      @keep = true
      
      if @pm_shortcut_buttons.include?(dbr.display_button.perm_id.to_i)
        
        if dbr.display_button.perm_id.to_i == ButtonMapper::PM_SHORTCUT_1_BUTTON
          @shortcut_num = 1
        elsif dbr.display_button.perm_id.to_i == ButtonMapper::PM_SHORTCUT_2_BUTTON
          @shortcut_num = 2
        elsif dbr.display_button.perm_id.to_i == ButtonMapper::PM_SHORTCUT_3_BUTTON
          @shortcut_num = 3
        end
      
        @pm_shortcut_id = GlobalSetting.parsed_setting_for GlobalSetting::PM_SHORTCUT_ID, current_outlet, {:shortcut_num => @shortcut_num}
        
        if @pm_shortcut_id == -1
          @keep = false
        end
      end
      
      @keep  
    end
  end
  
  def self.remove_hidden_buttons dbrs
    #take out the payment shortcut buttons if they have an id of 0
    @hidden_buttons = ButtonMapper::HIDDEN_BUTTON_IDS
    
    dbrs.keep_if do |dbr|
      !@hidden_buttons.include?(dbr.display_button.perm_id.to_i)
    end
  end
  
  def self.ensure_hidden_buttons_restricted current_outlet
    DisplayButton.find_all_by_outlet_id_and_perm_id(current_outlet.id, ButtonMapper::RESTRICTED_BUTTON_IDS).each do |button|
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
#  outlet_id            :integer(4)
#

