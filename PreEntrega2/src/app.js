import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import fs from "fs";
import path from "path";

const app = express();
const messagesFile = path.join("./managers/data/messages.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const PORT = 8080;

app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("index");
});

const httpServer = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

const readMessages = () => {
  try {
    if (fs.existsSync(messagesFile)) {
      const data = fs.readFileSync(messagesFile, 'utf8');
      return JSON.parse(data);
    } else {
      return [];
    }
  } catch (err) {
    console.error("Error al leer el historial de mensajes", err);
    return [];
  }
}

const saveMessages = (messages) => {
  try {
    const dir = path.dirname(messagesFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf8');
  } catch (err) {
    console.error("Error guardando los mensajes", err);
  }
}

let messages = readMessages();
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado con el id ${socket.id}`);

  socket.emit("messageLogs", messages);

  socket.on("newUser", (data) => {
    socket.broadcast.emit("newUser", data);
  });

  socket.on("message", (data) => {
    messages.push(data);
    saveMessages(messages);
    io.emit("messageLogs", messages);
  });
});
