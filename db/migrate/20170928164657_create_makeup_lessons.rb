class CreateMakeupLessons < ActiveRecord::Migration
  def change
    create_table :makeup_lessons do |t|
      t.integer :student_id
      t.integer :missed_lesson_date_time_id
      t.integer :new_lesson_date_time_id
      t.date :makeup_expiry_date
      t.integer :user_id

      t.timestamps null: false
    end
  end
end
