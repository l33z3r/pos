module ApplicationHelper

  def product_image_thumb product, show_default=false
    @img_url = product_image_url product, show_default
    
    image_tag(@img_url) if @img_url
  end
  
  def product_image_url product, show_default=false
    if product.has_product_image?
      return product.product_image.url(:thumb, false)
    elsif product.display_image and !product.display_image.blank?
      return "product_images/#{product.display_image}"
    elsif show_default
      return "default_product_image.jpg"
    end
    
    return nil
  end
  
  def employee_image_thumb employee, show_default=false
    if Employee.is_cluey_user?(employee.id)
      image_tag "cluey_user_image.jpg"
    elsif employee.has_employee_image?
      image_tag employee.employee_image.url(:thumb)
    elsif show_default
      image_tag "default_employee_image.jpg"
    end
  end
  
  def business_logo_thumb show_default=false
    @gs = GlobalSetting.setting_for GlobalSetting::LOGO, {:logo_type => "business_logo"}
    
    if @gs.has_logo?
      image_tag @gs.logo.url(:thumb)
    elsif show_default
      image_tag "default_business_logo_image.jpg"
    end
  end
  
  def payment_method_logo_thumb pm, show_default=false
    if pm.has_logo?
      image_tag pm.logo.url(:thumb)
    elsif show_default
      image_tag "default_payment_method_image.png"
    end
  end

  def button_action button
    @action = ButtonMapper.new.action_for_button button
    @function_call = "doDisplayButtonPasscodePrompt(#{button.id}, function () {#{@action}});"
    @function_call
  end
  
  def button_icon button
    #payment method shortcut buttons
    @pm_shortcut_buttons = ButtonMapper.pm_shortcut_buttons
    
    if @pm_shortcut_buttons.include?(button.perm_id.to_i)
      
      if button.perm_id.to_i == ButtonMapper::PM_SHORTCUT_1_BUTTON
        @shortcut_num = 1
      elsif button.perm_id.to_i == ButtonMapper::PM_SHORTCUT_2_BUTTON
        @shortcut_num = 2
      elsif button.perm_id.to_i == ButtonMapper::PM_SHORTCUT_3_BUTTON
        @shortcut_num = 3
      end
    
      @pm_shortcut_id = GlobalSetting.parsed_setting_for GlobalSetting::PM_SHORTCUT_ID, {:shortcut_num => @shortcut_num}
      @shortcut_payment_method = PaymentMethod.find_by_id(@pm_shortcut_id)
      
      return payment_method_logo_thumb(@shortcut_payment_method, true)
    else
      @icon_path = ButtonMapper.new.icon_path_for button
    
      if @icon_path
        @rel_image_path = "button_logos/#{@icon_path}"
      
        if FileTest.exists?(RAILS_ROOT + "/public/images/#{@rel_image_path}")
          return image_tag @rel_image_path, :alt => nil
        else 
          return nil
        end
      else
        return nil
      end
    end
  end
  
  def button_text button
    #payment method shortcut buttons
    @pm_shortcut_buttons = ButtonMapper.pm_shortcut_buttons
    
    if @pm_shortcut_buttons.include?(button.perm_id.to_i)
      
      if button.perm_id.to_i == ButtonMapper::PM_SHORTCUT_1_BUTTON
        @shortcut_num = 1
      elsif button.perm_id.to_i == ButtonMapper::PM_SHORTCUT_2_BUTTON
        @shortcut_num = 2
      elsif button.perm_id.to_i == ButtonMapper::PM_SHORTCUT_3_BUTTON
        @shortcut_num = 3
      end
    
      @pm_shortcut_id = GlobalSetting.parsed_setting_for GlobalSetting::PM_SHORTCUT_ID, {:shortcut_num => @shortcut_num}
      @shortcut_payment_method = PaymentMethod.find_by_id(@pm_shortcut_id)
      
      return @shortcut_payment_method.name
    else
      return button.button_text
    end
  end

  def link_to_add_modifier_fields(f)
    modifier = Modifier.new
    fields = f.fields_for(:modifiers, modifier, :child_index => "new_modifier") do |builder|
      render("modifier_fields", :f => builder)
    end
    link_to_function("New Modifier", "addModifierFields(this, \"#{escape_javascript(fields)}\")")
  end
  
  def show_flash
    
  end

  def is_admin?
    session[:current_employee_admin] == 1
  end
  
  def coin_label_for val
    val = val.to_i
    
    if val < 100
      val = "#{val}#{@currency_symbol_small}"
    else
      val = "#{@currency_symbol}#{val/100}"
    end
    
    return val
  end
  
  def menu_item_name item
    if item.product.has_product_image? and item.product.show_button_image
      #show 1 line of text
      if !item.product.button_text_line_1.blank?
        return item.product.button_text_line_1
      else
        return item.name
      end
    else
      if item.product.button_text_line_1.blank?
        return item.name
      else
        #show all 3 lines of text
        item_name_html = content_tag :div, :class => "line1" do item.product.button_text_line_1 end
        item_name_html += content_tag :div, :class => "line2" do item.product.button_text_line_2 end
        item_name_html += content_tag :div, :class => "line3" do item.product.button_text_line_3 end
      end
    end
  end
  
  def menu_item_background_css item
    @thecss = ""
    
    @bgcolor1 = item.product.button_bg_color
    @bgcolor2 = item.product.button_bg_color_2
    
    @has_gradient = (!@bgcolor1.blank? and !@bgcolor2.blank?)
    
    if @has_gradient
      @thecss = "background: -moz-linear-gradient(#{@bgcolor1}, #{@bgcolor2}) repeat scroll 0 0 transparent;"
      @thecss += "background: -webkit-gradient(linear, left top, left bottom, from(#{@bgcolor1}), to(#{@bgcolor2}));"
    else
      @thecss = (@bgcolor1.blank? ? "" : "background-color: #{@bgcolor1};")
    end
    
    return @thecss
  end
  
  def oia_background_css oia
    @thecss = ""
    
    @bgcolor1 = oia.background_color
    @bgcolor2 = oia.background_color_2
    
    @has_gradient = (!@bgcolor1.blank? and !@bgcolor2.blank?)
    
    if @has_gradient
      @thecss = "background: -moz-linear-gradient(#{@bgcolor1}, #{@bgcolor2}) repeat scroll 0 0 transparent;"
      @thecss += "background: -webkit-gradient(linear, left top, left bottom, from(#{@bgcolor1}), to(#{@bgcolor2}));"
    else
      @thecss = (@bgcolor1.blank? ? "" : "background-color: #{@bgcolor1};")
    end
    
    return @thecss
  end
  
  #this removes spaces from a string and downcases it for use as an id
  def id_safe string
    string.strip.gsub(" ", "_").downcase
  end
  
  def money_image_button amount
    @html = ""
    
    @image_path = "#{amount}#{@currency_note_image_setting}.jpg"
    
    if FileTest.exists?(RAILS_ROOT + "/public/images/#{@image_path}")
      @html = content_tag :div, :class => "money", :onclick => "moneySelected(#{amount});" do
        image_tag @image_path
      end
    end
    
    @html
  end

  def hours_mins_for_seconds num_seconds
    @num_seconds_in_minute = 60.0
    @num_seconds_in_hour = 3600.0
  
    @complete_hours = (num_seconds/@num_seconds_in_hour).to_i
    @hours_rounded = (num_seconds/@num_seconds_in_hour).round(2)
  
    @complete_mins = ((num_seconds % @num_seconds_in_hour)/@num_seconds_in_minute).to_i
  
    return "#{@complete_hours}h #{@complete_mins}m (#{@hours_rounded}hrs)"
  end

end
