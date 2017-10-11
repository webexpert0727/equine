class ChangeColumnsInPrograms < ActiveRecord::Migration
  def change
    rename_column :programs, :default_product_id, :product_id
    rename_column :programs, :default_instructor_id, :instructor_id
  end
end
