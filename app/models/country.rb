# coding: utf-8
#the above comment is to allow the euro sign

class Country < ActiveRecord::Base
  attr_accessible :id, :iso, :name
  
  has_many :cluey_accounts
  
  IE_COUNTRY_ID = Country.find_by_iso("IE").try(:id)
  GB_COUNTRY_ID = Country.find_by_iso("GB").try(:id)
  US_COUNTRY_ID = Country.find_by_iso("US").try(:id)
  AU_COUNTRY_ID = Country.find_by_iso("AU").try(:id)
  
  #can maybe move this stuff to a yaml file
  def self.get_default_national_service_charge_label outlet
    @current_country_id = outlet.cluey_account.country_id 
      
    if @current_country_id == Country::IE_COUNTRY_ID
      @default_service_charge_label = "Tip"
    elsif @current_country_id == Country::GB_COUNTRY_ID
      @default_service_charge_label = "Service Charge"
    elsif @current_country_id == Country::US_COUNTRY_ID
      @default_service_charge_label = "Service Charge"
    elsif @current_country_id == Country::AU_COUNTRY_ID
      @default_service_charge_label = "Service Charge"
    else
      @default_service_charge_label = "Service Charge"
    end
      
    @default_service_charge_label
  end
  
  def self.get_default_national_tax_label outlet
    @current_country_id = outlet.cluey_account.country_id 
      
    if @current_country_id == Country::IE_COUNTRY_ID
      @default_tax_label = "VAT"
    elsif @current_country_id == Country::GB_COUNTRY_ID
      @default_tax_label = "VAT"
    elsif @current_country_id == Country::US_COUNTRY_ID
      @default_tax_label = "Sales Tax"
    elsif @current_country_id == Country::AU_COUNTRY_ID
      @default_tax_label = "GST"
    else
      @default_tax_label = "Sales Tax"
    end
      
    @default_tax_label
  end
  
  def self.get_default_national_currency_symbol outlet
    @current_country_id = outlet.cluey_account.country_id 
      
    if @current_country_id == Country::IE_COUNTRY_ID
      @default_currency_symbol = "€"
    elsif @current_country_id == Country::GB_COUNTRY_ID
      @default_currency_symbol = "£"
    elsif @current_country_id == Country::US_COUNTRY_ID
      @default_currency_symbol = "$"
    elsif @current_country_id == Country::AU_COUNTRY_ID
      @default_currency_symbol = "$"
    else
      @default_currency_symbol = "$"
    end
      
    @default_currency_symbol
  end
  
  def self.get_default_national_small_currency_symbol outlet
    @current_country_id = outlet.cluey_account.country_id 
      
    if @current_country_id == Country::IE_COUNTRY_ID
      @default_small_currency_symbol = "c"
    elsif @current_country_id == Country::GB_COUNTRY_ID
      @default_small_currency_symbol = "p"
    elsif @current_country_id == Country::US_COUNTRY_ID
      @default_small_currency_symbol = "c"
    elsif @current_country_id == Country::AU_COUNTRY_ID
      @default_small_currency_symbol = "c"
    else
      @default_small_currency_symbol = "c"
    end
      
    @default_small_currency_symbol
  end
  
  def self.get_split_bill_button_name outlet
    @current_country_id = outlet.cluey_account.country_id 
      
    if @current_country_id == Country::IE_COUNTRY_ID
      @default_split_bill_button_name = "Split Bill"
    elsif @current_country_id == Country::GB_COUNTRY_ID
      @default_split_bill_button_name = "Split Bill"
    elsif @current_country_id == Country::US_COUNTRY_ID
      @default_split_bill_button_name = "Split Check"
    elsif @current_country_id == Country::AU_COUNTRY_ID
      @default_split_bill_button_name = "Split Check"
    else
      @default_split_bill_button_name = "Split Bill"
    end
      
    @default_split_bill_button_name
  end
  
  def self.get_z_total_button_name outlet
    @current_country_id = outlet.cluey_account.country_id 
      
    if @current_country_id == Country::IE_COUNTRY_ID
      @default_z_total__button_name = "Z Total"
    elsif @current_country_id == Country::GB_COUNTRY_ID
      @default_z_total__button_name = "Z Total"
    elsif @current_country_id == Country::US_COUNTRY_ID
      @default_z_total__button_name = "End Of Day Z"
    elsif @current_country_id == Country::AU_COUNTRY_ID
      @default_z_total__button_name = "End Of Day Z"
    else
      @default_z_total__button_name = "Z Total"
    end
      
    @default_z_total__button_name
  end
  
end
# == Schema Information
#
# Table name: countries
#
#  id   :integer(4)      not null, primary key
#  iso  :string(255)
#  name :string(255)
#

