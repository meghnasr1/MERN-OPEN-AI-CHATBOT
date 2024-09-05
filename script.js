const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");
let userMessage = null;
const API_KEY = "AIzaSyBGs3nl29CNeNCvRetApSpoICDW80liImk";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

const generateAPIResponse = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: {
          text: userMessage,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const apiResponse = data?.candidates[0].content.parts[0].text;
    console.log(apiResponse);
    // Ensure you return the data to use it later
  } catch (error) {
    console.log(error);
  }
};

const showLoadingAnimation = () => {
  const html = `
    <div class="message-content">
      <img src="gemini.svg" alt="Gemini Image" class="avatar">
      <p class="text"></p>
      <div class="loading-indicator">
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
      </div>
    </div>
    <span class="icon material-symbols-rounded">content_copy</span>
  `;

  const incomingMessageDiv = createMessageElement(html, "incoming");
  chatList.appendChild(incomingMessageDiv);
  generateAPIResponse().then((data) => {
    // Update the loading message with the response
    if (data) {
      incomingMessageDiv.querySelector(".text").innerText =
        data.candidates[0].output;
      // Remove loading animation
      incomingMessageDiv.querySelector(".loading-indicator").remove();
    }
  });
};

const handleOutgoingChat = () => {
  userMessage = typingForm.querySelector(".typing-input").value.trim();
  if (!userMessage) return;

  const html = `
    <div class="message-content">
      <img src="user.jpg" alt="User Image" class="avatar">
      <p class="text"></p>
    </div>
  `;

  const outgoingMessageDiv = createMessageElement(html, "outgoing");
  outgoingMessageDiv.querySelector(".text").innerText = userMessage;
  chatList.appendChild(outgoingMessageDiv);

  // Optionally clear the input after sending the message
  typingForm.querySelector(".typing-input").value = "";
};

typingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleOutgoingChat();
  showLoadingAnimation();
});
