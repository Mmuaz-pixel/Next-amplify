// app/offers/create/page.tsx
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '@/../amplify/data/resource';

const client = generateClient<Schema>();

export default function CreateOfferPage() {
  return (
    <div>
      <h1>Create Offer</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          await client.models.Offer.create({
            description: formData.get('description') as string,
            status: 'pending',
            notifyRecipient: formData.get('notifyRecipient') === 'on',
          });
        }}
      >
        <label>
          Description:
          <textarea name="description" required />
        </label>
        <label>
          Notify Recipient:
          <input type="checkbox" name="notifyRecipient" />
        </label>
        <button type="submit">Create Offer</button>
      </form>
    </div>
  );
}