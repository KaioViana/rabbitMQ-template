import { connectToRabbitMQ } from './connectToRabbitMQ.js'


const routingKey = 'incorporadora2.email'
const queue_name = 'incorporadora1'
const msg = process.argv[2]
const time = new Date(process.argv[3]).getTime()
const DELAY_EXCHANGE = 'delay-exchange-test'

console.log(msg, time, routingKey)

async function emitDelayMsg () {
  try {
    const { conn, channel } = await connectToRabbitMQ('amqp://admin:123456@localhost:5672')
    await channel.assertExchange(DELAY_EXCHANGE, 'x-delayed-message', {
      autoDelete: false,
      durable: true,
      passive: true,
      arguments: {
        'x-delayed-type': 'topic'
      }
    })
  
    // const { queue } = await channel.assertQueue(queue_name, { durable: true })
    // await channel.bindQueue(queue, DELAY_EXCHANGE, routingKey)
  
    channel.publish(DELAY_EXCHANGE, routingKey, Buffer.from(msg), {
      headers: {
        'x-delay': 1000
      }
    })

    console.log('Message published!')

    setTimeout(() => {
      conn.close()
      process.exit(0)
    }, 500)
  } catch(err) {
    throw err
  }
}

emitDelayMsg()
