class Program < ActiveRecord::Base
  belongs_to :program_type
  belongs_to :reporting_category
  belongs_to :instructor
  belongs_to :farm
end
