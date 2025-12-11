export default {
  name: 'message',
  title: 'Message',
  type: 'document',
  fields: [
    {
      name: 'text',
      title: 'Text',
      type: 'string',
    },
    {
      name: 'from',
      title: 'From',
      type: 'reference',
      to: [{ type: 'user' }],
    },
    {
      name: 'to',
      title: 'To',
      type: 'reference',
      to: [{ type: 'user' }],
    },
    {
      name: 'conversation',
      title: 'Conversation',
      type: 'reference',
      to: [{ type: 'conversation' }],
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    },
    {
      name: 'read',
      title: 'Read',
      type: 'boolean',
    },
    {
      name: 'attachments',
      title: 'Attachments',
      type: 'array',
      of: [{ type: 'file' }, { type: 'image' }],
    },
  ],
  orderings: [
    {
      title: 'Recent first',
      name: 'recent',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
}
