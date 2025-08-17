"use client";
import { useSocket } from "../context/SocketProvider";
import { useState } from "react";
import styles from "./chat.module.css";

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");

  return (
    <div className={styles.wrapper}>
      <div className={styles.chatContainer}>
        <header className={styles.header}>
          <div className={styles.logo}>💬</div>
          <div>
            <h2 className={styles.title}>Chat-astrophe</h2>
          </div>
        </header>

        <div className={styles.messages}>
          {messages.map((m, i) => (
            <div
              key={i}
              className={`${styles.message} ${
                i % 2 === 0 ? styles.sent : styles.received
              }`}
            >
              <p>{m.text}</p>
              <span className={styles.time}> {new Date(m.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}</span>
            </div>
          ))}
        </div>

        <div className={styles.inputArea}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            type="text"
            className={styles.input}
          />
          <button
            onClick={() => sendMessage(message)}
            className={styles.sendButton}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
