import amqp from 'amqplib/callback_api.js'


amqp.connect('amqp://admin:123456@localhost:5672', (error0, connection) => {
  if(error0) {
    throw error0
  }

  connection.createChannel((error1, channel) => {
    if(error1) {
      throw error1
    }

    const exchange = 'topic_logs'
    const args = process.argv.slice(2)
    const key = (args.length > 0) ? args[0] : 'anonymous.info'
    const msg = args.slice(1).join(' ') || 'Hello world'

    channel.assertExchange(exchange, 'topic', {
      durable: false
    })

    channel.publish(exchange, key, Buffer.from(msg))
    console.log(' [x] Sent %s: "%s"', key, msg)

  })

  setTimeout(() => {
    connection.close()
    process.exit(0)
  }, 500)
})
