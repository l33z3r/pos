class Role < ActiveRecord::Base
  has_many :employees
  has_many :display_button_roles

  validates :name, :presence => true
  
  before_save :prevent_rename_super_user_role

  #TODO: load from config file
  SUPER_USER_ROLE_ID = find_by_name("Administrator").try(:id)
  
  def prevent_rename_super_user_role
    @editing_super_user = (SUPER_USER_ROLE_ID == id)
    
    if @editing_super_user
      #make sure we are not changing the name "Administrator"
      write_attribute("name", "Administrator")
    end
  end
  
end

# == Schema Information
#
# Table name: roles
#
#  id           :integer(4)      not null, primary key
#  name         :string(255)
#  created_at   :datetime
#  updated_at   :datetime
#  pin_required :boolean(1)      default(FALSE)
#

