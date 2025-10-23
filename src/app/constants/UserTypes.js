export const UserTypes = [
  // Internal roles
  { type: 'it_admin', label: 'IT Admin', description: 'Full access to the every feature in the portal.' },

  // client-side roles
  { type: 'founder', label: 'SaaS Founder', description: `Can have acceess to its SaaS validaton alanlytics` },
];

export const UserTypesObj = Object.fromEntries(
    UserTypes.map(({ type }) => [type, type])
);
