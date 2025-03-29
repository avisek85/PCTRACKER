import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivities } from "../store/apiSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.api);

  useEffect(() => {
    dispatch(fetchActivities());  // Fetch data on mount
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Activity Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data && data.map((item, index) => (
          <div key={index} className="bg-white shadow p-4 rounded-lg">
            <p><strong>App:</strong> {item.app}</p>
            <p><strong>Title:</strong> {item.title}</p>
            <p><strong>Duration:</strong> {item.duration} seconds</p>
            <p><strong>Date:</strong> {item.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
