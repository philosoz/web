"use client";

import { memo, useMemo } from "react";
import { ChatSession } from "@/lib/chat-storage";

interface ChatHistoryProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSwitchSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onToggleFavorite: (sessionId: string) => void;
  onNewSession: () => void;
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  } else if (days === 1) {
    return '昨天';
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  }
}

function getSessionPreview(session: ChatSession): string {
  if (session.summary) {
    return session.summary;
  }
  
  const userMessages = session.messages.filter(m => m.role === 'user');
  if (userMessages.length > 0) {
    return userMessages[0].content.slice(0, 30) + (userMessages[0].content.length > 30 ? '...' : '');
  }
  
  const assistantMessages = session.messages.filter(m => m.role === 'assistant');
  if (assistantMessages.length > 0) {
    return assistantMessages[0].content.slice(0, 30) + (assistantMessages[0].content.length > 30 ? '...' : '');
  }
  
  return '新会话';
}

function ChatHistoryComponent({
  sessions,
  currentSessionId,
  onSwitchSession,
  onDeleteSession,
  onToggleFavorite,
  onNewSession,
}: ChatHistoryProps) {
  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) {
        return a.isFavorite ? -1 : 1;
      }
      return b.updatedAt - a.updatedAt;
    });
  }, [sessions]);

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onNewSession}
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建会话
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sortedSessions.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p className="text-sm">暂无会话记录</p>
          </div>
        ) : (
          sortedSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => onSwitchSession(session.id)}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                session.id === currentSessionId
                  ? 'bg-blue-50 border-2 border-blue-300 shadow-sm'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {getSessionPreview(session)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(session.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(session.id);
                  }}
                  className="text-lg hover:scale-110 transition-transform flex-shrink-0"
                  title={session.isFavorite ? '取消收藏' : '收藏'}
                >
                  {session.isFavorite ? '⭐' : '☆'}
                </button>
              </div>

              {session.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {session.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        session.id === currentSessionId
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('确定要删除这个会话吗？')) {
                    onDeleteSession(session.id);
                  }
                }}
                className="mt-2 text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                删除会话
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
