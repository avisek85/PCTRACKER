import React from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiFilter } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Welcome to TimeTracker
        </h1>
        <p className="mt-3 text-xl text-gray-500">
          Track your digital activities and optimize your productivity
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <FiActivity className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <h3 className="text-lg font-medium text-gray-900">All Activities</h3>
                <p className="mt-1 text-sm text-gray-500">
                  View all your tracked activities with detailed analytics
                </p>
                <div className="mt-4">
                  <Link
                    to="/activities"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                  >
                    View Activities
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <FiFilter className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <h3 className="text-lg font-medium text-gray-900">Filter Activities</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Filter your activities by date, duration, or app
                </p>
                <div className="mt-4">
                  <Link
                    to="/filters"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
                  >
                    Apply Filters
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            About TimeTracker
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              TimeTracker helps you understand how you spend your digital time. Our
              dashboard provides insights into your activity patterns, helping you
              identify productivity opportunities.
            </p>
          </div>
          <div className="mt-5">
            <Link
              to="/activities"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;