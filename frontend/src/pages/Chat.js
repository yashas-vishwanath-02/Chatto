import React, { useEffect, useState } from "react";
import socket from "../socket";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receive-message", (msg) => {
      setChat((prev) => [...prev, { text: msg, from: "other" }]);
    });

    // Optional: Clean up socket listener on unmount
    return () => socket.off("receive-message");
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Emit to server
    socket.emit("send-message", {
      message,
    });

    // Add to local chat
    setChat((prev) => [...prev, { text: message, from: "me" }]);
    setMessage("");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Chat</h2>
      <div style={styles.chatBox}>
        {chat.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.from === "me" ? "flex-end" : "flex-start",
              backgroundColor: msg.from === "me" ? "#dcf8c6" : "#f1f0f0",
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={styles.form}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Send</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "30px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
  },
  chatBox: {
    height: "400px",
    border: "1px solid #ccc",
    padding: "10px",
    overflowY: "scroll",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "10px",
  },
  message: {
    padding: "10px",
    borderRadius: "12px",
    maxWidth: "70%",
  },
  form: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default Chat;
