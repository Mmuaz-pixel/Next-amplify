// app/messages/[matchId]/page.tsx
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '@/../amplify/data/resource';

const client = generateClient<Schema>();

export default async function MessagesPage({ params }: { params: { matchId: string } }) {
  const { data: messages } = await client.models.Message.list({
    filter: { matchId: { eq: params.matchId } },
  });

  return (
    <div>
      <h1>Messages</h1>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <p>{message.content}</p>
            <small>Sent at: {message.createdAt}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}