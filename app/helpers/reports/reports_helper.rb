module Reports::ReportsHelper

  def vat_rate(tax, gross)
    gross * tax / 100
  end

  def net_result(gross, vat)
    gross - vat
  end


end
