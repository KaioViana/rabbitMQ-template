import amqp from 'amqplib/callback_api.js'


amqp.connect('amqp://admin:123456@localhost:5672', (err, connection) => {
  if(err) {
    throw new Error(`ERRO CONNECT ${err}`)
  }

  connection.createChannel((err, channel) => {
    if(err) {
      throw new Error(`ERRO CHANNEL ${err}`)
    }

    const exchange_name = 'delay_msg'
    const routing_key = 'email'

    const exchange_options = {
      autoDelete: true,
      durable: true,
      passive: true,
      arguments: {
        'x-delayed-type': 'direct'
      }
    }

    channel.assertExchange(exchange_name, 'x-delayed-message', exchange_options)
    
    channel.assertQueue('', {
      exclusive: true
    }, (err, q) => {
      if(err) {
        throw new Error(`ERRO ASSERT QUEUE ${err}`)
      }

      console.log('[*] Waiting for QUEUE =>', q.queue)
     
      channel.bindQueue(q.queue, exchange_name, routing_key)

      channel.consume(q.queue, (msg) => {
        console.log(' [x] %s: "%s"', msg.fields.routingKey, msg.content.toString())
      }, { noAck: true })
    })
  })
})