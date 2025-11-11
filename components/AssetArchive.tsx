import React, { useState, useCallback } from 'react';
import { AssetLink } from '../types';
import { INITIAL_ASSET_LINKS } from '../constants';
import Input from './Input';
import Button from './Button';
import Card from './Card';

const AssetArchive: React.FC = () => {
  const [links, setLinks] = useState<AssetLink[]>(INITIAL_ASSET_LINKS);
  const [newLink, setNewLink] = useState({ title: '', url: '', category: '' });
  const [message, setMessage] = useState<string | null>(null);
  const [loggedToCrm, setLoggedToCrm] = useState<string | null>(null);
  const [crmMessage, setCrmMessage] = useState<string | null>(null); // New state for CRM messages
  const [isCrmError, setIsCrmError] = useState<boolean>(false); // New state for CRM message error status

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewLink((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleAddLink = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (newLink.title && newLink.url) {
      setLinks((prev) => [...prev, { id: Date.now().toString(), ...newLink }]);
      setNewLink({ title: '', url: '', category: '' });
      setMessage('Link added successfully!');
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage('Please fill in title and URL.');
      setTimeout(() => setMessage(null), 3000);
    }
  }, [newLink]);

  const handleLogToCrm = useCallback((link: AssetLink, id: string) => {
    // Simulate API call success or failure
    const success = Math.random() > 0.3; // 70% chance of success

    if (success) {
      console.log('Simulating logging asset link usage to CRM:', {
        assetId: id,
        assetTitle: link.title,
        assetUrl: link.url,
        assetCategory: link.category,
      });
      setLoggedToCrm(id);
      setCrmMessage(`Asset "${link.title}" logged to CRM.`);
      setIsCrmError(false); // Assuming success for simulated log
    } else {
      console.error('Simulating CRM logging failure for asset:', link.title);
      setCrmMessage(`Failed to log "${link.title}" to CRM. Please try again.`);
      setIsCrmError(true);
    }
    
    setTimeout(() => {
      setLoggedToCrm(null);
      setCrmMessage(null); // Dismiss message after 3 seconds
    }, 3000);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Pre-Qualified Asset Links Archive</h2>

      <Card className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Asset Link</h3>
        {message && (
          <div className={`mb-4 px-4 py-3 rounded relative ${
            message.includes('successfully') ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'
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
        <form onSubmit={handleAddLink} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="title"
            label="Link Title"
            value={newLink.title}
            onChange={handleChange}
            placeholder="e.g., Google Cloud AI Solutions"
          />
          <Input
            id="url"
            label="URL"
            type="url"
            value={newLink.url}
            onChange={handleChange}
            placeholder="e.g., https://cloud.google.com/ai"
          />
          <div className="col-span-1 md:col-span-2">
            <Input
              id="category"
              label="Category (Optional)"
              value={newLink.category}
              onChange={handleChange}
              placeholder="e.g., General Automation, Logistics"
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <Button type="submit" variant="primary" size="md">
              Add Link
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Archived Links</h3>
        {links.length === 0 ? (
          <p className="text-gray-600">No links added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Title</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">URL</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Category</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link.id}>
                    <td className="px-4 py-2 border-b border-gray-200 text-sm">{link.title}</td>
                    <td className="px-4 py-2 border-b border-gray-200 text-sm">
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-xs block">
                        {link.url}
                      </a>
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200 text-sm">{link.category || 'N/A'}</td>
                    <td className="px-4 py-2 border-b border-gray-200 text-sm">
                      <Button
                        onClick={() => handleLogToCrm(link, link.id)}
                        variant={loggedToCrm === link.id ? 'secondary' : 'outline'}
                        size="sm"
                      >
                        {loggedToCrm === link.id ? 'Logged!' : 'Log to CRM'}
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

export default AssetArchive;