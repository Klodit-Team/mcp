import amqplib from "amqplib";
import { DocumentsConfig } from "./config.js";

export async function publishOcrResult(
  config: DocumentsConfig,
  payload: Record<string, unknown>
) {
  const connection = await amqplib.connect(config.rabbitMqUrl);
  const channel = await connection.createChannel();
  try {
    await channel.assertQueue(config.ocrResultsQueue, { durable: true });
    const message = Buffer.from(JSON.stringify(payload));
    channel.sendToQueue(config.ocrResultsQueue, message, { persistent: true });
  } finally {
    await channel.close();
    await connection.close();
  }
}
