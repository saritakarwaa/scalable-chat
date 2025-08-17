import {Server} from 'socket.io'
import Redis from "ioredis";
import prismaClient from './prisma.js';
import { produceMessage } from './kafka.js';

//@ts-ignore
const pub = new Redis({ host: "127.0.0.1", port: 6379 });
//@ts-ignore
const sub = new Redis({ host: "127.0.0.1", port: 6379 });


class SocketService{
    private _io:Server
    constructor(){
        console.log('init socket service')
        this._io=new Server({
            cors:{
                allowedHeaders:['*'],
                origin:'*',
            }
        })
        sub.subscribe('MESSAGES')
    }
    public initListeners(){
        const io=this.io
        console.log('init socket listeners')
        io.on('connect',(socket)=>{
            console.log(`New Socket connected`,socket.id)
            socket.on('event:message',async({message}:{message:string})=>{
                console.log('New message recieved',message)
                //publish this msg to redis
                await pub.publish('MESSAGES',JSON.stringify({message}))

            })
        })
        sub.on('message',async (channel:any,message:any)=>{
            if(channel==='MESSAGES'){
                io.emit("message",message)
                // await prismaClient.message.create({
                //     data:{
                //         text:message,
                //     }
                // })
                await produceMessage(message)
                console.log("Message produced to kafka broker")
            }
        })
        
    }
    get io(){
        return this._io;
    }
}
export default SocketService