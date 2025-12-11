export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'userName',
      title: 'User Name',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'string',
    },
    {
      name: 'followers',
      title: 'Followers',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'user' }] }],
    },
    {
      name: 'following',
      title: 'Following',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'user' }] }],
    },
  ],
}
