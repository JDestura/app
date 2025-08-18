import React from 'react';
import { ChevronDown, Hash, Volume2, Settings, UserPlus, Mic, Headphones, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '../lib/utils';

const ChannelList = ({ activeServer, channels, activeChannel, onChannelSelect, user }) => {
  const serverInfo = activeServer === 'dm' 
    ? { name: 'Direct Messages', icon: null }
    : { name: 'My Awesome Server', icon: null };

  return (
    <div className="w-60 bg-gray-800 flex flex-col">
      {/* Server Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-gray-700 hover:bg-gray-750 cursor-pointer transition-colors">
        <div className="flex items-center space-x-1">
          <h2 className="text-white font-semibold text-sm truncate">{serverInfo.name}</h2>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {activeServer === 'dm' ? (
          <div className="p-2">
            <div className="px-2 py-1 text-gray-400 text-xs font-medium uppercase tracking-wide">
              Direct Messages
            </div>
            <div className="space-y-0.5 mt-1">
              {[
                { name: 'Alice Johnson', status: 'online', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face' },
                { name: 'Bob Smith', status: 'idle', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face' },
                { name: 'Carol Wilson', status: 'dnd', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face' }
              ].map((friend, i) => (
                <div 
                  key={i}
                  className="flex items-center space-x-3 px-2 py-1 rounded hover:bg-gray-700 cursor-pointer text-gray-300 hover:text-white transition-colors"
                  onClick={() => onChannelSelect(`dm-${i}`)}
                >
                  <div className="relative">
                    <img src={friend.avatar} alt={friend.name} className="w-8 h-8 rounded-full" />
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-800",
                      friend.status === 'online' && "bg-green-400",
                      friend.status === 'idle' && "bg-yellow-400", 
                      friend.status === 'dnd' && "bg-red-400"
                    )} />
                  </div>
                  <span className="text-sm">{friend.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-2">
            {/* Text Channels */}
            <div className="px-2 py-1 text-gray-400 text-xs font-medium uppercase tracking-wide flex items-center justify-between group">
              <div className="flex items-center">
                <ChevronDown className="w-3 h-3 mr-1" />
                Text Channels
              </div>
              <UserPlus className="w-4 h-4 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-white transition-all" />
            </div>
            <div className="space-y-0.5 mt-1">
              {channels.text.map((channel) => (
                <div
                  key={channel.id}
                  className={cn(
                    "flex items-center space-x-2 px-2 py-1 rounded cursor-pointer transition-colors group",
                    activeChannel === channel.id 
                      ? "bg-gray-700 text-white" 
                      : "text-gray-400 hover:text-white hover:bg-gray-700"
                  )}
                  onClick={() => onChannelSelect(channel.id)}
                >
                  <Hash className="w-4 h-4" />
                  <span className="text-sm flex-1">{channel.name}</span>
                  {channel.notifications && (
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  )}
                </div>
              ))}
            </div>

            {/* Voice Channels */}
            <div className="px-2 py-1 text-gray-400 text-xs font-medium uppercase tracking-wide flex items-center justify-between group mt-4">
              <div className="flex items-center">
                <ChevronDown className="w-3 h-3 mr-1" />
                Voice Channels
              </div>
              <UserPlus className="w-4 h-4 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-white transition-all" />
            </div>
            <div className="space-y-0.5 mt-1">
              {channels.voice.map((channel) => (
                <div
                  key={channel.id}
                  className={cn(
                    "flex items-center space-x-2 px-2 py-1 rounded cursor-pointer transition-colors",
                    activeChannel === channel.id 
                      ? "bg-gray-700 text-white" 
                      : "text-gray-400 hover:text-white hover:bg-gray-700"
                  )}
                  onClick={() => onChannelSelect(channel.id)}
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="text-sm flex-1">{channel.name}</span>
                  {channel.users && channel.users.length > 0 && (
                    <span className="text-xs text-gray-500">{channel.users.length}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Panel */}
      <div className="h-14 bg-gray-900 flex items-center justify-between px-2">
        <div className="flex items-center space-x-2 flex-1">
          <div className="relative">
            <img 
              src={user.avatar} 
              alt={user.username} 
              className="w-8 h-8 rounded-full"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">{user.username}</div>
            <div className="text-gray-400 text-xs truncate">#{user.discriminator}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
            <Mic className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
            <Headphones className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelList;