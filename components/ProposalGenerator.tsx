import React, { useState, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import Select from './Select';
import { Industry } from '../types';

const ProposalGenerator: React.FC = () => {
  const [prospectName, setProspectName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState<Industry>(Industry.Construction);
  const [keyChallenges, setKeyChallenges] = useState('');
  const [roiSummary, setRoiSummary] = useState('');
  const [generatedProposal, setGeneratedProposal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loggedToCrm, setLoggedToCrm] = useState(false);
  const [crmMessage, setCrmMessage] = useState<string | null>(null);
  const [isCrmError, setIsCrmError] = useState<boolean>(false);
  const [pdfMessage, setPdfMessage] = useState<string | null>(null); // New state for PDF messages

  const industryOptions = Object.values(Industry).map((ind) => ({
    value: ind,
    label: ind,
  }));

  const handleGenerateProposal = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedProposal('');
    setCopied(false);
    setLoggedToCrm(false);
    setCrmMessage(null); // Clear previous CRM message
    setPdfMessage(null); // Clear previous PDF message

    // Always create a new GoogleGenAI instance right before an API call to ensure the latest API key is used.
    if (!process.env.API_KEY) {
      setError('API Key is not configured. Please ensure process.env.API_KEY is set.');
      setIsLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are an expert sales proposal writer for DFW Automation, a company specializing in business process automation.
      Your task is to generate a concise and compelling pilot program proposal mini-deck content (Markdown format) for a prospective client.

      The proposal should include:
      1.  **Executive Summary:** Briefly introduce DFW Automation and the value proposition for the client.
      2.  **Client Context:** Acknowledge the client's industry and key challenges.
      3.  **Proposed Pilot Solution:** Briefly describe a high-level automation solution.
      4.  **Expected ROI/Benefits:** Highlight the potential financial and operational benefits, referencing the ROI summary provided.
      5.  **Next Steps:** Suggest a clear call to action (e.g., follow-up meeting, pilot project details).

      Use the following client information:
      - Prospect Name: ${prospectName || '[Prospect Name]'}
      - Company Name: ${companyName || '[Company Name]'}
      - Industry: ${industry}
      - Key Challenges: ${keyChallenges || 'manual data entry, inefficient workflows, high operational costs'}
      - ROI Summary (from DFW Automation calculations): ${roiSummary || 'Significant time and cost savings through automation.'}

      Format the output in Markdown. Ensure a professional and persuasive tone.`;

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro', // Using pro model for complex text generation
        contents: prompt, // Directly pass the prompt string
        config: {
          temperature: 0.7,
          maxOutputTokens: 800, // Reasonable length for a mini-deck content
          responseMimeType: 'text/markdown', // Request Markdown output
        },
      });

      setGeneratedProposal(response.text);
    } catch (err) {
      console.error('Error generating proposal:', err);
      setError('Failed to generate proposal. Please try again. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [prospectName, companyName, industry, keyChallenges, roiSummary]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generatedProposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generatedProposal]);

  const handleLogToCrm = useCallback(() => {
    // Simulate API call success or failure
    const success = Math.random() > 0.3; // 70% chance of success

    if (success) {
      console.log('Simulating logging proposal generation to CRM:', {
        prospectName,
        companyName,
        industry,
        keyChallenges,
        roiSummary,
        generatedProposal,
      });
      setLoggedToCrm(true);
      setCrmMessage('Proposal generation activity logged to CRM.');
      setIsCrmError(false); // Assuming success for simulated log
    } else {
      console.error('Simulating CRM logging failure for proposal:', companyName);
      setCrmMessage(`Failed to log proposal for "${companyName}" to CRM. Please try again.`);
      setIsCrmError(true);
    }
    
    setTimeout(() => {
      setLoggedToCrm(false);
      setCrmMessage(null); // Dismiss message after 3 seconds
    }, 3000);
  }, [prospectName, companyName, industry, keyChallenges, roiSummary, generatedProposal]);

  const handleExportPDF = useCallback(() => {
    window.print();
    setPdfMessage('Simulating PDF export. Please use your browser\'s print dialog.');
    setTimeout(() => setPdfMessage(null), 3000);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Pilot Proposal Mini-Deck Generator</h2>

      <Card className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Client & Contextual Information</h3>
        {crmMessage && (
          <div className={`mb-4 px-4 py-3 rounded relative ${
            isCrmError ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-blue-100 border border-blue-400 text-blue-700'
          }`} role="alert">
            <span className="block sm:inline">{crmMessage}</span>
          </div>
        )}
        {pdfMessage && (
          <div className="mb-4 px-4 py-3 rounded relative bg-green-100 border border-green-400 text-green-700" role="alert">
            <span className="block sm:inline">{pdfMessage}</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="prospectName"
            label="Prospect Name"
            value={prospectName}
            onChange={(e) => setProspectName(e.target.value)}
            placeholder="e.g., Jane Doe"
          />
          <Input
            id="companyName"
            label="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g., Acme Corp"
          />
          <Select
            id="industry"
            label="Industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value as Industry)}
            options={industryOptions}
          />
          <div className="col-span-full mb-4">
            <label htmlFor="keyChallenges" className="block text-sm font-medium text-gray-700 mb-1">
              Key Challenges Identified
            </label>
            <textarea
              id="keyChallenges"
              rows={4}
              value={keyChallenges}
              onChange={(e) => setKeyChallenges(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., High manual processing time for invoices, frequent errors in logistics, delayed payment cycles."
            />
          </div>
          <div className="col-span-full mb-4">
            <label htmlFor="roiSummary" className="block text-sm font-medium text-gray-700 mb-1">
              ROI Summary / Expected Savings (from Calculator)
            </label>
            <textarea
              id="roiSummary"
              rows={3}
              value={roiSummary}
              onChange={(e) => setRoiSummary(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Projected monthly savings of $5,000, payback period of 3 months, 80 hours saved per month in admin time."
            />
          </div>
        </div>
        <Button
          onClick={handleGenerateProposal}
          disabled={isLoading || !prospectName || !companyName || !keyChallenges || !roiSummary}
          variant="primary"
          size="lg"
          className="mt-6"
        >
          {isLoading ? 'Generating...' : 'Generate Proposal Mini-Deck'}
        </Button>
        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      </Card>

      {generatedProposal && (
        <Card>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Generated Pilot Proposal Content</h3>
          <div className="mb-4">
            <label htmlFor="proposalContent" className="block text-sm font-medium text-gray-700 mb-1">
              Proposal Content (Markdown)
            </label>
            <div
              id="proposalContent"
              className="block w-full h-auto p-3 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-700 whitespace-pre-wrap overflow-auto print:shadow-none print:border-0 print:p-0"
              style={{ minHeight: '320px' }}
              aria-label="Generated proposal content"
            >
              {generatedProposal}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleCopy} variant="secondary" size="md">
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
            <Button onClick={handleLogToCrm} variant="outline" size="md">
              {loggedToCrm ? 'Logged!' : 'Log Activity to CRM'}
            </Button>
            <Button onClick={handleExportPDF} variant="primary" size="md">
              Export Proposal (PDF)
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProposalGenerator;