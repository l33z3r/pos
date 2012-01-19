module ActionView
  module Helpers 
    module NumberHelper

      #THE FOLLOWING CODE WAS AN ERROR IN RAILS 3 SO i HAD TO APPLY A PATCH (https://github.com/rails/rails/commit/7c8a5f5759a0c63945d133280fb78deaa86b65b9)
      def number_to_human(number, options = {})
        options.symbolize_keys!

        number = begin
          Float(number)
        rescue ArgumentError, TypeError
          if options[:raise]
            raise InvalidNumberError, number
          else
            return number
          end
        end

        defaults = I18n.translate(:'number.format', :locale => options[:locale], :default => {})
        human    = I18n.translate(:'number.human.format', :locale => options[:locale], :default => {})
        defaults = defaults.merge(human)

        options = options.reverse_merge(defaults)
        #for backwards compatibility with those that didn't add strip_insignificant_zeros to their locale files
        options[:strip_insignificant_zeros] = true if not options.key?(:strip_insignificant_zeros)

        units = options.delete :units
        unit_exponents = case units
        when Hash
          units
        when String, Symbol
          I18n.translate(:"#{units}", :locale => options[:locale], :raise => true)
        when nil
          I18n.translate(:"number.human.decimal_units.units", :locale => options[:locale], :raise => true)
        else
          raise ArgumentError, ":units must be a Hash or String translation scope."
        end.keys.map{|e_name| DECIMAL_UNITS.invert[e_name] }.sort_by{|e| -e}

        number_exponent = number != 0 ? Math.log10(number.abs).floor : 0
        
        #THE FOLLOWING CODE WAS AN ERROR IN RAILS 3 SO i HAD TO APPLY A PATCH (https://github.com/rails/rails/commit/7c8a5f5759a0c63945d133280fb78deaa86b65b9)
        #display_exponent = unit_exponents.find{|e| number_exponent >= e }
        display_exponent = unit_exponents.find{ |e| number_exponent >= e } || 0
        number  /= 10 ** display_exponent

        unit = case units
        when Hash
          units[DECIMAL_UNITS[display_exponent]]
        when String, Symbol
          I18n.translate(:"#{units}.#{DECIMAL_UNITS[display_exponent]}", :locale => options[:locale], :count => number.to_i)
        else
          I18n.translate(:"number.human.decimal_units.units.#{DECIMAL_UNITS[display_exponent]}", :locale => options[:locale], :count => number.to_i)
        end

        decimal_format = options[:format] || I18n.translate(:'number.human.decimal_units.format', :locale => options[:locale], :default => "%n %u")
        formatted_number = number_with_precision(number, options)
        decimal_format.gsub(/%n/, formatted_number).gsub(/%u/, unit).strip.html_safe
      end
    end
  end
end