'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '@/../amplify/data/resource';
import { useAuth } from '@/providers/UserProvider';

const client = generateClient<Schema>({ authMode: 'userPool' });

export default function CreateOfferPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientLinks, setRecipientLinks] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [notifyRecipient, setNotifyRecipient] = useState(true);
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!user) throw new Error('User not authenticated');

      const newOffer = await client.models.Offer.create({
        creatorId: user.id,
        recipientEmail,
        recipientName,
        recipientLinks,
        description,
        status,
        notifyRecipient,
      });

      console.log('Offer created:', newOffer.data);
      router.push('/offers'); // Redirect back to the offers list
    } catch (err: any) {
      console.error('Error creating offer:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create Offer</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Recipient Email</label>
          <input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Recipient Name</label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Recipient Links (comma separated)</label>
          <input
            type="text"
            value={recipientLinks.join(', ')}
            onChange={(e) => setRecipientLinks(e.target.value.split(',').map(link => link.trim()))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={notifyRecipient}
            onChange={(e) => setNotifyRecipient(e.target.checked)}
            className="mr-2"
          />
          <label>Notify Recipient</label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded w-full"
        >
          {loading ? 'Creating...' : 'Create Offer'}
        </button>
      </form>
    </div>
  );
}
