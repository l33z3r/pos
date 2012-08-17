class ClueyAccount < ActiveRecord::Base
  has_many :outlets
  
  attr_accessible :name, :email, :password, :password_confirmation
  
  attr_accessor :password
  before_save :encrypt_password
  
  validates :name, :presence => true
  validates_uniqueness_of :name, :case_sensitive => false
  
  validates :email,
    :presence => true,   
    :uniqueness => true,   
    :confirmation => true,
    :format => { :with => /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i }
          
  validates :password, :presence => {:on => :create}, :confirmation => true, :length => {:minimum => 5}    
    
  validate :name_not_reserved
 
  RESERVED_NAMES = [
    "help", "login", "signup", "support", "www", "demo", "cluey"
  ]
  
  before_save :downcase_fields
  
  def downcase_fields
    self.name.downcase
  end
  
  def name_not_reserved
    if RESERVED_NAMES.include? name
      errors.add(:name, "is a reserved name")
    end
  end
  
  def self.authenticate(name, password)
    @user = find_by_name(name)
    if @user && @user.password_hash == BCrypt::Engine.hash_secret(password, @user.password_salt)
      @user
    else
      nil
    end
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
# Table name: cluey_accounts
#
#  id            :integer(4)      not null, primary key
#  name          :string(255)
#  email         :string(255)
#  password_hash :string(255)
#  password_salt :string(255)
#  created_at    :datetime
#  updated_at    :datetime
#

