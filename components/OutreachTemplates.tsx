import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { OutreachCopy, Industry, ProspectStage } from '../types';
import { INITIAL_OUTREACH_COPY } from '../constants';
import Button from './Button';
import Card from './Card';
import Select from './Select';
import Input from './Input';

const newTemplateInitialState = {
  title: '',
  industry: Industry.Construction, // Default to a valid industry
  type: 'Email' as 'Email' | 'Call Opener' | 'Follow-up Script',
  content: '',
  stages: [] as ProspectStage[],
};

const OutreachTemplates: React.FC = () => {
  const [customTemplates, setCustomTemplates] = useState<OutreachCopy[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | 'All'>('All');
  const [selectedStage, setSelectedStage] = useState<ProspectStage | 'All'>('All');
  const [copied, setCopied] = useState<string | null>(null);
  const [loggedToCrm, setLoggedToCrm] = useState<string | null>(null);
  const [newTemplateData, setNewTemplateData] = useState(newTemplateInitialState);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [crmMessage, setCrmMessage] = useState<string | null>(null); // New state for CRM messages
  const [isCrmError, setIsCrmError] = useState<boolean>(false); // New state for CRM message error status


  const allTemplates = useMemo(() => [...INITIAL_OUTREACH_COPY, ...customTemplates], [customTemplates]);

  const handleCopy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000); // Reset copied status after 2 seconds
  }, []);

  const handleLogToCrm = useCallback((template: OutreachCopy, id: string) => {
    // Simulate API call success or failure
    const success = Math.random() > 0.3; // 70% chance of success

    if (success) {
      console.log('Simulating logging outreach activity to CRM:', { 
        templateId: id, 
        templateTitle: template.title, 
        content: template.content, 
        industry: template.industry, 
        type: template.type, 
        stages: template.stages 
      });
      setLoggedToCrm(id);
      setCrmMessage(`"${template.title}" activity logged to CRM.`);
      setIsCrmError(false); // Assuming success for simulated log
    } else {
      console.error('Simulating CRM logging failure for:', template.title);
      setCrmMessage(`Failed to log "${template.title}" to CRM. Please try again.`);
      setIsCrmError(true);
    }
    
    setTimeout(() => {
      setLoggedToCrm(null);
      setCrmMessage(null); // Dismiss message after 3 seconds
    }, 3000);
  }, []);

  // Fix: Explicitly cast the value to the correct type based on the input's 'id'
  const handleNewTemplateChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setNewTemplateData((prev) => {
      if (id === 'industry') {
        return {
          ...prev,
          [id]: value as Industry,
        };
      } else if (id === 'type') {
        return {
          ...prev,
          [id]: value as 'Email' | 'Call Opener' | 'Follow-up Script',
        };
      } else {
        return {
          ...prev,
          [id]: value,
        };
      }
    });
  }, []);

  // Fix: Explicitly type `option` as `HTMLOptionElement`
  const handleStageSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value as ProspectStage);
    setNewTemplateData((prev) => ({ ...prev, stages: options }));
  }, []);

  const handleSaveNewTemplate = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateData.title || !newTemplateData.content) {
      setMessage('Template title and content cannot be empty.');
      setIsError(true);
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (editingTemplateId) {
      // Update existing template
      setCustomTemplates((prev) =>
        prev.map((template) =>
          template.id === editingTemplateId
            ? { ...newTemplateData, id: editingTemplateId, isCustom: true }
            : template
        )
      );
      setMessage('Template updated successfully!');
      setEditingTemplateId(null);
    } else {
      // Create new template
      const newTemplate: OutreachCopy = {
        id: Date.now().toString(),
        isCustom: true,
        ...newTemplateData,
      };
      setCustomTemplates((prev) => [...prev, newTemplate]);
      setMessage('Template saved as draft successfully!');
    }
    setIsError(false);
    setNewTemplateData(newTemplateInitialState); // Reset form
    setTimeout(() => setMessage(null), 3000);
  }, [newTemplateData, editingTemplateId]);

  const handleEditTemplate = useCallback((template: OutreachCopy) => {
    setNewTemplateData({
      title: template.title,
      industry: template.industry === 'General' ? Industry.Construction : template.industry, // Handle 'General' for editing
      type: template.type,
      content: template.content,
      stages: template.stages || [],
    });
    setEditingTemplateId(template.id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the form
  }, []);

  const handleDeleteTemplate = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this custom template?')) {
      setCustomTemplates((prev) => prev.filter((template) => template.id !== id));
      setMessage('Template deleted successfully!');
      setIsError(false);
      setTimeout(() => setMessage(null), 3000);
    }
  }, []);

  const handleCancelEdit = useCallback(() => {
    setNewTemplateData(newTemplateInitialState);
    setEditingTemplateId(null);
    setMessage(null);
    setIsError(false);
  }, []);


  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((template) => {
      const industryMatch =
        selectedIndustry === 'All' || template.industry === selectedIndustry || template.industry === 'General';

      const stageMatch =
        selectedStage === 'All' ||
        (template.stages && template.stages.includes(selectedStage));

      return industryMatch && stageMatch;
    });
  }, [allTemplates, selectedIndustry, selectedStage]);

  const industryOptions = [
    { value: 'All', label: 'All Industries' },
    ...Object.values(Industry).map((ind) => ({ value: ind, label: ind })),
  ];

  const templateTypeOptions = [
    { value: 'Email', label: 'Email' },
    { value: 'Call Opener', label: 'Call Opener' },
    { value: 'Follow-up Script', label: 'Follow-up Script' },
  ];

  const prospectStageOptions = [
    { value: 'All', label: 'All Stages' },
    ...Object.values(ProspectStage).map((stage) => ({ value: stage, label: stage })),
  ];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Outreach Copy Blocks</h2>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded relative ${
          isError ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'
        }`} role="alert">
          <span className="block sm:inline">{message}</span>
        </div>
      )}

      {crmMessage && ( // Display CRM logging message
        <div className={`mb-4 px-4 py-3 rounded relative ${
          isCrmError ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-blue-100 border border-blue-400 text-blue-700'
        }`} role="alert">
          <span className="block sm:inline">{crmMessage}</span>
        </div>
      )}

      {/* Create/Edit Template Section */}
      <Card className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{editingTemplateId ? 'Edit Custom Template' : 'Create New Template Draft'}</h3>
        <form onSubmit={handleSaveNewTemplate}>
          <Input
            id="title"
            label="Template Title"
            value={newTemplateData.title}
            onChange={handleNewTemplateChange}
            placeholder="e.g., Q4 Logistics Follow-up"
            required
          />
          <Select
            id="industry"
            label="Industry"
            value={newTemplateData.industry}
            onChange={handleNewTemplateChange}
            options={industryOptions.filter(opt => opt.value !== 'All')} // Remove 'All' from creation options
          />
          <Select
            id="type"
            label="Template Type"
            value={newTemplateData.type}
            onChange={handleNewTemplateChange}
            options={templateTypeOptions}
          />
          <div className="mb-4">
            <label htmlFor="stages" className="block text-sm font-medium text-gray-700 mb-1">
              Prospect Stages (Multi-select)
            </label>
            <select
              id="stages"
              multiple
              value={newTemplateData.stages}
              onChange={handleStageSelectChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-32"
              aria-label="Select prospect stages"
            >
              {Object.values(ProspectStage).map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple stages.</p>
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Template Content
            </label>
            <textarea
              id="content"
              rows={8}
              value={newTemplateData.content}
              onChange={handleNewTemplateChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Start writing your template content here..."
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="primary" size="md">
              {editingTemplateId ? 'Update Template' : 'Save as Draft'}
            </Button>
            {editingTemplateId && (
              <Button type="button" variant="secondary" size="md" onClick={handleCancelEdit}>
                Cancel Edit
              </Button>
            )}
          </div>
        </form>
      </Card>


      {/* Template Filters */}
      <Card className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Filter Templates</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Select
            id="industryFilter"
            label="Filter by Industry"
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value as Industry | 'All')}
            options={industryOptions}
            className="w-full md:w-auto flex-1 min-w-[150px]"
          />
          <Select
            id="stageFilter"
            label="Filter by Prospect Stage"
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value as ProspectStage | 'All')}
            options={prospectStageOptions}
            className="w-full md:w-auto flex-1 min-w-[150px]"
          />
        </div>
      </Card>

      {/* Display Filtered Templates */}
      <div className="space-y-6">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <Card key={template.id} className="relative p-5">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {template.title}
                {template.isCustom && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Draft
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                Industry: {template.industry} | Type: {template.type}
              </p>
              {template.stages && template.stages.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1">
                  {template.stages.map((stage) => (
                    <span
                      key={stage}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {stage}
                    </span>
                  ))}
                </div>
              )}
              <textarea
                readOnly
                value={template.content}
                className="w-full h-40 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 resize-y focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label={`${template.title} content`}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  onClick={() => handleCopy(template.content, template.id)}
                  variant="secondary"
                  size="sm"
                >
                  {copied === template.id ? 'Copied!' : 'Copy to Clipboard'}
                </Button>
                <Button
                  onClick={() => handleLogToCrm(template, template.id)}
                  variant="outline"
                  size="sm"
                >
                  {loggedToCrm === template.id ? 'Logged!' : 'Log Activity to CRM'}
                </Button>
                {template.isCustom && (
                  <>
                    <Button
                      onClick={() => handleEditTemplate(template)}
                      variant="ghost"
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteTemplate(template.id)}
                      variant="danger"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))
        ) : (
          <p className="text-gray-600">No templates available for the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default OutreachTemplates;