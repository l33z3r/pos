class AddPermIdToDisplayButtons < ActiveRecord::Migration
  def self.up
    add_column :display_buttons, :perm_id, :integer

    @x_total_button = DisplayButton.find_by_button_text("X Total")
    @x_total_button.perm_id = 1
    @x_total_button.save

    @z_total_button = DisplayButton.find_by_button_text("Z Total")
    @z_total_button.perm_id = 2
    @z_total_button.save

    @x_reports_button = DisplayButton.find_by_button_text("X Reports")
    @x_reports_button.perm_id = 3
    @x_reports_button.save

    @z_reports_button = DisplayButton.find_by_button_text("Z Reports")
    @z_reports_button.perm_id = 4
    @z_reports_button.save
  end

  def self.down
    remove_column :display_buttons, :perm_id
  end
end
