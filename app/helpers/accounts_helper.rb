module AccountsHelper
  def current_cluey_account
    @current_cluey_account ||= ClueyAccount.find(session[:current_cluey_account_id]) if session[:current_cluey_account_id]
    @current_cluey_account
  end
  
  def current_outlet
    @current_outlet ||= Outlet.find(session[:current_outlet_id]) if session[:current_outlet_id]
    @current_outlet
  end
  
  #THE FOLLOWING CODE IS IMPORTED FROM A PLUGIN FOR GEO SELECT
  
  def make_attributes(hsh)
    unless hsh.nil?
      output = ""
      hsh.each {|key, val| output << "#{key}=\"#{val}\""}
    end
    output
  end


  def country_code_select(object, method, priority_countries=nil, options={}, html_options={})

    countries = [Country.all.collect{|r| r.name}, Country.all.collect{|r| r.id}].transpose.sort

    if priority_countries.nil?
      output = select(object, method, countries, options, html_options)
    else
      output = "<select id='#{object}_#{method}' name='#{object}[#{method}]' #{make_attributes(html_options)}>\n"
      output << "<option value=\"0\">-- Select --</option>" if options[:include_blank] == true

      # get ids of priority_countries if needed
      unless priority_countries[0].respond_to?(:id)
        # get ids by an array of iso codes
        priority_countries_ids = Country.where(:iso=>priority_countries).all
      else
        priority_countries_ids = priority_countries
      end

      #
      priority_countries_ids.each do |pc|
        if options[:selected] == pc[:id]
          output << "<option value=\"#{pc[:id]}\" selected=\"selected\">#{pc[:name]}</option>"
        else
          output << "<option value=\"#{pc[:id]}\">#{pc[:name]}</option>"
        end
      end

      output << "<option value=\"0\" disabled=\"disabled\">----------------------------</option>"

      output << options_for_select(countries, options[:selected])
      output << "</select>\n"
    end

    output.html_safe

  end
  
  
end
