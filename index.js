const express = require("express")
const http = require("http");
const cors = require("cors");
const path = require("path")
const app = express()
const server = http.createServer(app);


app.use(cors());

app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*", function (req, res) {
	res.sendFile(path.join(__dirname + "/frontend/build/index.html"));
  });
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: [ "GET", "POST" ]
	}
})

io.on("connection", (socket) => {
	socket.emit("me", socket.id)

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})

server.listen(5000, () => console.log("server is running on port 5000"))
