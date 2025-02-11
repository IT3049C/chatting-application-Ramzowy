
const nameInput = document.getElementById("my-name-input");
const myMessage = document.getElementById("my-message");
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat");

const serverURL = `https://it3049c-chat.fly.dev/messages`;

// Format message for display
function formatMessage(message, myName) {
  const time = new Date(message.timestamp);
  const formattedTime = `${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}`;

  if (myName === message.sender) {
    return `
      <div class="mine messages">
        <div class="message">
          ${message.text}
        </div>
        <div class="sender-info">
          ${formattedTime}
        </div>
      </div>
    `;
  } else {
    return `
      <div class="yours messages">
        <div class="message">
          ${message.text}
        </div>
        <div class="sender-info">
          ${message.sender} ${formattedTime}
        </div>
      </div>
    `;
  }
}

// Fetch messages from the server
async function fetchMessages() {
  try {
    const response = await fetch(serverURL);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return [];
  }
}

// Update messages in the chat
async function updateMessages() {
  const messages = await fetchMessages();
  chatBox.innerHTML = ""; // Clear chat box before appending messages
  messages.forEach(message => {
    chatBox.innerHTML += formatMessage(message, nameInput.value);
  });
}

// Send message to the server
async function sendMessages(username, text) {
  const newMessage = {
    sender: username,
    text: text,
    timestamp: new Date().toISOString() // Store timestamp in ISO format
  };

  try {
    const response = await fetch(serverURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newMessage)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // After sending a message, update chat
    updateMessages();
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}

// Event listener for send button
sendButton.addEventListener("click", function (event) {
  event.preventDefault();
  const sender = nameInput.value.trim();
  const message = myMessage.value.trim();

  if (sender === "" || message === "") {
    alert("Name and message cannot be empty!");
    return;
  }

  sendMessages(sender, message);
  myMessage.value = ""; // Clear input field after sending
});

// Automatically update messages every 10 seconds
const MILLISECONDS_IN_TEN_SECONDS = 10000;
setInterval(updateMessages, MILLISECONDS_IN_TEN_SECONDS);

// Initial message load when the page opens
updateMessages();