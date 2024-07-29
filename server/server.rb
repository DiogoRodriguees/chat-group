require 'em-websocket'
require 'json'
require 'sinatra'
require 'fileutils'

set :public_folder, 'public'

clients = {}
typing_users = {}

EM.run do
  EM::WebSocket.run(host: '0.0.0.0', port: 8080) do |ws|
    ws.onopen do |handshake|
      user_id = handshake.query["user_id"]
      group_id = handshake.query["group_id"]

      clients[user_id] ||= {}
      clients[user_id][group_id] ||= []
      clients[user_id][group_id] << ws

      ws.onmessage do |msg|
        data = JSON.parse(msg)
        if data["type"] == "text" || data["type"] == "image"
          clients.each do |uid, groups|
            if groups[group_id]
              groups[group_id].each { |client| client.send msg }
            end
          end
        elsif data["type"] == "typing"
          typing_users[data["user_id"]] = data["is_typing"]
          clients.each do |uid, groups|
            if groups[group_id]
              groups[group_id].each { |client| client.send msg }
            end
          end
        end
      end

      ws.onclose do
        clients[user_id][group_id].delete(ws)
        clients[user_id].delete(group_id) if clients[user_id][group_id].empty?
        clients.delete(user_id) if clients[user_id].empty?
      end
    end
  end

  Thread.new do
    Sinatra::Application.run!
  end
end

post '/upload' do
  if params[:file] && params[:user_id] && params[:group_id]
    filename = params[:file][:filename]
    file = params[:file][:tempfile]

    dir = "public/uploads/#{params[:group_id]}"
    FileUtils.mkdir_p(dir) unless File.directory?(dir)
    filepath = File.join(dir, filename)

    File.open(filepath, 'wb') do |f|
      f.write(file.read)
    end

    content_type :json
    { status: 'success', url: "/uploads/#{params[:group_id]}/#{filename}" }.to_json
  else
    status 400
    { status: 'error', message: 'Missing parameters' }.to_json
  end
end
