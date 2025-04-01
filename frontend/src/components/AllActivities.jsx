import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllActivties } from "../store/apiSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useTable } from "react-table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../utils/LoadingSpinner";
import Error from "../utils/Error";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AllActivities = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Redux state
  const {
    data: activitiesData = [],
    total,
    page,
    totalpages
  } = useSelector((state) => state.api?.all || {});

  const loading = useSelector((state) => state.api?.loading?.all || false);
  const error = useSelector((state) => state.api?.error?.all || null);

  // Fetch data when page changes
  useEffect(() => {
    dispatch(fetchAllActivties({ page: currentPage, limit: pageSize }));
  }, [dispatch, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalpages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const chartData = useMemo(() => {
    return activitiesData.map((activity) => ({
      name: activity.title,
      time: (activity.duration || activity.timeSpent) / 60, // Convert to minutes
      date: new Date(activity.date).toLocaleDateString(),
    }));
  }, [activitiesData]);

  const columns = useMemo(
    () => [
      { 
        Header: "App", 
        accessor: "app",
        Cell: ({ value }) => <span className="font-medium">{value}</span>
      },
      { 
        Header: "Title", 
        accessor: "title",
        Cell: ({ value }) => (
          <div className="max-w-xs truncate" title={value}>
            {value}
          </div>
        )
      },
      {
        Header: "Time Spent (min)",
        accessor: "duration",
        Cell: ({ value }) => (
          <span className="font-semibold">{(value / 60).toFixed(1)}</span>
        ),
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: ({ value }) => (
          <div className="text-gray-600">
            {new Date(value).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: activitiesData,
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4 md:p-6"
    >
      <motion.div
        className="text-center mb-8"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-indigo-700">
          Activity Dashboard
        </h1>
        <p className="text-gray-600">
          Track and visualize your digital activities
        </p>
      </motion.div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && <Error error={error} />}

      <AnimatePresence>
        {!loading && !error && (
          <>
            <motion.div
              className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-lg p-6 mb-8 border border-indigo-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 md:mb-0">
                  Time Spent by Application
                </h2>
                <div className="text-sm text-gray-500 bg-indigo-100 px-3 py-1 rounded-full">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        value.length > 10 ? `${value.slice(0, 10)}...` : value
                      }
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      label={{
                        value: "Minutes",
                        angle: -90,
                        position: "insideLeft",
                        fontSize: 14,
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        border: 'none'
                      }}
                      formatter={(value) => [`${value.toFixed(1)} minutes`, "Time Spent"]}
                      labelFormatter={(label) => `Activity: ${label}`}
                    />
                    <Bar dataKey="time">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
                <h2 className="text-xl font-semibold text-gray-800">
                  Activity Log
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Detailed view of your digital activities
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table
                  {...getTableProps()}
                  className="min-w-full divide-y divide-gray-200"
                >
                  <thead className="bg-gray-50">
                    {headerGroups.map((headerGroup, i) => {
                      const { key, ...restHeaderGroupProps } =
                        headerGroup.getHeaderGroupProps();
                      return (
                        <tr key={`header-group-${i}`} {...restHeaderGroupProps}>
                          {headerGroup.headers.map((column, j) => {
                            const { key: headerKey, ...restHeaderProps } =
                              column.getHeaderProps();
                            return (
                              <th
                                key={`header-${i}-${j}`}
                                {...restHeaderProps}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                              >
                                <div className="flex items-center">
                                  {column.render("Header")}
                                </div>
                              </th>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </thead>
                  <tbody
                    {...getTableBodyProps()}
                    className="bg-white divide-y divide-gray-200"
                  >
                    {rows.map((row, k) => {
                      prepareRow(row);
                      const { key, ...restRowProps } = row.getRowProps();
                      return (
                        <motion.tr
                          key={`row-${k}`}
                          {...restRowProps}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ backgroundColor: "rgba(79, 70, 229, 0.03)" }}
                          className="hover:bg-indigo-50/50"
                        >
                          {row.cells.map((cell, l) => {
                            const { key: cellKey, ...restCellProps } =
                              cell.getCellProps();
                            return (
                              <td
                                key={`cell-${k}-${l}`}
                                {...restCellProps}
                                className="px-6 py-4 whitespace-nowrap text-sm"
                              >
                                {cell.render("Cell")}
                              </td>
                            );
                          })}
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <Pagination
                  currentPage={currentPage}
                  totalpages={totalpages}
                  totalItems={total}
                  onPageChange={handlePageChange}
                  isLoading={loading}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AllActivities;