'use client';

import { useState, useRef, useEffect } from 'react';
import { personas } from '@/lib/personas';
import { Send, User as UserIcon, MoreHorizontal, AlertCircle } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function Home() {
  const [activePersona, setActivePersona] = useState(personas[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handlePersonaChange = (personaId: string) => {
    const selected = personas.find((p) => p.id === personaId);
    if (selected) {
      setActivePersona(selected);
      setMessages([]);
      setError(null);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          systemPrompt: activePersona.systemPrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const newAssistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.text,
      };

      setMessages((prev) => [...prev, newAssistantMessage]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen text-gray-900 font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Scaler AI
          </h1>
          <p className="text-sm text-gray-500 mt-1">Persona-based Chat</p>
        </div>
        <div className="p-4 flex-1 overflow-y-auto space-y-2">
          {personas.map((persona) => (
            <button
              key={persona.id}
              onClick={() => handlePersonaChange(persona.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activePersona.id === persona.id
                ? 'bg-blue-50 text-blue-700 font-medium ring-1 ring-blue-200'
                : 'hover:bg-gray-100 text-gray-600'
                }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activePersona.id === persona.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
                  }`}
              >
                {persona.avatar}
              </div>
              <span className="truncate">{persona.name}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen">
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h1 className="font-bold text-lg text-blue-600">Scaler AI</h1>
          <select
            value={activePersona.id}
            onChange={(e) => handlePersonaChange(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
          >
            {personas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </header>

        <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm z-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md">
            {activePersona.avatar}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Chat with {activePersona.name}</h2>
            <p className="text-sm text-gray-500">{activePersona.description}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-inner">
                {activePersona.avatar}
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Start a conversation with {activePersona.name}
              </h3>
              <p className="text-gray-500 text-lg">
                Try asking one of the suggestions below or type your own question.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {activePersona.suggestionChips.map((chip, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(chip)}
                    className="bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto w-full">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-blue-600 text-white font-bold'
                      }`}
                  >
                    {message.role === 'user' ? <UserIcon size={20} /> : activePersona.avatar}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${message.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white border border-gray-100 rounded-tl-none text-gray-800'
                      }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm font-bold">
                    {activePersona.avatar}
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    </span>
                    <span className="text-gray-500 text-sm ml-2">
                      {activePersona.name.split(' ')[0]} is typing...
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="mx-6 p-4 mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r shadow-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Error communicating with AI</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="p-4 md:p-6 bg-white border-t border-gray-200">
          <div className="max-w-3xl mx-auto relative flex items-center">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }
              }}
              placeholder={`Message ${activePersona.name}...`}
              className="w-full bg-gray-50 border border-gray-300 rounded-2xl pl-4 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32 shadow-inner"
              rows={1}
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
              style={{ bottom: '8px' }}
            >
              <Send size={20} className={isLoading ? 'opacity-0' : 'opacity-100'} />
              {isLoading && (
                <MoreHorizontal size={20} className="absolute inset-0 m-auto animate-pulse" />
              )}
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            Press Enter to send, Shift + Enter for new line. Responses are generated by AI.
          </p>
        </div>
      </main>
    </div>
  );
}
