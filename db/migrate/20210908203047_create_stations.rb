class CreateStations < ActiveRecord::Migration[6.1]
  def change
    create_table :stations do |t|
      t.string :name
      t.string :city
      t.string :address
      t.string :num
      t.float :latitude
      t.float :longitude
      t.text :description

      t.timestamps
    end
  end
end
