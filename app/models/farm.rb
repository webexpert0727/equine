class Farm < ActiveRecord::Base
  has_many :locations
  has_many :programs
end
