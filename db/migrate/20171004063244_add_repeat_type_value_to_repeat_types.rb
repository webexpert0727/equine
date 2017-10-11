class AddRepeatTypeValueToRepeatTypes < ActiveRecord::Migration
  def change
    add_column :repeat_types, :repeat_type_value, :integer
  end
end
