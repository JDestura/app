import React, { useState, useRef, useEffect } from 'react';
import { Hash, Volume2, Users, Pin, Bell, Search, Inbox, HelpCircle, Plus, Gift, Smile, Paperclip, Send } from 'lucide-react';
import { cn } from '../lib/utils';

const Message = ({ message, isFirstInGroup, showAvatar }) => {
  return (
    <div className={cn("group hover:bg-gray-50/5 px-4 py-0.5 transition-colors", isFirstInGroup && "mt-4")}>
      <div className="flex items-start space-x-4">
        {showAvatar ? (
          <img 
            src={message.author.avatar} 
            alt={message.author.username}
            className="w-10 h-10 rounded-full mt-0.5"
          />
        ) : (
          <div className="w-10 flex-shrink-0 flex justify-center">
            <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity leading-5">
              {new Date(message.timestamp).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              })}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          {showAvatar && (
            <div className="flex items-baseline space-x-2 mb-0.5">
              <span className="text-white font-medium text-sm">{message.author.username}</span>
              <span className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric'
                }) + ' ' + new Date(message.timestamp).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })}
              </span>
            </div>
          )}
          <div className="text-gray-300 text-sm leading-relaxed break-words">
            {message.content}
          </div>
          {message.attachments && message.attachments.map((attachment, i) => (
            <div key={i} className="mt-2">
              <img 
                src={attachment.url} 
                alt={attachment.name}
                className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ChatArea = ({ activeChannel, channelInfo, messages, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!channelInfo) {
    return (
      <div className="flex-1 bg-gray-700 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Hash className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">Welcome to Discord!</h3>
          <p className="text-gray-400">Select a channel or start a direct message to begin chatting.</p>
        </div>
      </div>
    );
  }

  const isVoiceChannel = channelInfo.type === 'voice';
  const isDM = activeChannel?.startsWith('dm-');

  return (
    <div className="flex-1 bg-gray-700 flex flex-col">
      {/* Channel Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-gray-600 shadow-sm">
        <div className="flex items-center space-x-3">
          {isDM ? (
            <>
              <img 
                src={channelInfo.avatar} 
                alt={channelInfo.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-white font-semibold">{channelInfo.name}</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-xs text-gray-400">Online</span>
              </div>
            </>
          ) : (
            <>
              {isVoiceChannel ? (
                <Volume2 className="w-5 h-5 text-gray-400" />
              ) : (
                <Hash className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-white font-semibold">{channelInfo.name}</span>
              {channelInfo.topic && (
                <>
                  <div className="w-px h-6 bg-gray-600" />
                  <span className="text-gray-400 text-sm">{channelInfo.topic}</span>
                </>
              )}
            </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {!isDM && !isVoiceChannel && (
            <>
              <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
              <Pin className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
              <Users className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
            </>
          )}
          <Search className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
          <Inbox className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
          <HelpCircle className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-end p-4">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-4">
                {isDM ? (
                  <img src={channelInfo.avatar} alt={channelInfo.name} className="w-full h-full rounded-full" />
                ) : isVoiceChannel ? (
                  <Volume2 className="w-8 h-8 text-gray-400" />
                ) : (
                  <Hash className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <h3 className="text-white text-2xl font-bold mb-2">
                {isDM ? `This is the beginning of your direct message history with ${channelInfo.name}.` 
                      : `Welcome to #${channelInfo.name}!`}
              </h3>
              <p className="text-gray-400">
                {isDM ? `No shared servers with ${channelInfo.name}.` 
                      : `This is the start of the #${channelInfo.name} channel.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4">
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const isFirstInGroup = !prevMessage || 
                prevMessage.author.id !== message.author.id ||
                (new Date(message.timestamp) - new Date(prevMessage.timestamp)) > 5 * 60 * 1000;
              
              return (
                <Message
                  key={message.id}
                  message={message}
                  isFirstInGroup={isFirstInGroup}
                  showAvatar={isFirstInGroup}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      {!isVoiceChannel && (
        <div className="p-4">
          <div className="flex items-end space-x-3 bg-gray-600 rounded-lg p-3">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Plus className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${isDM ? channelInfo.name : '#' + channelInfo.name}`}
                className="w-full bg-transparent text-white placeholder-gray-400 text-sm border-none outline-none resize-none"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-white transition-colors">
                <Gift className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Smile className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Channel Controls (if voice channel) */}
      {isVoiceChannel && (
        <div className="p-4 bg-gray-800">
          <div className="text-center">
            <h3 className="text-white text-lg font-semibold mb-2">Voice Connected</h3>
            <p className="text-gray-400 text-sm mb-4">You are connected to {channelInfo.name}</p>
            <div className="flex justify-center space-x-4">
              <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors">
                Mute
              </button>
              <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors">
                Deafen
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;