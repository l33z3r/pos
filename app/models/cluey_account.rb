require 'digest/sha1'

class ClueyAccount < ActiveRecord::Base
  has_many :outlets
  
  attr_accessible :first_name, :last_name, :country_id, :name, :email, :password, :password_confirmation, :email_confirmation, :time_zone
  
  attr_accessor :password
  before_save :encrypt_password
  
  after_create :make_activation_code
  after_create :generate_login_crossdomain_auth_token
  
  validates :name, :presence => true
  validates_uniqueness_of :name, :case_sensitive => false
  validates_format_of :name, :with => /^[-a-z]+$/i, :message => "must only contain characters from the alphabet"
  
  validates :first_name, :presence => true
  validates :last_name, :presence => true
  
  validates :email, :presence => true   
  validates_uniqueness_of :email, :case_sensitive => false
  validates_format_of :email, :with => /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i, :message => "Not a valid email address"
  validates :email, :confirmation => true
    
  attr_accessor :updating_password
  validates :password, :presence => {:on => :create}, :confirmation => true, :if => :should_validate_password? 
  validates :password, :length => {:minimum => 5}, :if => :should_validate_password?  
    
  validate :name_not_reserved
 
  has_many :customers, :through => :outlets
  
  belongs_to :country
  
  RESERVED_NAMES = [
    "help", "login", "signup", "support", "www", "demo"
  ]
  
  before_save :downcase_fields
  
  def downcase_fields
    self.name.downcase!
  end
  
  def name_not_reserved
    if RESERVED_NAMES.include? name
      errors.add(:name, "is a reserved name")
    end
  end
  
  def self.authenticate(email, password)
    @user = find_by_email(email)
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
  
  def make_activation_code
    #make activation code after model created
    self.activation_code = Digest::SHA1.hexdigest( Time.now.to_s.split(//).sort_by {rand}.join )
    save
  end
  
  # Activates the user in the database.
  def activate
    self.activated_at = Time.zone.now.utc
    self.activation_code = nil
    save
  end

  def activated?
    activation_code.nil?
  end
  
  def should_validate_password?
    updating_password || new_record?
  end
  
  def send_password_reset
    begin
      self.password_reset_token = SecureRandom.urlsafe_base64
    end while self.class.exists?(password_reset_token: password_reset_token)
    
    self.password_reset_sent_at = Time.zone.now
    save
    
    AccountMailer.deliver_password_reset self
  end
  
  def generate_login_crossdomain_auth_token
    begin
      self.login_crossdomain_auth_token = SecureRandom.urlsafe_base64
    end while self.class.exists?(login_crossdomain_auth_token: login_crossdomain_auth_token)
    
    save
  end
end







# == Schema Information
#
# Table name: cluey_accounts
#
#  id                           :integer(8)      not null, primary key
#  name                         :string(255)
#  email                        :string(255)
#  password_hash                :string(255)
#  password_salt                :string(255)
#  created_at                   :datetime
#  updated_at                   :datetime
#  activation_code              :string(255)
#  activated_at                 :datetime
#  is_active                    :boolean(1)      default(TRUE)
#  password_reset_token         :string(255)
#  password_reset_sent_at       :datetime
#  login_crossdomain_auth_token :string(255)
#  first_name                   :string(255)     not null
#  last_name                    :string(255)     not null
#  country_id                   :integer(4)      not null
#  time_zone                    :string(255)     not null
#

