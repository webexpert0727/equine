class Api::V1::ProductsController < Api::V1::ApiController

  def index
    render status: 200, json: { products: Product.all }
  end

  def create
  end

end
