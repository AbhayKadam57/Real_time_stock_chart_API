import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import React from "react";

const Chart = (props) => {
  return (
    <LineChart width={1030} height={250} data={props.data}>
      <XAxis dataKey="time" domain={["auto", "auto"]} />
      <YAxis type="number" domain={["auto", "auto"]} />
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

export default Chart;
