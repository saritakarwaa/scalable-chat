"use client"
import React, { useCallback,useContext,useEffect, useState } from "react"
import { io,Socket } from "socket.io-client"

interface SocketProviderProps{
    children?:React.ReactNode
}
interface ChatMessage {
  text: string;
  createdAt: string; // ISO string from backend
}
interface ISocketContext{
    sendMessage:(msg:string)=>any
    messages:ChatMessage[]
}


const SocketContext=React.createContext<ISocketContext | null>(null)

export const useSocket=()=>{
    const state=useContext(SocketContext)
    if(!state) throw new Error(`state is undefined`)
    return state
}
export const SocketProvider:React.FC<SocketProviderProps>=({children})=>{
    const [socket,setSocket]=useState<Socket>()
    const [messages,setMessages]=useState<ChatMessage[]>([])

    const sendMessage:ISocketContext['sendMessage']=useCallback((msg)=>{
        console.log("Send message",msg)
        if(socket){
            socket.emit('event:message',{message:msg})
        }
    },[socket])
    const onMessageReceived=useCallback((msg:string)=>{
        console.log('From server msg received',msg)
        const {message,createdAt}=JSON.parse(msg) as {message:string, createdAt:string}
        setMessages((prev)=>[...prev,{text:message,createdAt}])
    },[])
    useEffect(() => {
      const _socket=io('http://localhost:8000')
      _socket.on('message',onMessageReceived)
        setSocket(_socket)
      return () => {
        _socket.disconnect()
        _socket.off('message',onMessageReceived)
        setSocket(undefined)
      }
    }, [])
    
    return (
        <SocketContext.Provider value={{sendMessage,messages}}>
            {children}
        </SocketContext.Provider>
    )
}