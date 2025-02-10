// app/offers/page.tsx
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '@/../amplify/data/resource';

const client = generateClient<Schema>();

export default async function OffersPage() {
  const { userId } = await getCurrentUser();

  const { data: offers } = await client.models.Offer.list({
    filter: { creatorId: { eq: userId } },
  });

  return (
    <div>
      <h1>My Offers</h1>
      <ul>
        {offers.map((offer) => (
          <li key={offer.id}>
            <h2>{offer.description}</h2>
            <p>Status: {offer.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}