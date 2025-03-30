import { useState, useEffect, useRef } from "react";
import "./ChatbotUI.css";

export default function ChatbotUI() {
  const [messages, setMessages] = useState(() => {
    // Try to get saved messages from sessionStorage on component initialization
    const savedMessages = sessionStorage.getItem("chatbotMessages");
    if (savedMessages) {
      return JSON.parse(savedMessages);
    }
    // Default initial message if no saved messages found
    return [
      {
        text: "Hello! I can help you in getting your diabetic status classified or answer any other diabetic related questions you have.",
        sender: "bot",
      },
    ];
  });

  // Send restart command if there are no saved messages
  useEffect(() => {
    const savedMessages = sessionStorage.getItem("chatbotMessages");
    if (!savedMessages) {
      // Send /restart command to reset the chatbot session
      fetch("http://localhost:5005/webhooks/rest/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "/restart" }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Chatbot session restarted:", data);
        })
        .catch((error) => {
          console.error("Error restarting chatbot session:", error);
        });
    }
  }, []);

  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem("chatbotMessages", JSON.stringify(messages));
  }, [messages]);

  // Check if notification has been shown before in this session
  useEffect(() => {
    const hasSeenNotification = sessionStorage.getItem(
      "hasSeenChatbotNotification"
    );
    if (hasSeenNotification) {
      setShowNotification(false);
    }
  }, []);

  const openChat = () => {
    setIsOpen(true);
    // When chat is opened, hide the notification if it's visible
    if (showNotification) {
      dismissNotification();
    }
  };

  const closeChat = () => {
    setIsClosing(true);
    // Wait for animation to complete before hiding the component
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 500); // Match this timing with CSS transition duration
  };

  const dismissNotification = () => {
    setShowNotification(false);
    // Store in sessionStorage so it doesn't show again in this session
    sessionStorage.setItem("hasSeenChatbotNotification", "true");
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    // Check if input starts with '/' (command prefix)
    if (input.startsWith("/")) {
      // Don't allow slash commands from user input
      setMessages([
        ...messages,
        {
          text: "Sorry, commands starting with '/' are not allowed.",
          sender: "bot",
        },
      ]);
      setInput("");
      return;
    }
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
      console.log(botResponses);
      const newMessages = botResponses.map((res) => ({
        text: res.text
          ? res.text.split("\n").map((line, i) =>
              i === 0 ? (
                line
              ) : (
                <>
                  <br key={i} />
                  {line}
                </>
              )
            )
          : "",
        sender: "bot",
      }));
      setMessages((prev) => [...prev, ...newMessages]);
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
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
          width="40"
          height="40"
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

      {/* Notification Speech Bubble */}
      {showNotification && !isOpen && (
        <div className="chat-notification">
          <div className="notification-content">
            <p>
              Need help? Our AI assistant is here to answer your questions about
              diabetes!
            </p>
            <button
              className="notification-close"
              onClick={dismissNotification}
              aria-label="Close notification"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
          <div className="notification-arrow"></div>
        </div>
      )}

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
          <div className="button-container">
            <button
              className="prediction-button"
              onClick={() => {
                const predictionMessage = "/request_diabetes_prediction";
                setMessages([
                  ...messages,
                  { text: "Predict my diabetes risk.", sender: "user" },
                ]);

                fetch("http://localhost:5005/webhooks/rest/webhook", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ message: predictionMessage }),
                })
                  .then((response) => response.json())
                  .then((botResponses) => {
                    const newMessages = botResponses.map((res) => ({
                      text: res.text
                        ? res.text.split("\n").map((line, i) =>
                            i === 0 ? (
                              line
                            ) : (
                              <>
                                <br key={i} />
                                {line}
                              </>
                            )
                          )
                        : "",
                      sender: "bot",
                    }));
                    setMessages((prev) => [...prev, ...newMessages]);
                  })
                  .catch((error) => {
                    console.error("Error getting prediction:", error);
                    setMessages((prev) => [
                      ...prev,
                      { text: "Error getting prediction.", sender: "bot" },
                    ]);
                  });
              }}
            >
              Get Prediction
            </button>
            <button
              className="question-button"
              onClick={() => {
                const questionMessage = "Ask questions";

                // Add user message
                setMessages([
                  ...messages,
                  { text: questionMessage, sender: "user" },
                ]);

                // Add bot response
                setTimeout(() => {
                  setMessages((prev) => [
                    ...prev,
                    {
                      text: "I can answer any diabetic related questions you have. What would you like to know?",
                      sender: "bot",
                    },
                  ]);
                }, 500);
              }}
            >
              Ask questions
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
