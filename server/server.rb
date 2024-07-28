require 'em-websocket'
require 'json'

EM.run do
  @clients = []

  EM::WebSocket.run(host: '0.0.0.0', port: 8080) do |ws|
    ws.onopen do |handshake|
      puts "Client connected"
      @clients << ws
    end

    ws.onmessage do |msg|
      puts "Received message: #{msg}"
      @clients.each { |client| client.send msg }
    end

    ws.onclose do
      puts "Client disconnected"
      @clients.delete(ws)
    end
  end
end
