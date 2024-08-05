require "openssl"
class CustomCipher
  def initialize
    @cipher = OpenSSL::Cipher::AES256.new(:CBC)
    @decipher = OpenSSL::Cipher::AES256.new(:CBC)

    @cipher.encrypt
    @decipher.decrypt

    @key = @cipher.random_key
    @iv = @cipher.random_iv

    @decipher.key =  @key
    @decipher.iv = @iv
  end

  def getKey
    @key
  end

  def getIV
    @iv
  end
  
  def encrypt(message)
    @cipher.update(message) + @cipher.final
  end
  
  def decrypt(message)
    @decipher.update(message) + @decipher.final
  end
end