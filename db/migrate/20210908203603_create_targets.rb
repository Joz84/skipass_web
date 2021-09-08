class CreateTargets < ActiveRecord::Migration[6.1]
  def change
    create_table :targets do |t|
      t.string :address
      t.float :latitude
      t.float :longitude
      t.float :temperature
      t.float :pressure

      t.timestamps
    end
  end
end
