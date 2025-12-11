export default {
  name: 'conversation',
  title: 'Conversation',
  type: 'document',
  fields: [
    {
      name: 'participants',
      title: 'Participants',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'user' }] }],
      validation: (Rule: any) => Rule.min(2).max(2),
    },
    {
      name: 'lastMessage',
      title: 'Last Message',
      type: 'reference',
      to: [{ type: 'message' }],
    },
    {
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
    },
  ],
  orderings: [
    {
      title: 'Recent first',
      name: 'recent',
      by: [{ field: 'updatedAt', direction: 'desc' }],
    },
  ],
}
