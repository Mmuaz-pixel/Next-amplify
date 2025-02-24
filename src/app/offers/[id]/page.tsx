'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '@/../amplify/data/resource';
import { useAuth } from '@/providers/UserProvider';

const client = generateClient<Schema>({ authMode: 'userPool' });

export default function OfferDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuth();
  
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOffer() {
      try {
        if (!id) return;
        const { data } = await client.models.Offer.get({ id: id as string });
        setOffer(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load offer');
      } finally {
        setLoading(false);
      }
    }
    fetchOffer();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!offer) return <p>Offer not found.</p>;

  const matchedUserId = offer.match1?.userId || offer.match2?.userId;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Offer Details</h2>
      <p><strong>Description:</strong> {offer.description}</p>
      <p><strong>Recipient:</strong> {offer.recipientName || 'Unknown'}</p>

      {matchedUserId && (
        <button
          onClick={() => router.push(`/messages/${offer.id}`)}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Message Matched User
        </button>
      )}
    </div>
  );
}
