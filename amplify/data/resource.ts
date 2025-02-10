import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

export const schema = a.schema({
  User: a.model({
    id: a.id(),
    firstName:a.string(),
    family_name:a.string(),
    email: a.string().required(),
    owner: a.string(),
    offers: a.hasMany('Offer', 'creatorId'),
    messages: a.hasMany('Message', 'senderId'),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
  }).authorization((allow) => [
    // Allow anyone to create a user (needed for signup)
    allow.publicApiKey().to(['create']),

    // Allow only the owner to read, update, and delete their own records
    allow.owner().to(["read", "update", "delete"])
  ]),

  Recipient: a.model({
    id: a.id(),
    offerId: a.string().required(),
    offer: a.belongsTo('Offer', 'offerId'), // Reference to the parent Offer
    recip_first_name: a.string(),
    recip_family_name: a.string(),
    email: a.string(),
    soMe_links: a.string().array(),
  }).authorization((allow) =>
    [allow.owner().to(["create", "read", "update", "delete"])]
  ),

  Offer: a.model({
    id: a.id(),
    creatorId: a.string().required(),
    creator: a.belongsTo('User', 'creatorId'), // Parent user
    recipient: a.hasOne('Recipient', 'offerId'), // One-to-One relationship with Recipient
    recipientEmail: a.string(),
    recipientName:a.string(),
    recipientLinks: a.string().array(),
    description: a.string().required(),
    status: a.string().required(),
    notifyRecipient: a.boolean().required(),
    match1: a.hasOne('Match', 'offer1Id'), // First Match
    match2: a.hasOne('Match', 'offer2Id'), // Second Match
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
  }).authorization(allow =>  
[allow.owner().to(["create", "read", "update", "delete"]),
  allow.groups(["matchParticipants"]).to(["read"]),
]),

  Match: a.model({
    id: a.id(),
    offer1Id: a.string().required(),
    offer1: a.belongsTo('Offer', 'offer1Id'), // Linked to first Offer
    offer2Id: a.string().required(),
    offer2: a.belongsTo('Offer', 'offer2Id'), // Linked to second Offer
    status: a.string().required(),
    isPaid: a.boolean().required(),
    messages: a.hasMany('Message', 'matchId'), // Messages in the match
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
  }).authorization((allow) => [
    allow.owner().to(['read', 'delete']),
  ]),

  Message: a.model({
    id: a.id(),
    matchId: a.string().required(),
    match: a.belongsTo('Match', 'matchId'),
    senderId: a.string().required(),
    sender: a.belongsTo('User', 'senderId'),
    content: a.string().required(),
    createdAt: a.datetime(),
  }).authorization((allow) => [
    allow.authenticated().to(["create"]),
    allow.owner().to(["read", "delete"]),
    allow.groups(["matchParticipants"]).to(["read"]),
  ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

