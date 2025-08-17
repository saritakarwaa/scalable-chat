import { Kafka, Producer } from "kafkajs";
import prismaClient from "./prisma.js";

const kafka = new Kafka({
  brokers: ["localhost:9092"], 
});

let producer: Producer | null = null;

export async function createProducer() {
  if (producer) return producer;

  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
}

export async function produceMessage(message: string) {
  const producer = await createProducer();
  await producer.send({
    topic: "MESSAGES", 
    messages: [{ key: `message-${Date.now()}`, value: message }],
  });
  return true;
}

export async function startMessageConsumer(){
    console.log('Consumer is running')
    const consumer=await kafka.consumer({groupId:"default"})
    await consumer.connect()
    await consumer.subscribe({topic:"MESSAGES",fromBeginning:true})
    await consumer.run({
        autoCommit:true,
        eachMessage:async ({message,pause})=>{
            console.log(`New msg recieved`)
            if(!message.value) return
           try{
             await prismaClient.message.create({
                data:{
                    text:message.value?.toString()
                }
            })
           }
           catch(err){
            console.log("something is wrong")
            pause()
            setTimeout(()=>{consumer.resume([{topic:'MESSAGES'}])},60*1000)
           }
        }
    })
}

export default kafka;
