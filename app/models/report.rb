class Report < ActiveRecord::Base

  def vat_rate(tax, gross)
    gross * tax / 100
  end

  def net_result(gross, vat)
    gross - vat
  end


end