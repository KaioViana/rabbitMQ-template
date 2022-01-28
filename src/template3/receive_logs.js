import amqp from 'amqplib/callback_api.js'


amqp.connect('amqp://admin:123456@localhost:5672', (err, connection) => {
  if (err) {
    throw err
  }

  // Criando um canal para realizar a comunicação
  connection.createChannel((err1, channel) => {
    if(err1) {
      throw err1
    }

    const exchange_name = 'logs' // Nome da exachange

    // Criando uma exchange do tipo fanout
    channel.assertExchange(exchange_name, 'fanout', {
      durable: false
    })

    // Ouvindo filas
    channel.assertQueue('', {
      exclusive: true
    }, (err2, q) => {
      if (err2) {
        throw err2
      }

      console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', q.queue)
      
      // Fazendo o binding da fila
      channel.bindQueue(q.queue, exchange_name, '')

      channel.consume(q.queue, (msg) => {
        if(msg.content) {
          console.log(' [x] %s', msg.content.toString())
        }
      }, { noAck: true })
    })
  })
})
