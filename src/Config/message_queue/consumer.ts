import amqp from "amqplib";

const queue = "product_inventory";

export const consumer = async () => {
    try {
        const connection = await amqp.connect("amqps://cfqdaudg:4JgurWDOPBJdB3VMEusAfs_eWpoxXqgq@jaragua.lmq.cloudamqp.com/cfqdaudg");
        const channel = await connection.createChannel();

        process.once("SIGINT", async () => {
            await channel.close();
            await connection.close();
        });

        await channel.assertQueue(queue, { durable: false });
        await channel.consume(
            queue,
            (message) => {
                if (message) {
                    console.log(
                        " [x] Received '%s'",
                        JSON.parse(message.content.toString())
                    );
                }
            },
            { noAck: true }
        );

        console.log(" [*] Waiting for messages. To exit press CTRL+C");
    } catch (err) {
        console.warn(err);
    }
};