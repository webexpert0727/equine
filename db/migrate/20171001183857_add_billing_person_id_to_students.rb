class AddBillingPersonIdToStudents < ActiveRecord::Migration
  def change
    add_column :students, :billing_person_id, :integer
  end
end
