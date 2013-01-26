class AddPrinterTypeToPrinters < ActiveRecord::Migration
  def self.up
    add_column :printers, :owner_fingerprint, :string
    add_column :printers, :printer_type, :integer
    add_column :printers, :network_share_name, :string
    
    rename_column :printers, :network_path, :local_printer
    
    #delete all printers
    execute("delete from printers")
    
    #clear all the printers columns for products and categories
    execute("update products set printers = ''")
    execute("update categories set printers = ''")
    
    #delete all the local receipt printer id settings
    execute("delete from global_settings where global_settings.key like '76_%'")
    
    #create the hard coded printers for each outlet
    Outlet.all.each do |o|
      for printer_type in [Printer::KITCHEN_1, Printer::BAR_1, Printer::KITCHEN_2, Printer::BAR_2] do
        @p = Printer.new
        @p.outlet_id = o.id
        @p.printer_type = printer_type
        @p.local_printer = ""
        @p.network_share_name = ""
        @p.label = Printer.label_for_printer_type(printer_type)
        @p.save!
      end
    end
    
  end

  def self.down
    remove_column :printers, :owner_fingerprint
    remove_column :printers, :printer_type
    remove_column :printers, :network_share_name
    
    rename_column :printers, :local_printer, :network_path
  end
end
