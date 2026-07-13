import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@context/AuthContext';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import GlassCard from '@components/ui/GlassCard';
import { HiMail, HiPaperAirplane, HiUser, HiChevronLeft } from 'react-icons/hi';
import { cn } from '@utils/cn';
import { formatDate } from '@utils/helpers';
import api from '@services/api';

interface Conversation {
  conversationId: string;
  lastMessage: {
    _id: string;
    sender: { _id: string; name: string; avatar?: string };
    receiver: { _id: string; name: string; avatar?: string };
    body: string;
    createdAt: string;
  };
  unreadCount: number;
}

interface Message {
  _id: string;
  sender: { _id: string; name: string; avatar?: string };
  receiver: { _id: string; name: string; avatar?: string };
  body: string;
  read: boolean;
  createdAt: string;
}

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(() => {
    api.get('/messages/conversations')
      .then((res) => setConversations(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  const fetchMessages = useCallback(async (convId: string) => {
    const res = await api.get(`/messages/conversations/${convId}`);
    setMessages(res.data.data);
    const unread = res.data.data.filter((m: Message) => m.receiver._id === user?._id && !m.read);
    for (const m of unread) {
      api.put(`/messages/${m._id}/read`).catch(() => {});
    }
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [user?._id]);

  useEffect(() => {
    if (selectedConv) fetchMessages(selectedConv);
  }, [selectedConv, fetchMessages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConv || sending) return;
    setSending(true);
    try {
      const otherId = (() => {
        const conv = conversations.find((c) => c.conversationId === selectedConv);
        if (!conv) return '';
        return conv.lastMessage.sender._id === user?._id
          ? conv.lastMessage.receiver._id
          : conv.lastMessage.sender._id;
      })();
      await api.post('/messages', { receiverId: otherId, body: newMessage.trim() });
      setNewMessage('');
      fetchMessages(selectedConv);
      fetchConversations();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const otherParticipant = (conv: Conversation) =>
    conv.lastMessage.sender._id === user?._id
      ? conv.lastMessage.receiver
      : conv.lastMessage.sender;

  return (
    <PageTransition>
      <div className="noise-bg" />
      <Navbar />
      <main className="pt-32">
        <section className="relative min-h-screen py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
          <div className="relative mx-auto max-w-7xl px-6">
            <h1 className="mb-6 text-2xl font-bold text-white">Messages</h1>
            <div className="grid gap-4 lg:grid-cols-3">
              {/* Conversation List */}
              <div className="rounded-xl border border-glass-light bg-luxury-charcoal/50 lg:col-span-1">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex flex-col items-center py-20 text-luxury-gray">
                    <HiMail size={32} className="mb-2" />
                    <p className="text-sm">No conversations yet.</p>
                  </div>
                ) : (
                  <div className="max-h-[600px] overflow-y-auto">
                    {conversations.map((conv) => {
                      const other = otherParticipant(conv);
                      return (
                        <button
                          key={conv.conversationId}
                          onClick={() => setSelectedConv(conv.conversationId)}
                          className={cn(
                            'flex w-full items-center gap-3 border-b border-glass-light/50 p-4 text-left transition-all hover:bg-glass-light/20',
                            selectedConv === conv.conversationId && 'bg-gold-500/10'
                          )}
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-sm font-bold text-gold-500">
                            {other.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate text-sm font-medium text-white">{other.name}</span>
                              <span className="shrink-0 text-xs text-luxury-gray">{formatDate(conv.lastMessage.createdAt)}</span>
                            </div>
                            <p className="truncate text-xs text-luxury-gray">{conv.lastMessage.body}</p>
                          </div>
                          {conv.unreadCount > 0 && (
                            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gold-500 px-1.5 text-xs font-bold text-luxury-black">
                              {conv.unreadCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Chat View */}
              <div className="flex flex-col rounded-xl border border-glass-light bg-luxury-charcoal/50 lg:col-span-2">
                {selectedConv && messages.length > 0 ? (
                  <>
                    <div className="flex-1 space-y-4 overflow-y-auto p-6 max-h-[500px]">
                      {messages.map((msg) => {
                        const isMine = msg.sender._id === user?._id;
                        return (
                          <div key={msg._id} className={cn('flex', isMine ? 'justify-end' : 'justify-start')}>
                            <div className={cn(
                              'max-w-[75%] rounded-2xl px-4 py-3',
                              isMine
                                ? 'rounded-br-md bg-gold-500 text-luxury-black'
                                : 'rounded-bl-md bg-luxury-dark text-white'
                            )}>
                              <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                              <p className={cn('mt-1 text-right text-xs', isMine ? 'text-luxury-black/60' : 'text-luxury-gray')}>
                                {formatDate(msg.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                    <div className="border-t border-glass-light p-4">
                      <div className="flex gap-3">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          rows={1}
                          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                          className="flex-1 resize-none rounded-xl border border-glass-light bg-luxury-black/50 px-4 py-2.5 text-sm text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                        />
                        <button
                          onClick={handleSend}
                          disabled={!newMessage.trim() || sending}
                          className="flex items-center gap-2 self-end rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-bold text-luxury-black transition-all hover:bg-gold-400 disabled:opacity-50"
                        >
                          {sending ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-luxury-black border-t-transparent" />
                          ) : (
                            <HiPaperAirplane size={16} className="rotate-90" />
                          )}
                          Send
                        </button>
                      </div>
                    </div>
                  </>
                ) : selectedConv ? (
                  <div className="flex items-center justify-center py-20 text-luxury-gray">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-luxury-gray">
                    <HiMail size={40} className="mb-3" />
                    <p className="text-sm">Select a conversation</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
