import amqp from 'amqplib/callback_api.js';


amqp.connect('amqp://admin:123456@localhost:5672', (error, connection) => {
  if(error) {
    throw error
  }

  connection.createChannel((error, channel) => {
    if(error) {
      throw error
    }

    const queue_name = process.argv.slice(2).join(' ')  || 'ICORPORADORA_TEST'
    const exchange_name = 'delay_msg'
    const msg = 'Hello, world'
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

    channel.assertQueue(queue_name, {
      durable: true
    })

    channel.publish(exchange_name, routing_key, Buffer.from(msg), {
      deliveryMode: 2,
      mandatory: true,
      headers: {
        "x-delay": 60000, // Specifies the duration of delay in milliseconds 
      }
    })
    console.log(' [x] Sent %s: "%s"', routing_key, msg)
  })

})