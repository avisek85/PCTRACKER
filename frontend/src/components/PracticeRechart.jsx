import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, ComposedChart
} from "recharts";

// Sample data for app usage and productivity score
const data = [
  { day: "Mon", usage: 120, productivity: 75 },
  { day: "Tue", usage: 150, productivity: 80 },
  { day: "Wed", usage: 100, productivity: 70 },
  { day: "Thu", usage: 180, productivity: 85 },
  { day: "Fri", usage: 130, productivity: 90 },
  { day: "Sat", usage: 110, productivity: 65 },
  { day: "Sun", usage: 140, productivity: 75 },
];

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
        <p className="font-bold">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm">
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PracticeRechart = () => {
  return (
    <div className="w-full h-96 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">App Usage & Productivity</h2>

      <Link to="/" className="ml-4 px-6 py-2 bg-white text-blue-500 rounded-lg">
        Go to About
      </Link>
      
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />

          {/* X-Axis → Days of the week */}
          <XAxis dataKey="day" />
          
          {/* Dual Y-Axis */}
          <YAxis yAxisId="left" label={{ value: "Usage (mins)", angle: -90, position: "insideLeft" }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: "Productivity (%)", angle: -90, position: "insideRight" }} />

          <Tooltip content={<CustomTooltip />} />
          
          <Legend />

          {/* Bar Chart for Usage */}
          <Bar yAxisId="left" dataKey="usage" fill="#3b82f6" barSize={40} radius={[10, 10, 0, 0]} animationDuration={1200} />

          {/* Line Chart for Productivity */}
          <Line yAxisId="right" type="monotone" dataKey="productivity" stroke="#f97316" strokeWidth={3} dot={{ r: 6 }} animationDuration={1500} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PracticeRechart;
