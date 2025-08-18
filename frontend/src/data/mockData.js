// Mock data for Discord clone

export const mockUser = {
  id: '1',
  username: 'YourUsername',
  discriminator: '1234',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
  status: 'online'
};

export const mockServers = [
  {
    id: 'server1',
    name: 'React Developers',
    icon: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=48&h=48&fit=crop',
    members: 1520
  },
  {
    id: 'server2', 
    name: 'Gaming Hub',
    icon: null,
    members: 850
  },
  {
    id: 'server3',
    name: 'Study Group',
    icon: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=48&h=48&fit=crop',
    members: 45
  }
];

export const mockChannels = {
  text: [
    { 
      id: 'general', 
      name: 'general', 
      topic: 'General discussion about everything',
      notifications: false 
    },
    { 
      id: 'random', 
      name: 'random', 
      topic: 'Random stuff and memes',
      notifications: true 
    },
    { 
      id: 'announcements', 
      name: 'announcements', 
      topic: 'Important announcements',
      notifications: false 
    },
    { 
      id: 'help', 
      name: 'help', 
      topic: 'Get help from the community',
      notifications: false 
    }
  ],
  voice: [
    { 
      id: 'general-voice', 
      name: 'General', 
      users: [] 
    },
    { 
      id: 'gaming-voice', 
      name: 'Gaming', 
      users: ['user1', 'user2'] 
    },
    { 
      id: 'music-voice', 
      name: 'Music', 
      users: [] 
    }
  ]
};

export const mockMessages = {
  'general': [
    {
      id: 'msg1',
      content: 'Hey everyone! Welcome to our Discord server 🎉',
      author: {
        id: 'user1',
        username: 'Alice Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
      },
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'msg2', 
      content: 'Thanks! Excited to be here and connect with fellow developers.',
      author: {
        id: 'user2',
        username: 'Bob Smith',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
      },
      timestamp: new Date(Date.now() - 3500000).toISOString()
    },
    {
      id: 'msg3',
      content: 'Same here! Looking forward to sharing some cool projects.',
      author: {
        id: 'user3',
        username: 'Carol Wilson', 
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
      },
      timestamp: new Date(Date.now() - 3400000).toISOString()
    },
    {
      id: 'msg4',
      content: 'Has anyone worked with the new React 19 features? I\'m particularly interested in the new compiler.',
      author: {
        id: 'user2',
        username: 'Bob Smith',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
      },
      timestamp: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'msg5',
      content: 'Yes! I\'ve been experimenting with it in my side project. The automatic memoization is incredible.',
      author: {
        id: 'user1',
        username: 'Alice Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
      },
      timestamp: new Date(Date.now() - 1700000).toISOString()
    }
  ],
  'random': [
    {
      id: 'msg6',
      content: 'Check out this cool animation I made! What do you think?',
      author: {
        id: 'user3',
        username: 'Carol Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
      },
      timestamp: new Date(Date.now() - 900000).toISOString(),
      attachments: [{
        name: 'animation.gif',
        url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop'
      }]
    }
  ],
  'announcements': [
    {
      id: 'msg7',
      content: '📢 Server Update: We\'ve added new channels for different programming languages! Check them out.',
      author: {
        id: 'admin1',
        username: 'ServerAdmin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
      },
      timestamp: new Date(Date.now() - 86400000).toISOString()
    }
  ],
  'dm-0': [
    {
      id: 'dm1',
      content: 'Hey! How\'s your new project coming along?',
      author: {
        id: 'user1', 
        username: 'Alice Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
      },
      timestamp: new Date(Date.now() - 300000).toISOString()
    },
    {
      id: 'dm2',
      content: 'It\'s going well! Just finished implementing the authentication system.',
      author: {
        id: '1',
        username: 'YourUsername', 
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
      },
      timestamp: new Date(Date.now() - 120000).toISOString()
    }
  ]
};

export const mockDirectMessages = [
  {
    id: 'dm-0',
    name: 'Alice Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    status: 'online',
    lastMessage: 'Hey! How\'s your new project coming along?',
    timestamp: new Date(Date.now() - 300000).toISOString()
  },
  {
    id: 'dm-1', 
    name: 'Bob Smith',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    status: 'idle',
    lastMessage: 'Thanks for the code review!',
    timestamp: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'dm-2',
    name: 'Carol Wilson', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    status: 'dnd',
    lastMessage: 'See you at the meeting tomorrow',
    timestamp: new Date(Date.now() - 86400000).toISOString()  
  }
];

export const getChannelInfo = (channelId, activeServer) => {
  if (channelId?.startsWith('dm-')) {
    const dmIndex = parseInt(channelId.split('-')[1]);
    return mockDirectMessages[dmIndex];
  }
  
  if (activeServer === 'dm') {
    return null;
  }

  // Find in text channels
  const textChannel = mockChannels.text.find(c => c.id === channelId);
  if (textChannel) {
    return { ...textChannel, type: 'text' };
  }

  // Find in voice channels  
  const voiceChannel = mockChannels.voice.find(c => c.id === channelId);
  if (voiceChannel) {
    return { ...voiceChannel, type: 'voice' };
  }

  return null;
};