const socket = io();

// PRODUCTOS
// Actualizar lista
function updateProducts(products) {
  const ul = document.querySelector("ul");
  ul.innerHTML = '';

  products.forEach(product => {
    const li = document.createElement('li');
    li.textContent = product.title;
    li.className = "real-time-item";
    ul.appendChild(li);
  });
};

// Recibir productos
socket.on("products", products => {
  updateProducts(products);
});

// CHAT
let user;
let chatBox = document.querySelector(".input-text");

// Alerta para ingresar el nombre
Swal.fire({
  title: "Welcome",
  text: "Please enter your name",
  input: "text",
  inputValidator: value => {
    if (!value) {
      return `You must complete your name to chat.`;
    };
  },
  allowOutsideClick: false,
  allowEscapeKey: false
}).then(result => {
  user = result.value;
  socket.emit("user", { user, message: "Join the chat." });
});

// Escuchar el input
chatBox.addEventListener("keypress", e => {
  if (e.key === "Enter" && chatBox.value.trim().length > 0) {
    socket.emit("message", { user, message: chatBox.value });
    chatBox.value = "";
  };
});

socket.on("messagesLogs", data => {
  let log = document.querySelector(".chat-message");
  let messages = "";
  data.forEach(message => {
    messages += `<p><strong>${message.user}</strong>: ${message.message}</p>`;
  });
  log.innerHTML = messages;
});