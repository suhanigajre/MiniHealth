document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const currentUserId = Number(localStorage.getItem("userId"));
  const role = localStorage.getItem("role");

  const contactSelect = document.getElementById("contactSelect");
  const loadChatBtn = document.getElementById("loadChatBtn");
  const chatBox = document.getElementById("chatBox");
  const messageInput = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");

  let activeReceiverId = null;

  if (!token || !currentUserId || !role) {
    alert("Please login first.");
    window.location.href = "./login.html";
    return;
  }

  async function loadContacts(selectedId = null) {
    const data = await apiRequest("/messages/contacts/list");

    if (!data.success || !data.contacts || data.contacts.length === 0) {
      contactSelect.innerHTML = `<option value="">No contacts found</option>`;
      return;
    }

    contactSelect.innerHTML = data.contacts
      .map((c) => {
        const unread = Number(c.unread_count) || 0;

        return `
          <option value="${c.id}">
            ${c.name} (${c.role}) ${unread > 0 ? `🔴 ${unread} new` : ""}
          </option>
        `;
      })
      .join("");

    if (selectedId) {
      contactSelect.value = selectedId;
    }
  }

  async function loadMessages() {
    const receiverId = contactSelect.value;

    if (!receiverId) {
      alert("Select a contact first");
      return;
    }

    activeReceiverId = receiverId;
    chatBox.innerHTML = "<p>Loading messages...</p>";

    const data = await apiRequest(`/messages/${receiverId}`);

    if (!data.success) {
      chatBox.innerHTML = `<p>${data.message || "Failed to load messages"}</p>`;
      return;
    }

    if (!data.messages || data.messages.length === 0) {
      chatBox.innerHTML = "<p>No messages yet. Start conversation.</p>";
      await loadContacts(receiverId);
      return;
    }

    chatBox.innerHTML = data.messages
      .map((msg) => {
        const isSentByMe = Number(msg.sender_id) === currentUserId;

        return `
          <div class="message ${isSentByMe ? "sent" : "received"}">
            ${msg.message}
            <small>${new Date(msg.sent_at).toLocaleString()}</small>
          </div>
        `;
      })
      .join("");

    chatBox.scrollTop = chatBox.scrollHeight;

    // refresh unread badge after opening chat
    await loadContacts(receiverId);
  }

  async function sendMessage() {
    const message = messageInput.value.trim();

    if (!activeReceiverId) {
      alert("Open a chat first.");
      return;
    }

    if (!message) return;

    const data = await apiRequest("/messages", "POST", {
      receiver_id: activeReceiverId,
      message,
    });

    if (!data.success) {
      alert(data.message || "Failed to send message");
      return;
    }

    messageInput.value = "";
    await loadMessages();
  }

  loadChatBtn.addEventListener("click", loadMessages);
  sendBtn.addEventListener("click", sendMessage);

  contactSelect.addEventListener("change", () => {
    activeReceiverId = null;
    chatBox.innerHTML = "<p>Click Open Chat to view messages.</p>";
  });

  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // refresh contacts every 10 seconds for notification update
  setInterval(() => {
    loadContacts(activeReceiverId);
  }, 10000);

  loadContacts();
});