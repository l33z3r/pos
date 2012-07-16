class WorkReport < ActiveRecord::Base
  belongs_to :employee
  
  serialize :report_data
end
