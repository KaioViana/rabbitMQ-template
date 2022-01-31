import amqp from 'amqplib'

async function connectToRabbitMQ(uri) {
  const conn = await amqp.connect(uri, (err, connection) => {
    if(err) {
      throw err
    }

    return connection
  })

  const channel = await conn.createConfirmChannel((error, chann) => {
    if (error) {
      throw Error(`Error to create channel: ${error}`)
    }

    return chann
  })

  return {
    conn,
    channel
  }
}

export { connectToRabbitMQ }
