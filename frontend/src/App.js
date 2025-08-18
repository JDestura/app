import { useState } from "react";
import "./App.css";
import ServerList from "./components/ServerList";
import ChannelList from "./components/ChannelList";
import ChatArea from "./components/ChatArea";
import { mockUser, mockServers, mockChannels, mockMessages, getChannelInfo } from "./data/mockData";

function App() {
  const [activeServer, setActiveServer] = useState('server1');
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState(mockMessages[activeChannel] || []);

  const handleServerSelect = (serverId) => {
    setActiveServer(serverId);
    if (serverId === 'dm') {
      setActiveChannel(null);
      setMessages([]);
    } else {
      setActiveChannel('general');
      setMessages(mockMessages['general'] || []);
    }
  };

  const handleChannelSelect = (channelId) => {
    setActiveChannel(channelId);
    setMessages(mockMessages[channelId] || []);
  };

  const handleSendMessage = (content) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      content,
      author: mockUser,
      timestamp: new Date().toISOString()
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    
    // Update mock data for persistence during session
    mockMessages[activeChannel] = updatedMessages;
  };

  const channelInfo = getChannelInfo(activeChannel, activeServer);

  return (
    <div className="flex h-screen bg-gray-800 text-white overflow-hidden">
      <ServerList 
        servers={mockServers}
        activeServer={activeServer}
        onServerSelect={handleServerSelect}
      />
      <ChannelList
        activeServer={activeServer}
        channels={mockChannels}
        activeChannel={activeChannel}
        onChannelSelect={handleChannelSelect}
        user={mockUser}
      />
      <ChatArea
        activeChannel={activeChannel}
        channelInfo={channelInfo}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default App;
