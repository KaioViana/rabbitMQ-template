import amqp from 'amqplib/callback_api.js';


amqp.connect('amqp://admin:123456@localhost:5672', (err, connection) => {
  if (err) {
    throw err
  }

  // Criando um canal para realizar a comunicação
  connection.createChannel((err1, channel) => {
    if (err1) {
      throw err1
    }

    const exchange_name = 'logs' // Nome da exchange
    const msg = process.argv.slice(2).join(' ') || 'Hello, World'

    // Criando uma exchange do tipo fanout
    channel.assertExchange(exchange_name, 'fanout', {
      durable: false
    })

    // Publicando a mensagem para a exchange_name e informando a fila. Quando vazio, Rabbit gera um nome random
    channel.publish(exchange_name, '', Buffer.from(msg))
    console.log(' [x] Sent %s', msg)
  })

  setTimeout(() => {
    connection.close()
    process.exit(0)
  }, 500)
})
