json.extract! station, :id, :name, :city, :address, :num, :latitude, :longitude, :description, :created_at, :updated_at
json.url station_url(station, format: :json)
