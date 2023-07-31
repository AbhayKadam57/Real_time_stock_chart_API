import React, { useCallback, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import Chart from "./Chart";
import axios from "axios";
import YearChart from "./YearChart";

const socket = io(`${import.meta.env.VITE_BACKEND_API}`, { forceBase64: true });

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  const [list, setList] = useState([]);
  const [week, SetWeek] = useState([]);
  const [Month, setMonth] = useState([]);
  const [year, setyear] = useState([]);
  const [three, setThree] = useState([]);
  const [Five, SetFive] = useState([]);

  const urlParams = new URLSearchParams(window.location.search);

  const stock_symbol = urlParams.get("symbol");
  console.log(stock_symbol);

  const fetch = (data) => {
    for (let [key, value] of Object.entries(data)) {
      setList((prev) => [
        ...prev,
        { time: key, price: parseFloat(value).toFixed(3) },
      ]);
    }
  };

  const fetchWeek = (data) => {
    for (let [key, value] of Object.entries(data)) {
      SetWeek((prev) => [
        ...prev,
        { time: key, price: parseFloat(value).toFixed(3) },
      ]);
    }
  };

  const fetchMonth = (data) => {
    for (let [key, value] of Object.entries(data)) {
      setMonth((prev) => [
        ...prev,
        { time: key, price: parseFloat(value).toFixed(3) },
      ]);
    }
  };

  const fetchYear = (data) => {
    for (let [key, value] of Object.entries(data)) {
      setyear((prev) => [
        ...prev,
        { time: key, price: parseFloat(value).toFixed(3) },
      ]);
    }
  };

  const fetchThree = (data) => {
    for (let [key, value] of Object.entries(data)) {
      setThree((prev) => [
        ...prev,
        { time: key, price: parseFloat(value).toFixed(3) },
      ]);
    }
  };

  const fetchFive = (data) => {
    for (let [key, value] of Object.entries(data)) {
      SetFive((prev) => [
        ...prev,
        { time: key, price: parseFloat(value).toFixed(3) },
      ]);
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(socket.connected);

      socket.emit("join", stock_symbol);
      socket.emit("started", stock_symbol);
      socket.emit("oneweek", stock_symbol);
      socket.emit("onemonth", stock_symbol);
    });

    socket.on("disconnect", () => {
      setIsConnected(socket.connected);
    });

    return () => {
      socket.disconnect(); // Disconnect the socket on component unmount
    };
  }, []);

  useEffect(() => {
    socket.on("started", (data) => {
      setList((prev) => [
        ...prev,
        { time: data[0], price: parseFloat(data[1]).toFixed(3) },
      ]);

      console.log(data[0]);
    });

    socket.on("oneweek", (data) => {
      SetWeek((prev) => [
        ...prev,
        { time: data[0], price: parseFloat(data[1]).toFixed(3) },
      ]);

      console.log(data[0]);
    });

    socket.on("onemonth", (data) => {
      setMonth((prev) => [
        ...prev,
        { time: data[0], price: parseFloat(data[1]).toFixed(3) },
      ]);

      console.log(data[0]);
    });

    // socket.on("update", (data) => {
    //   fetchWeek(data);
    //   console.log(data);
    // });

    // socket.on("month", (data) => {
    //   fetchMonth(data);
    //   console.log(data);
    // });

    socket.on("join", (data) => {
      fetch(data[0]);
      fetchWeek(data[1]);
      fetchMonth(data[2]);
      fetchYear(data[3]);
      fetchThree(data[4]);
      fetchFive(data[5]);

      console.log(data);
    });
  }, []);

  const [currentTable, setCurrentTable] = useState("day");

  return (
    <div>
      <div>
        Status: {isConnected ? "Connected" : "Disconnected"}
        {/* <h1>{list[list.length - 1]?.price}</h1>
        <p>{list[0]?.price - list[list.length - 1]?.price}</p>
        <p>{list[0]?.price}</p> */}
      </div>
      <div>
        <button value="day" onClick={(e) => setCurrentTable(e.target.value)}>
          1D
        </button>
        <button value="week" onClick={(e) => setCurrentTable(e.target.value)}>
          1WK
        </button>
        <button value="month" onClick={(e) => setCurrentTable(e.target.value)}>
          1MO
        </button>
        <button value="oneyr" onClick={(e) => setCurrentTable(e.target.value)}>
          1YR
        </button>
        <button
          value="threeyr"
          onClick={(e) => setCurrentTable(e.target.value)}
        >
          3YR
        </button>
        <button value="fiveyr" onClick={(e) => setCurrentTable(e.target.value)}>
          5YR
        </button>
      </div>

      {currentTable === "day" && <Chart data={list} />}
      {currentTable === "week" && <Chart data={week} />}
      {currentTable === "month" && <Chart data={Month} />}
      {currentTable === "oneyr" && <Chart data={year} />}
      {currentTable === "threeyr" && <Chart data={three} />}
      {currentTable === "fiveyr" && <YearChart data={Five} />}
    </div>
  );
}

export default App;
