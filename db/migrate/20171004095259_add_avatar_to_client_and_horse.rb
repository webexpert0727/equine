class AddAvatarToClientAndHorse < ActiveRecord::Migration
  def change
    add_column :instructors, :avatar, :string
    add_column :horses, :avatar, :string
    add_column :students, :avatar, :string
  end
end
