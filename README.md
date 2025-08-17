# Scalable Chat Messaging System

This project demonstrates a **scalable real-time chat system** using **Socket.IO**, **Redis**, **Kafka**, and **PostgreSQL**.

## Problem
When multiple servers are in an auto-scaling group (e.g., Server 1 with users u1, u2, u3 and Server 2 with user u4), direct message delivery becomes difficult since users may be connected to different servers.  
Also, as the number of users and messages increases, writing every message directly to the database becomes inefficient, causing **high write load** and performance issues.

## Solution
- Use **Socket.IO** for real-time communication.
- Use **Redis Pub/Sub** to instantly deliver messages across multiple servers.
- Use **Kafka** as a message broker to handle high message throughput.
- Consumers read from Kafka and perform batched writes to **PostgreSQL**, reducing DB load.

## Tech Stack
- **Socket.IO** → Real-time communication  
- **Redis** → Pub/Sub for cross-server message delivery  
- **Kafka** → Message broker for scalability  
- **PostgreSQL** → Persistent storage  

## Architecture
User → Redis → Kafka → Consumer → Database

## Benefits
- Handles high message throughput.
- Prevents database overload.
- Supports horizontal scaling of consumers.