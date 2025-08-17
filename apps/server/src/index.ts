import http from "http"
import SocketService from './services/socket.js'
import { startMessageConsumer } from "./services/kafka.js"
async function init() {
    startMessageConsumer()
    const socketService=new SocketService()
    const httpServer=http.createServer()
    const PORT=process.env.PORT ? process.env.PORT : 8000
    socketService.io.attach(httpServer)
    httpServer.listen(PORT,()=>{
        console.log(`HTTP server start at port:${PORT}`)
    })
    socketService.initListeners()
}
init()