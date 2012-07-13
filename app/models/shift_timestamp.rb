class ShiftTimestamp < ActiveRecord::Base
  belongs_to :employee
  
  CLOCK_IN = 1
  CLOCK_OUT = 2
  BREAK_IN = 3
  BREAK_OUT = 4
  
  VALID_TIMESTAMP_TYPES = [CLOCK_IN, CLOCK_OUT, BREAK_IN, BREAK_OUT]

  validates :timestamp_type, :presence => true, :inclusion => { :in => VALID_TIMESTAMP_TYPES }
  
end
