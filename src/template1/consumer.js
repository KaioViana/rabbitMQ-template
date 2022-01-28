import amqp from 'amqplib/callback_api.js'
import 'dotenv/config'


// Abrindo conexão
amqp.connect('amqp://admin:123456@localhost:5672', (err, connection) => {
  if(err) {
    throw err
  }

  // Abrindo canal para comunicação
  connection.createChannel((err1, channel) => {
    if(err1) {
      throw err1
    }   

    const queue_name = 'hello'

    // Criando fila
    channel.assertQueue(queue_name, {
      durable: false
    })

    console.log(' [X] Waiting for messages in %s. To exit press CTRL+C', queue_name)


    // Consumindo fila
    channel.consume(queue_name, (msg) => {
      console.log(' [X] Received %s', msg.content.toString())
    })
  })

})