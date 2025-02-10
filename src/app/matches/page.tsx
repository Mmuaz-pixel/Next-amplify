// app/matches/page.tsx
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '@/../amplify/data/resource';

const client = generateClient<Schema>();

export default async function MatchesPage() {
  const { userId } = await getCurrentUser();

  const { data: matches } = await client.models.Match.list({
    filter: { or: [{ offer1Id: { eq: userId } }, { offer2Id: { eq: userId } }] },
  });

  return (
    <div>
      <h1>My Matches</h1>
      <ul>
        {matches.map((match) => (
          <li key={match.id}>
            <h2>Match ID: {match.id}</h2>
            <p>Status: {match.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}