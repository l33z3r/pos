module ApplicationHelper

  def product_image_thumb product, show_default=false
    if product.has_product_image?
      image_tag product.product_image.url(:thumb)
    elsif show_default
      image_tag "default_product_image.jpg"
    end
  end
  
  def employee_image_thumb employee, show_default=false
    if employee.has_employee_image?
      image_tag employee.employee_image.url(:thumb)
    elsif show_default
      image_tag "default_employee_image.jpg"
    end
  end

  def button_action button
    @action = ButtonMapper.new.action_for_button button
    @function_call = "doDisplayButtonPasscodePrompt(#{button.id}, function () {#{@action}});"
  end

  def link_to_add_modifier_fields(f)
    modifier = Modifier.new
    fields = f.fields_for(:modifiers, modifier, :child_index => "new_modifier") do |builder|
      render("modifier_fields", :f => builder)
    end
    link_to_function("New Modifier", "addModifierFields(this, \"#{escape_javascript(fields)}\")")
  end
  
  def show_flash
    [:notice, :warning, :error].collect do |key|
      content_tag(:div, flash[key], :id => "flash_container", :class => "flash flash_#{key}", :style => "display: none;") unless flash[key].blank?
    end.join
  end

  def is_admin?
    session[:current_employee_admin] == 1
  end

end
