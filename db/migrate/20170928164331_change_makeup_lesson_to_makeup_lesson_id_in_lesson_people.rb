class ChangeMakeupLessonToMakeupLessonIdInLessonPeople < ActiveRecord::Migration
  def change
    rename_column :lesson_people, :makeup_lesson, :makeup_lesson_id
  end
end
