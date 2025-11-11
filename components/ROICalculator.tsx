import React, { useState, useCallback } from 'react';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import Card from './Card';
import { Industry, RoiDashboardData } from '../types';
import { AVERAGE_HOURLY_WAGE, DEMO_ROI_DATA, VALUE_PER_DAY_PER_JOB } from '../constants';

const ROICalculator: React.FC = () => {
  const [formData, setFormData] = useState<RoiDashboardData>({
    industry: Industry.Construction,
    monthlyJobsInvoices: 0,
    manualCostPerTask: 0,
    autoCostPerTask: 0,
    hoursSavedPerMonth: 0,
    setupFee: 0,
    // New cash flow related inputs
    avgDaysJobToInvoice: 0,
    avgDaysInvoiceToPayment: 0,
    automatedDaysReduction: 0,
    // Calculated outputs
    monthlySavings: 0,
    paybackMonths: 0,
    monthlyManualCost: 0,
    monthlyAutoCost: 0,
    cashFlowImprovementSavings: 0,
  });

  const calculateROI = useCallback((data: Omit<RoiDashboardData, 'monthlySavings' | 'paybackMonths' | 'monthlyManualCost' | 'monthlyAutoCost' | 'cashFlowImprovementSavings'>): RoiDashboardData => {
    const monthlyManualCost = data.monthlyJobsInvoices * data.manualCostPerTask;
    const monthlyAutoCost = data.monthlyJobsInvoices * data.autoCostPerTask;
    const processSavings = monthlyManualCost - monthlyAutoCost;
    const laborSavings = data.hoursSavedPerMonth * AVERAGE_HOURLY_WAGE;

    // --- New Cash Flow Improvement Calculations ---
    const currentTotalPaymentCycleDays = data.avgDaysJobToInvoice + data.avgDaysInvoiceToPayment;
    // Days reduced cannot exceed the current total cycle days
    const effectiveDaysReduced = Math.min(currentTotalPaymentCycleDays, data.automatedDaysReduction);
    const cashFlowImprovementSavings = effectiveDaysReduced * data.monthlyJobsInvoices * VALUE_PER_DAY_PER_JOB;

    const totalMonthlySavings = processSavings + laborSavings + cashFlowImprovementSavings;

    let paybackMonths = 0;
    if (totalMonthlySavings > 0) {
      paybackMonths = data.setupFee / totalMonthlySavings;
    }

    return {
      ...data,
      monthlyManualCost,
      monthlyAutoCost,
      monthlySavings: totalMonthlySavings,
      paybackMonths: isFinite(paybackMonths) && paybackMonths >= 0 ? paybackMonths : 0,
      cashFlowImprovementSavings,
    };
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [id]: id === 'industry' ? (value as Industry) : parseFloat(value) || 0,
      };
      return calculateROI(updatedData);
    });
  }, [calculateROI]);

  const handleLoadDemoData = useCallback((industry: Industry) => {
    const demoData = DEMO_ROI_DATA[industry];
    if (demoData) {
      setFormData((prev) => {
        const updatedData = {
          ...prev,
          industry,
          ...demoData,
        };
        return calculateROI(updatedData);
      });
    }
  }, [calculateROI]);

  const handleExportPDF = useCallback(() => {
    window.print();
    alert('Simulating PDF export. Please use your browser\'s print dialog.');
  }, []);

  const handleGenerateCrmLink = useCallback(() => {
    console.log('Simulating generation of CRM-friendly report link/attachment:', formData);
    alert('Simulating creation of CRM-friendly report link/attachment for current ROI data.');
  }, [formData]);

  const industryOptions = Object.values(Industry).map((industry) => ({
    value: industry,
    label: industry,
  }));

  // Calculate projected values for KPI table
  const currentTotalPaymentCycleDays = formData.avgDaysJobToInvoice + formData.avgDaysInvoiceToPayment;
  const effectiveDaysReduced = Math.min(currentTotalPaymentCycleDays, formData.automatedDaysReduction);

  // Distribute the reduction proportionally based on original days, or a simple average
  let projectedAvgDaysJobToInvoice = formData.avgDaysJobToInvoice;
  let projectedAvgDaysInvoiceToPayment = formData.avgDaysInvoiceToPayment;

  if (currentTotalPaymentCycleDays > 0) {
    const jobToInvoiceRatio = formData.avgDaysJobToInvoice / currentTotalPaymentCycleDays;
    const invoiceToPaymentRatio = formData.avgDaysInvoiceToPayment / currentTotalPaymentCycleDays;

    const reducedJobToInvoice = effectiveDaysReduced * jobToInvoiceRatio;
    const reducedInvoiceToPayment = effectiveDaysReduced * invoiceToPaymentRatio;

    projectedAvgDaysJobToInvoice = Math.max(0, formData.avgDaysJobToInvoice - reducedJobToInvoice);
    projectedAvgDaysInvoiceToPayment = Math.max(0, formData.avgDaysInvoiceToPayment - reducedInvoiceToPayment);
  } else if (formData.automatedDaysReduction > 0) {
    // If current cycle is 0 but reduction is specified, assume both become 0
    projectedAvgDaysJobToInvoice = 0;
    projectedAvgDaysInvoiceToPayment = 0;
  }

  const projectedTotalPaymentCycleDays = Math.max(0, currentTotalPaymentCycleDays - effectiveDaysReduced);


  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">ROI Dashboard Template</h2>
      <Card className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Calculate Your Potential ROI</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Select
            id="industry"
            label="Industry"
            value={formData.industry}
            onChange={handleChange}
            options={industryOptions}
          />
          <Input
            id="monthlyJobsInvoices"
            label="Monthly Jobs/Invoices"
            type="number"
            value={formData.monthlyJobsInvoices}
            onChange={handleChange}
            min="0"
          />
          <Input
            id="manualCostPerTask"
            label="Manual Cost Per Task ($)"
            type="number"
            value={formData.manualCostPerTask}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
          <Input
            id="autoCostPerTask"
            label="Automated Cost Per Task ($)"
            type="number"
            value={formData.autoCostPerTask}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
          <Input
            id="hoursSavedPerMonth"
            label="Hours Saved Per Month"
            type="number"
            value={formData.hoursSavedPerMonth}
            onChange={handleChange}
            min="0"
          />
          <Input
            id="setupFee"
            label="Automation Setup Fee ($)"
            type="number"
            value={formData.setupFee}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
          {/* New inputs for cash flow improvement */}
          <Input
            id="avgDaysJobToInvoice"
            label="Current Avg Days: Job-to-Invoice"
            type="number"
            value={formData.avgDaysJobToInvoice}
            onChange={handleChange}
            min="0"
          />
          <Input
            id="avgDaysInvoiceToPayment"
            label="Current Avg Days: Invoice-to-Payment"
            type="number"
            value={formData.avgDaysInvoiceToPayment}
            onChange={handleChange}
            min="0"
          />
          <Input
            id="automatedDaysReduction"
            label="Automated Days Reduction (Total Cycle)"
            type="number"
            value={formData.automatedDaysReduction}
            onChange={handleChange}
            min="0"
          />
        </div>
        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-800 mb-2">Load Demo Data:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.values(Industry).map((industry) => (
              <Button
                key={industry}
                variant="secondary"
                size="sm"
                onClick={() => handleLoadDemoData(industry)}
                className="whitespace-nowrap"
              >
                {industry}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">ROI Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
          <p>
            <strong>Monthly Manual Cost:</strong> ${formData.monthlyManualCost.toFixed(2)}
          </p>
          <p>
            <strong>Monthly Automated Cost:</strong> ${formData.monthlyAutoCost.toFixed(2)}
          </p>
          <p>
            <strong>Monthly Process Savings:</strong> ${(formData.monthlyManualCost - formData.monthlyAutoCost).toFixed(2)}
          </p>
          <p>
            <strong>Monthly Labor Savings:</strong> ${(formData.hoursSavedPerMonth * AVERAGE_HOURLY_WAGE).toFixed(2)}
          </p>
          <p>
            <strong className="text-purple-600">Cash Flow Improvement Savings:</strong> ${formData.cashFlowImprovementSavings.toFixed(2)}
          </p>
          <p>
            <strong className="text-blue-600">Total Monthly Savings:</strong> ${formData.monthlySavings.toFixed(2)}
          </p>
          <p>
            <strong className="text-green-600">Payback Months:</strong> {formData.paybackMonths.toFixed(2)}
          </p>
          <p className="col-span-full mt-4 text-sm text-gray-600">
            *Assumed average hourly wage for labor savings: ${AVERAGE_HOURLY_WAGE}/hour
            <br />
            **Assumed value of cash flow improvement: ${VALUE_PER_DAY_PER_JOB}/day/job
          </p>
        </div>
        <div className="mt-8 flex gap-4">
          <Button onClick={handleExportPDF} variant="primary" size="lg">
            Export ROI Report (PDF)
          </Button>
          <Button onClick={handleGenerateCrmLink} variant="outline" size="lg">
            Generate CRM-Friendly Report Link
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">KPI Comparison (Pilot Summary)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                  KPI
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                  Before Automation
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                  After Automation (Projected)
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                  Improvement
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border-b border-gray-200">Monthly Processing Cost</td>
                <td className="px-4 py-2 border-b border-gray-200">${formData.monthlyManualCost.toFixed(2)}</td>
                <td className="px-4 py-2 border-b border-gray-200">${formData.monthlyAutoCost.toFixed(2)}</td>
                <td className="px-4 py-2 border-b border-gray-200 text-green-600">
                  -${(formData.monthlyManualCost - formData.monthlyAutoCost).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b border-gray-200">Monthly Labor Savings</td>
                <td className="px-4 py-2 border-b border-gray-200">$0.00</td>
                <td className="px-4 py-2 border-b border-gray-200">
                  ${(formData.hoursSavedPerMonth * AVERAGE_HOURLY_WAGE).toFixed(2)}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-green-600">
                  +{(formData.hoursSavedPerMonth * AVERAGE_HOURLY_WAGE).toFixed(2)}
                </td>
              </tr>
              {/* New KPI rows for cash flow */}
              <tr>
                <td className="px-4 py-2 border-b border-gray-200">Avg Days Job-to-Invoice</td>
                <td className="px-4 py-2 border-b border-gray-200">{formData.avgDaysJobToInvoice.toFixed(0)} Days</td>
                <td className="px-4 py-2 border-b border-gray-200">{projectedAvgDaysJobToInvoice.toFixed(0)} Days</td>
                <td className="px-4 py-2 border-b border-gray-200 text-green-600">
                  -{ (formData.avgDaysJobToInvoice - projectedAvgDaysJobToInvoice).toFixed(0) } Days
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b border-gray-200">Avg Days Invoice-to-Payment</td>
                <td className="px-4 py-2 border-b border-gray-200">{formData.avgDaysInvoiceToPayment.toFixed(0)} Days</td>
                <td className="px-4 py-2 border-b border-gray-200">{projectedAvgDaysInvoiceToPayment.toFixed(0)} Days</td>
                <td className="px-4 py-2 border-b border-gray-200 text-green-600">
                  -{ (formData.avgDaysInvoiceToPayment - projectedAvgDaysInvoiceToPayment).toFixed(0) } Days
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b border-gray-200">Total Payment Cycle Days</td>
                <td className="px-4 py-2 border-b border-gray-200">{currentTotalPaymentCycleDays.toFixed(0)} Days</td>
                <td className="px-4 py-2 border-b border-gray-200">{projectedTotalPaymentCycleDays.toFixed(0)} Days</td>
                <td className="px-4 py-2 border-b border-gray-200 text-green-600">
                  -{ effectiveDaysReduced.toFixed(0) } Days
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b border-gray-200">Cash Flow Improvement</td>
                <td className="px-4 py-2 border-b border-gray-200">$0.00</td>
                <td className="px-4 py-2 border-b border-gray-200">${formData.cashFlowImprovementSavings.toFixed(2)}</td>
                <td className="px-4 py-2 border-b border-gray-200 text-green-600">
                  +${formData.cashFlowImprovementSavings.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b border-gray-200 font-bold">Total Monthly Savings</td>
                <td className="px-4 py-2 border-b border-gray-200 font-bold">$0.00</td>
                <td className="px-4 py-2 border-b border-gray-200 font-bold">${formData.monthlySavings.toFixed(2)}</td>
                <td className="px-4 py-2 border-b border-gray-200 font-bold text-green-600">
                  +${formData.monthlySavings.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b border-gray-200">Payback Period</td>
                <td className="px-4 py-2 border-b border-gray-200">N/A</td>
                <td className="px-4 py-2 border-b border-gray-200">{formData.paybackMonths.toFixed(2)} Months</td>
                <td className="px-4 py-2 border-b border-gray-200">
                  {formData.paybackMonths > 0 ? 'Achieved' : 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ROICalculator;