import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useTable } from 'react-table';
import { useMemo } from 'react';
import LoadingSpinner from '../../utils/LoadingSpinner';
import Error from '../../utils/Error';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const TimeFilterView = ({ timeUnit, timeValue, data, loading, error }) => {
    console.log("data in TimeFilterView", data);
  if (loading) {
    return (
      <LoadingSpinner/>
    );
  }

  if (error) {
    return (
   <Error error={error}/>
    );
  }

  if (!data || !data.byApp) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-blue-50 border-l-4 border-blue-500 p-4"
      >
        <p className="text-blue-700">No data available for this period</p>
      </motion.div>
    );
  }

  // Calculate statistics - safely handle undefined data
  const stats = {
    totalHours: data?.totalDuration ? (data.totalDuration / 3600).toFixed(2) : 0,
    appCount: data?.byApp ? Object.keys(data.byApp).length : 0,
    sessionCount: data?.byApp ? Object.values(data.byApp).reduce(
      (sum, app) => sum + (app?.sessions?.length || 0), 0
    ) : 0
  };

    // Prepare data for charts with null checks
    const pieData = data?.byApp ? Object.entries(data.byApp).map(([name, appData]) => ({
        name,
        value: appData?.totalDuration ? appData.totalDuration / 60 : 0,
        percentage: data?.totalDuration ? (appData.totalDuration / data.totalDuration) * 100 : 0
      })) : [];

 
      const barData = data?.byApp ? Object.entries(data.byApp).map(([name, appData]) => ({
        name,
        minutes: appData?.totalDuration ? appData.totalDuration / 60 : 0,
        hours: appData?.totalDuration ? appData.totalDuration / 3600 : 0,
        sessions: appData?.sessions ? appData.sessions.length : 0
      })) : [];


  // Prepare data for React Table
  const sessionColumns = useMemo(() => [
    { Header: 'Title', accessor: 'title' },
    { Header: 'Start Time', accessor: 'startTime', Cell: ({ value }) => new Date(value).toLocaleTimeString() },
    { Header: 'End Time', accessor: 'endTime', Cell: ({ value }) => new Date(value).toLocaleTimeString() },
    { Header: 'Duration (min)', accessor: 'duration', Cell: ({ value }) => (value / 60).toFixed(2) },
    { Header: 'Date', accessor: 'date' }
  ], []);

   const sessionData = useMemo(() => 
    data?.byApp ? Object.values(data.byApp).flatMap(
      appData => appData?.sessions || []
    ) : [], 
    [data?.byApp]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns: sessionColumns, data: sessionData });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          label="Period" 
          value={`${timeUnit}: ${timeValue}`} 
          icon={
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard 
          label="Total Hours" 
          value={stats.totalHours} 
          unit="h"
          icon={
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard 
          label="Apps Used" 
          value={stats.appCount}
          icon={
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          }
        />
        <StatCard 
          label="Sessions" 
          value={stats.sessionCount}
          icon={
            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-4 rounded-lg shadow border border-gray-100"
        >
          <h3 className="text-lg font-semibold mb-4">App Usage Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} minutes`, 'Duration']} />
                  <Legend/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-4 rounded-lg shadow border border-gray-100"
        >
          <h3 className="text-lg font-semibold mb-4">App Usage Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} minutes`, 'Duration']} />
                <Bar dataKey="minutes" fill="#8884d8" name="Minutes" />
                <Legend/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* App Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">App Details</h3>
        {Object.entries(data.byApp).map(([app, appData]) => (
          <motion.div 
            key={app}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-4 rounded-lg shadow border border-gray-100"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-800">{app}</h4>
              <p className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {(appData.totalDuration / 60).toFixed(2)} minutes
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Start</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">End</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appData.sessions.map((session, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{session.title}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {new Date(session.startTime).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {new Date(session.endTime).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">
                        {(session.duration / 60).toFixed(2)}m
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ))}
      </div>

      {/* All Sessions Table */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">All Sessions</h3>
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps()}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
              {rows.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <td
                        {...cell.getCellProps()}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ label, value, unit, icon }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white p-4 rounded-lg shadow border border-gray-100"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-semibold">
          {value} {unit && <span className="text-sm">{unit}</span>}
        </p>
      </div>
      {icon && (
        <div className="p-2 rounded-full bg-opacity-20">
          {icon}
        </div>
      )}
    </div>
  </motion.div>
);

export default TimeFilterView;