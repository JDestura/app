import React from 'react';
import { cn } from '../lib/utils';

const ServerList = ({ servers, activeServer, onServerSelect }) => {
  return (
    <div className="w-18 bg-gray-900 flex flex-col items-center py-3 space-y-2 overflow-y-auto">
      {/* Direct Messages */}
      <div 
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 relative group",
          activeServer === 'dm' 
            ? "bg-indigo-600 text-white rounded-2xl" 
            : "bg-gray-700 text-gray-300 hover:bg-indigo-600 hover:text-white hover:rounded-2xl"
        )}
        onClick={() => onServerSelect('dm')}
      >
        <div className="text-lg font-semibold">DM</div>
        {activeServer === 'dm' && (
          <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full -translate-x-1" />
        )}
      </div>

      {/* Server Divider */}
      <div className="w-8 h-0.5 bg-gray-600 rounded" />

      {/* Servers */}
      {servers.map((server) => (
        <div
          key={server.id}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 relative group overflow-hidden",
            activeServer === server.id 
              ? "rounded-2xl" 
              : "hover:rounded-2xl"
          )}
          onClick={() => onServerSelect(server.id)}
        >
          {server.icon ? (
            <img 
              src={server.icon} 
              alt={server.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-gray-700 text-white w-full h-full flex items-center justify-center text-lg font-semibold">
              {server.name.charAt(0).toUpperCase()}
            </div>
          )}
          {activeServer === server.id && (
            <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full -translate-x-1" />
          )}
          
          {/* Tooltip */}
          <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
            {server.name}
          </div>
        </div>
      ))}

      {/* Add Server Button */}
      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-green-600 hover:rounded-2xl transition-all duration-200 text-green-400 hover:text-white group">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          Add a Server
        </div>
      </div>

      {/* Discover Servers Button */}
      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-green-600 hover:rounded-2xl transition-all duration-200 text-green-400 hover:text-white group">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          Explore Public Servers
        </div>
      </div>
    </div>
  );
};

export default ServerList;