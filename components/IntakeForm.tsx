import React, { useState, useCallback } from 'react';
import Input from './Input';
import Button from './Button';
import Card from './Card';
import { IntakeFormData } from '../types';

const IntakeForm: React.FC = () => {
  const initialFormState = {
    monthlyJobsInvoices: 0,
    avgDaysJobToInvoice: 0,
    avgDaysInvoiceToPayment: 0,
    staffAdminTimeMonthly: 0,
    mainSoftwareTechStack: '',
    decisionMakerThreshold: 0,
  };

  const [formData, setFormData] = useState<Omit<IntakeFormData, 'id' | 'submissionDate'>>(initialFormState);
  const [submissions, setSubmissions] = useState<IntakeFormData[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: e.target.type === 'number' ? parseFloat(value) || 0 : value,
    }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const newSubmission: IntakeFormData = {
      id: Date.now().toString(),
      ...formData,
      submissionDate: new Date(),
    };
    setSubmissions((prev) => [...prev, newSubmission]);
    setFormData(initialFormState); // Reset form
    setMessage('Form submitted successfully and data sent to CRM (simulated)!');
    console.log('Intake Form Submission:', newSubmission);
    console.log('Simulating sending Intake Form data to CRM:', newSubmission); // Simulate auto-email/logging and CRM push
    setTimeout(() => setMessage(null), 3000);
  }, [formData, initialFormState]);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Smart Discovery Intake Form</h2>
      <Card className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Prospect Information</h3>
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              id="monthlyJobsInvoices"
              label="Monthly Invoices/Jobs Processed"
              type="number"
              value={formData.monthlyJobsInvoices}
              onChange={handleChange}
              min="0"
            />
            <Input
              id="avgDaysJobToInvoice"
              label="Average Days Job-to-Invoice"
              type="number"
              value={formData.avgDaysJobToInvoice}
              onChange={handleChange}
              min="0"
            />
            <Input
              id="avgDaysInvoiceToPayment"
              label="Average Days Invoice-to-Payment"
              type="number"
              value={formData.avgDaysInvoiceToPayment}
              onChange={handleChange}
              min="0"
            />
            <Input
              id="staffAdminTimeMonthly"
              label="Staff/Admin Time Spent Monthly (hours)"
              type="number"
              value={formData.staffAdminTimeMonthly}
              onChange={handleChange}
              min="0"
            />
            <div className="md:col-span-2 mb-4">
              <label htmlFor="mainSoftwareTechStack" className="block text-sm font-medium text-gray-700 mb-1">
                Main Software/Tech Stack Used
              </label>
              <textarea
                id="mainSoftwareTechStack"
                rows={3}
                value={formData.mainSoftwareTechStack}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., QuickBooks, Salesforce, custom ERP..."
              />
            </div>
            <Input
              id="decisionMakerThreshold"
              label="Decision-Maker Approval Threshold ($)"
              type="number"
              value={formData.decisionMakerThreshold}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
          <Button type="submit" variant="primary" size="lg" className="mt-8">
            Submit Discovery Form and Send to CRM
          </Button>
        </form>
      </Card>

      {submissions.length > 0 && (
        <Card>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Submissions (Simulated CRM Leads)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Monthly Jobs</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Job-to-Invoice (Days)</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Invoice-to-Payment (Days)</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Admin Time (Hrs)</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Tech Stack</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Approval Threshold ($)</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td className="px-4 py-2 border-b border-gray-200 text-sm">
                      {submission.submissionDate.toLocaleDateString()} {submission.submissionDate.toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200 text-sm">{submission.monthlyJobsInvoices}</td>
                    <td className="px-4 py-2 border-b border-gray-200 text-sm">{submission.avgDaysJobToInvoice}</td>
                    <td className="px-4 py-2 border-b border-gray-200 text-sm">{submission.avgDaysInvoiceToPayment}</td>
                    <td className="px-4 py-2 border-b border-gray-200 text-sm">{submission.staffAdminTimeMonthly}</td>
                    <td className="px-4 py-2 border-b border-gray-200 text-sm truncate max-w-xs">{submission.mainSoftwareTechStack}</td>
                    <td className="px-4 py-2 border-b border-gray-200 text-sm">${submission.decisionMakerThreshold.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default IntakeForm;