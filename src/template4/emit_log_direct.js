import amqp from 'amqplib/callback_api.js';

amqp.connect('amqp://admin:123456@localhost:5672', (error0, connection) => {
  if(error0) {
    throw error0
  }

  connection.createChannel((error1, channel) => {
    if(error1) {
      throw error1
    }

    const exachange_name = 'direct_logs'
    const args = process.argv.slice(2)
    const msg = args.slice(1).join(' ') || 'Hello World'
    const severity = (args.length > 0) ? args[0] : 'info'

    channel.assertExchange(exachange_name, 'direct', {
      durable: false
    })

    channel.publish(exachange_name, severity, Buffer.from(msg))
    console.log('[x] Sent %s: "%s"', severity, msg)
  })

  setTimeout(() => {
    connection.close()
    process.exit(0)
  }, 500)
})
