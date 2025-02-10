// app/messages/[matchId]/send/page.tsx
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '@/../amplify/data/resource';

const client = generateClient<Schema>();

export default function SendMessagePage({ params }: { params: { matchId: string } }) {
  return (
    <div>
      <h1>Send Message</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          await client.models.Message.create({
            matchId: params.matchId,
            content: formData.get('content') as string,
          });
        }}
      >
        <label>
          Message:
          <textarea name="content" required />
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}