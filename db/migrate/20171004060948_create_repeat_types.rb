class CreateRepeatTypes < ActiveRecord::Migration
  def change
    create_table :repeat_types do |t|
      t.string :repeat_type_name
      t.timestamps
    end
  end
end
