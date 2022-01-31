import { connectToRabbitMQ } from './connectToRabbitMQ.js'


const DELAY_EXCHANGE = 'delay-exchange-test'
const routingKey = 'incorporadora2.email'
const queue_name = 'incorporadora2'

async function consumerDelayMsgQueue() {
  try {
    console.log(` [*]  Waiting scheduled message => ${queue_name} => ${routingKey}`)

    const { channel } = await connectToRabbitMQ('amqp://admin:123456@localhost:5672')

    await channel.assertExchange(DELAY_EXCHANGE, 'x-delayed-message', {
      autoDelete: false,
      durable: true,
      passive: true,
      arguments: {
        'x-delayed-type': 'topic'
      }
    })

    const queue = await channel.assertQueue(queue_name, { durable: true })

    await channel.bindQueue(queue.queue, DELAY_EXCHANGE, routingKey)

    await channel.prefetch(1)

    await channel.consume(queue.queue, (msg) => {
      console.log(' [x] %s "%s"', msg.fields.routingKey, msg.content.toString())
      channel.ack(msg)
    })
  } catch(err) {
    throw err
  }
}

consumerDelayMsgQueue()
