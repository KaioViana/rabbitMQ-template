import { RabbitMqScheduler } from './RabbitMqScheduler.js'

function run() {
  const scheduler = new RabbitMqScheduler();
  
  const QUEUE_NAME = 'incorporadora_1';
  const EXCHANGE = 'schedule_exchange';
  const ROUTING_KEY = 'incorporadora_1.email'
  const DELAY = 5000;
  const MSG = {
    index: 1,
    content: 'CONTENT_TEST',
    bonus: 'Congragulations you scheduled1'
  }
  
  console.log(`QUEUE_NAME=${QUEUE_NAME}\nEXCHANGE=${EXCHANGE}\nROUTING_KEY=${ROUTING_KEY}\nDELAY=${DELAY}`);
  
  scheduler.init().then(() => {
    scheduler.publishScheduleMessage(
      MSG,
      EXCHANGE,
      DELAY,
      QUEUE_NAME,
      ROUTING_KEY
    );

    scheduler.handleScheduleMessage(QUEUE_NAME, EXCHANGE, ROUTING_KEY);
  });
};

run();
