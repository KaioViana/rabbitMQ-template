import amqp from 'amqplib/callback_api.js'
import 'dotenv/config'


//Abrindo conexão
amqp.connect('amqp://admin:123456@localhost:5672', (err, connection) => {
  if (err) {
    throw err
  }

  // Criando um canal para realizar a comunicação
  connection.createChannel((err1, channel) => {
    if (err1) {
      throw err1  
    }

    const queue_name = 'hello'
    const msg = 'Hello, World'

    // Criando fila e passando os parâmetros
    channel.assertQueue(queue_name, {
      durable: false
    })

    // enviando mensagem
    channel.sendToQueue(queue_name, Buffer.from(msg))

    console.log(" [X] Sent %s", msg)

  })
  // Fechando conexão
  setTimeout(() => {
    connection.close()
    process.exit(0)
  }, 500)
})
