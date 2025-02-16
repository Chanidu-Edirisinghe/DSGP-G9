import { useState } from "react";
import "./ChatbotUI.css";

export default function ChatbotUI() {
  const [messages, setMessages] = useState([
    {
      text: "Hello! How can I help you today? I can help you in getting your diabetic status classified.",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await fetch(
        "http://localhost:5005/webhooks/rest/webhook",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        }
      );

      const botResponses = await response.json();
      const newMessages = botResponses.map((res) => ({
        text: res.text,
        sender: "bot",
      }));
      setMessages((prev) => [...prev, ...newMessages]);
    } catch (error) {
      console.error("Error communicating with Rasa:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error connecting to chatbot.", sender: "bot" },
      ]);
    }
  };

  return (
    <div className="chat-container">
      <h1 className="chat-heading">Medical Chatbot</h1>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <div className={`message-card ${msg.sender}`}>{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="input-field"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
}
