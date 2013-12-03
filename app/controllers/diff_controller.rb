class DiffController < ApplicationController

  def get
    diff = HTTParty.get("https://github.com/#{params[:owner]}/#{params[:repo]}/pull/#{params[:id]}.diff")
    render json: { data: diff }
  end

end
