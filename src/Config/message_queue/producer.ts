import amqp from "amqplib";

const queue = "product_inventory";
const text = {
    item_id: "item-7",
    text: "This is a sample message to send receiver to check the ordered Item Availablility",
};

export const producer = async () => {
    let connection;
    try {
        connection = await amqp.connect("amqps://cfqdaudg:4JgurWDOPBJdB3VMEusAfs_eWpoxXqgq@jaragua.lmq.cloudamqp.com/cfqdaudg");
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, { durable: false });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(text)));
        console.log(" [x] Sent '%s'", text);
        await channel.close();
    } catch (err) {
        console.warn(err);
    } finally {
        if (connection) await connection.close();
    }
};