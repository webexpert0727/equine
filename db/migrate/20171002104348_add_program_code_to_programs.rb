class AddProgramCodeToPrograms < ActiveRecord::Migration
  def change
    add_column :programs, :program_code, :string
  end
end
