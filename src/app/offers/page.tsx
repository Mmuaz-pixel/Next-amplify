'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '@/../amplify/data/resource';
import { useAuth } from '@/providers/UserProvider';

const client = generateClient<Schema>({ authMode: 'userPool' });

export default function OffersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [offers, setOffers] = useState<any>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    
    async function fetchOffers() {
      try {
        setFetching(true);
        const { data } = await client.models.Offer.list({
          filter: { creatorId: { eq: user.id } },
        });
        setOffers(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch offers');
      } finally {
        setFetching(false);
      }
    }

    fetchOffers();
  }, [user]);

  if (loading || fetching) return <p>Loading offers...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Your Offers</h2>
      
      <button
        onClick={() => router.push('/offers/create')}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Create New Offer
      </button>

      {offers.length === 0 ? (
        <p>No offers found. Start by creating one!</p>
      ) : (
        <ul className="space-y-4">
          {offers.map((offer: any) => (
            <li
              key={offer.id}
              className="p-4 border rounded cursor-pointer hover:bg-gray-100"
              onClick={() => router.push(`/offers/${offer.id}`)}
            >
              <p className="font-semibold">{offer.description}</p>
              <p className="text-sm text-gray-600">
                Recipient: {offer.recipientName || 'Unknown'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
