class Instructor < ActiveRecord::Base
  has_many :lesson_date_times
  has_many :programs
end
