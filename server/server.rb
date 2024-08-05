require 'em-websocket'
require 'json'
require 'sinatra'
require 'fileutils'
require 'openssl'
require 'base64'
require 'aes'
require_relative "encrypt"

class ChatServer
  def initialize
    @clients = {}
    @cipher = CustomCipher.new
  end

  def run
    EM.run do
      EM::WebSocket.run(host: '0.0.0.0', port: 8080) do |ws|
        ws.onopen do |handshake|
          user_id = handshake.query["user_id"]
          group_id = handshake.query["group_id"]

          puts ws
          ws.send({type: 'public_key', key: Base64.encode64(@cipher.getKey), iv: Base64.encode64(@cipher.getIV)}.to_json)
          @clients[user_id] ||= {}
          @clients[user_id][group_id] ||= []
          @clients[user_id][group_id] << ws
          
          ws.onmessage { |msg| onmessage(ws, msg, user_id, group_id)}

          ws.onclose { onclose(ws) }
        end
      end

      Thread.new do
          Sinatra::Application.run!
      end
    end
  end

  private

  def onclose(ws)
    puts user_id + ' leaving'
    @clients[user_id][group_id].delete(ws)
    @clients[user_id].delete(group_id) if @clients[user_id][group_id].empty?
    @clients.delete(user_id) if @clients[user_id].empty?
  end

  def onmessage(ws, msg, user_id, group_id)
    data = JSON.parse(msg)

    if data["type"] == "text" || data["type"] == "image" || data["type"] == "typing"
      @clients.each do |uid, groups|
        if groups[group_id]
          groups[group_id].each { |client| client.send msg }
        end
      end
    end
  end
end

ChatServer.new.run
