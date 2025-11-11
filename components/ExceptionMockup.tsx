import React, { useState, useCallback } from 'react';
import { ExceptionItem } from '../types';
import { INITIAL_EXCEPTION_ITEMS } from '../constants';
import Button from './Button';
import Card from './Card';

const ExceptionMockup: React.FC = () => {
  const [exceptions, setExceptions] = useState<ExceptionItem[]>(INITIAL_EXCEPTION_ITEMS);

  const toggleStatus = useCallback((id: string) => {
    setExceptions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: item.status === 'Open' ? 'Resolved' : 'Open' } : item
      )
    );
  }, []);

  const getDailyDigest = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    const recentOpenExceptions = exceptions.filter(
      (item) => item.status === 'Open' && item.date >= today
    );
    const resolvedToday = exceptions.filter(
      (item) => item.status === 'Resolved' && item.date >= today
    );

    return { recentOpen: recentOpenExceptions, resolvedToday };
  }, [exceptions]);

  const { recentOpen, resolvedToday } = getDailyDigest();

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Basic Exception Workflow & Digest Mockup</h2>

      <Card className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Daily / Weekly Exception Digest</h3>
        <p className="text-gray-700 mb-4">
          This section visualizes how automation "exceptions" (e.g., missed jobs, AP/AR issues) could be tracked and summarized for a daily or weekly digest email.
        </p>

        <div className="mb-6">
          <h4 className="text-lg font-semibold text-red-600 mb-2">Open Exceptions (Today)</h4>
          {recentOpen.length > 0 ? (
            <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
              {recentOpen.map((item) => (
                <li key={item.id}>
                  <strong>{item.type}:</strong> {item.description} (Logged: {item.date.toLocaleTimeString()})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 ml-4">No new open exceptions today. Good job!</p>
          )}
        </div>

        <div>
          <h4 className="text-lg font-semibold text-green-600 mb-2">Resolved Exceptions (Today)</h4>
          {resolvedToday.length > 0 ? (
            <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
              {resolvedToday.map((item) => (
                <li key={item.id}>
                  <strong>{item.type}:</strong> {item.description} (Resolved: {item.date.toLocaleTimeString()})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 ml-4">No exceptions resolved today.</p>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">All Exceptions Log</h3>
        {exceptions.length === 0 ? (
          <p className="text-gray-600">No exceptions logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Type</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Description</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {exceptions.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 border-b border-gray-200 text-sm">
                      {item.date.toLocaleDateString()} {item.date.toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200 text-sm">{item.type}</td>
                    <td className="px-4 py-2 border-b border-gray-200 text-sm">{item.description}</td>
                    <td className="px-4 py-2 border-b border-gray-200 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'Open'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200 text-sm">
                      <Button
                        onClick={() => toggleStatus(item.id)}
                        variant={item.status === 'Open' ? 'secondary' : 'outline'}
                        size="sm"
                      >
                        {item.status === 'Open' ? 'Mark Resolved' : 'Mark Open'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExceptionMockup;
