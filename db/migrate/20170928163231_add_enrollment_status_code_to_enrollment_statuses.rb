class AddEnrollmentStatusCodeToEnrollmentStatuses < ActiveRecord::Migration
  def change
    add_column :enrollment_statuses, :enrollment_status_code, :string, :null => true
  end
end
