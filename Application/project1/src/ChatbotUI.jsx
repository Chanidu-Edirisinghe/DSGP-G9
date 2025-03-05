import { useState, useEffect, useRef } from "react";
import "./ChatbotUI.css";

export default function ChatbotUI() {
  const [messages, setMessages] = useState([
    {
      text: "Hello! How can I help you today? I can help you in getting your diabetic status classified.",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openChat = () => {
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsClosing(true);
    // Wait for animation to complete before hiding the component
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 500); // Match this timing with CSS transition duration
  };

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
    <>
      {/* Chat Icon Button */}
      <div className={`chat-icon ${isOpen ? "hidden" : ""}`} onClick={openChat}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>

      {/* Chat Container */}
      {isOpen && (
        <div className={`chat-container ${isClosing ? "closing" : "opening"}`}>
          <div className="chat-header">
            <h1 className="chat-heading">Medical Chatbot</h1>
            <button className="close-button" onClick={closeChat}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div className={`message-card ${msg.sender}`}>{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
