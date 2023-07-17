import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import React from "react";

const YearChart = (props) => {
  return (
    <LineChart width={1030} height={250} data={props.data}>
      <XAxis dataKey="time" />
      <YAxis type="number" />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="price"
        stroke="#4be93b"
        dot={false}
        strokeWidth={2}
      />
    </LineChart>
  );
};

export default YearChart;
