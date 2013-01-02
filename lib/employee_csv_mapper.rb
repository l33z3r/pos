class EmployeeCSVMapper
  
  STAFF_ID_INDEX = 0
  NAME_INDEX = 1
  NICKNAME_INDEX = 2
  CLOCKIN_CODE_INDEX = 3
  LOGIN_CODE_INDEX = 4
  ADDRESS_INDEX = 5
  TELEPHONE_INDEX = 6
  HOURLY_RATE_INDEX = 7
  OVERTIME_RATE_INDEX = 8
  ROLE_INDEX = 9
  
  def self.employee_from_row row, current_outlet
    @new_employee = Employee.new
      
    @new_employee.outlet_id = current_outlet.id
    
    @new_employee.staff_id = staff_id_from_row row
    @new_employee.name = name_from_row row
    @new_employee.nickname = nickname_from_row row
    
    @new_employee.clockin_code = clockin_code_from_row row
    @new_employee.passcode = login_code_from_row row
    
    @new_employee.address = address_from_row row
    @new_employee.telephone = telephone_from_row row
    
    @new_employee.hourly_rate = hourly_rate_from_row row
    @new_employee.overtime_rate = overtime_rate_from_row row
    
    @new_employee
  end
  
  def self.staff_id_from_row row
    get_index row, STAFF_ID_INDEX 
  end
      
  def self.name_from_row row
    get_index row, NAME_INDEX 
  end
  
  def self.nickname_from_row row
    get_index row, NICKNAME_INDEX 
  end
  
  def self.clockin_code_from_row row
    get_index row, CLOCKIN_CODE_INDEX 
  end
  
  def self.login_code_from_row row
    get_index row, LOGIN_CODE_INDEX 
  end
      
  def self.address_from_row row
    get_index row, ADDRESS_INDEX 
  end
      
  def self.telephone_from_row row
    get_index row, TELEPHONE_INDEX 
  end
  
  def self.hourly_rate_from_row row
    hourly_rate = get_index row, HOURLY_RATE_INDEX
    
    if hourly_rate.blank?
      hourly_rate = 0
    end
    
    return hourly_rate
  end
      
  def self.overtime_rate_from_row row
    overtime_rate = get_index row, OVERTIME_RATE_INDEX
    
    if overtime_rate.blank?
      overtime_rate = 0
    end
    
    return overtime_rate
  end
  
  def self.role_from_row row
    get_index row, ROLE_INDEX 
  end
  
  def self.get_index row, index
    if row[index]
      return row[index].strip.length > 0 ? row[index].strip : nil
    else
      return nil
    end
  end
end