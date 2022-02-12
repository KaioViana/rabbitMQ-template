import { connectToRabbitMQ } from './connectToRabbitMQ.js';

class RabbitMqScheduler {
  constructor() {
  }

  async init() {
    try {
      const {conn, channel} = await connectToRabbitMQ('amqp://admin:123456@localhost:5672');
      this.conn = conn;
      this.channel = channel;
    } catch (err) {
      console.log(err.message);
    }
  }

  async handleScheduleMessage(queue, exchange, routingKey) {
    try {
    
      await this.channel.assertExchange(exchange, 'x-delayed-message', {
        autoDelete: false,
        durable: true,
        passive: true,
        arguments: {
          'x-delayed-type': 'topic'
        }
      });

      const q = await this.channel.assertQueue(queue, { durable: true });

      if(q.consumerCount === 1) {
        setTimeout(() => {
          console.log('this queue already has an consumer!')
          this.conn.close();
          process.exit(0);
        }, 500);
      }

      await this.channel.bindQueue(q.queue, exchange, routingKey);

      await this.channel.prefetch(1);

      await this.channel.consume(q.queue, (msg) => {
        console.log(`routingKey: ${msg.fields.routingKey}, message ${msg.content.toString()}`)
        this.channel.ack(msg);
      }, { noAck: false });
    } catch (err) {
      throw err;
    }
  }

  async publishScheduleMessage(data, exchange, delay, queue, routingKey) {
    try {
      await this.channel.assertExchange(exchange, 'x-delayed-message', {
        autoDelete: false,
        durable: true,
        passive: true,
        arguments: {
          'x-delayed-type': 'topic'
        }
      });

      const q = await this.channel.assertQueue(queue, { durable: true });
      await this.channel.bindQueue(q.queue, exchange, routingKey);

      const message = JSON.stringify(data);

      this.channel.publish(exchange, routingKey, Buffer.from(message), {
        delivery: 2,
        mandatory: true,
        headers: {
          'x-delay': delay,
        },
      });
      console.log('PUBLISHED!');
    } catch (err) {
      throw err;
    }
  }
}

export { RabbitMqScheduler };
