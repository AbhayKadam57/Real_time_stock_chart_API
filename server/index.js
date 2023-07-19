const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const axios = require("axios");

const moment = require("moment");
const PORT = process.env.PORT || 4000;

const app = express();

app.use(
  cors({
    origin: [`${process.env.DEVELOPMENT_LINK}`],
  })
);

const server = app.listen(PORT, () => {
  console.log("Server is started at " + PORT);
});

const io = socketio(server, {
  pingInterval: 25000, // Send a ping every 25 seconds
  pingTimeout: 5000, // Consider the connection closed if no pong is received within 5 seconds
});

io.on("connection", (socket) => {
  console.log("New Connection:" + socket.id);

  socket.on("join", async (data) => {
    try {
      const urls = [
        `https://my-stock-api.onrender.com/one-day-hist/${data}`,
        `https://my-stock-api.onrender.com/one-week-hist/${data}`,
        `https://my-stock-api.onrender.com/one-month-hist/${data}`,
        `https://my-stock-api.onrender.com/one-year-hist/${data}`,
        `https://my-stock-api.onrender.com/three-year-hist/${data}`,
        `https://my-stock-api.onrender.com/five-year-hist/${data}`,
      ];

      const list = [];

      for (let url of urls) {
        console.log(url);
        const res = await axios.get(url);
        list.push(res.data);
      }

      await io.to(socket.id).emit("join", list);
    } catch (e) {
      console.log(e);
    }
  });
  socket.on("update", async (data) => {
    try {
      const res = await axios.get(
        `https://my-stock-api.onrender.com/one-week-hist/${data}`
      );
      const responseData = res.data;
      io.to(socket.id).emit("update", responseData);
    } catch (e) {
      console.log(e);
    }
  });
  socket.on("month", async (data) => {
    try {
      const res = await axios.get(
        `https://my-stock-api.onrender.com/one-month-hist/${data}`
      );
      const responseData = res.data;
      io.to(socket.id).emit("month", responseData);
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("started", async (data) => {
    if (isWithinMarketLimit()) {
      try {
        const res = await axios.get(
          `https://my-stock-api.onrender.com/one-day-hist/${data}`
        );
        const responseData = res.data;
        const lastPair =
          Object.entries(responseData)[Object.entries(responseData).length - 1];
        console.log(lastPair);

        await io.to(socket.id).emit("started", lastPair);
      } catch (error) {
        console.error("An error occurred during the interval request:", error);
      }
    }
  });

  socket.on("oneweek", async (data) => {
    if (isWithinMarketLimit()) {
      try {
        const res = await axios.get(
          `https://my-stock-api.onrender.com/one-week-hist/${data}`
        );
        const responseData = res.data;
        const lastPair =
          Object.entries(responseData)[Object.entries(responseData).length - 1];

        await io.to(socket.id).emit("oneweek", lastPair);
      } catch (error) {
        console.error("An error occurred during the interval request:", error);
      }
    }
  });

  socket.on("onemonth", async (data) => {
    if (isWithinMarketLimit()) {
      try {
        const res = await axios.get(
          `https://my-stock-api.onrender.com/one-month-hist/${data}`
        );
        const responseData = res.data;
        const lastPair =
          Object.entries(responseData)[Object.entries(responseData).length - 1];

        await io.to(socket.id).emit("onemonth", lastPair);
        console.log("successfull");
      } catch (error) {
        console.error("An error occurred during the interval request:", error);
      }
    }
  });
});

function isWithinMarketLimit() {
  const now = moment();
  const start = moment().set({ hour: 9, minute: 15, second: 0 });
  const end = moment().set({ hour: 15, minute: 30, second: 0 });

  return now.isBetween(start, end);
}
