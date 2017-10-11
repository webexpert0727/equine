# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

DayOfWeek.create([
                     { day_of_week_name: 'Sunday', day_of_week_value: 0 },
                     { day_of_week_name: 'Monday', day_of_week_value: 1 },
                     { day_of_week_name: 'Tuesday', day_of_week_value: 2 },
                     { day_of_week_name: 'Wednesday', day_of_week_value: 3 },
                     { day_of_week_name: 'Thursday', day_of_week_value: 4 },
                     { day_of_week_name: 'Friday', day_of_week_value: 5 },
                     { day_of_week_name: 'Saturday', day_of_week_value: 6 }
                 ])

RepeatType.create([
                     { repeat_type_name: 'Null', repeat_type_value: 0 },
                     { repeat_type_name: 'Daily', repeat_type_value: 1 },
                     { repeat_type_name: 'Weekly', repeat_type_value: 2 },
                 ])
