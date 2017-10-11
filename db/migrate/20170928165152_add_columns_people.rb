class AddColumnsPeople < ActiveRecord::Migration
  def change
    add_column :people, :person_email, :string
    add_column :people, :person_mobile, :string
    add_column :people, :person_homephone, :string
    add_column :people, :user_id, :integer
    add_column :people, :billing_person_id, :integer
    add_column :people, :riding_level, :string
    add_column :people, :date_of_birth, :date
  end
end
