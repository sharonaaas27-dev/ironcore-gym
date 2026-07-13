import { useState, useEffect, useCallback } from 'react';
import { HiMail, HiCheck, HiEye, HiPaperAirplane, HiReply } from 'react-icons/hi';
import { cn } from '@utils/cn';
import api from '@services/api';
import { formatDate } from '@utils/helpers';
import { useAuth } from '@context/AuthContext';

interface Reply {
  _id: string;
  message: string;
  repliedBy: { _id: string; name: string };
  createdAt: string;
}

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  status: 'open' | 'replied';
  replies: Reply[];
  createdAt: string;
}

export default function AdminContacts() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [emailWarning, setEmailWarning] = useState('');

  const fetch = useCallback(() => {
    setLoading(true);
    api.get('/contact')
      .then((res) => setMessages(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/contact/${id}/read`);
      setMessages((prev) => prev.map((m) => m._id === id ? { ...m, read: true } : m));
    } catch (err) { console.error(err); }
  };

  const handleReply = async () => {
    if (!replyMessage.trim() || !selected || sending) return;
    setSending(true);
    try {
      setEmailWarning('');
      const res = await api.post(`/contact/${selected._id}/reply`, { message: replyMessage.trim() });
      const updated = res.data.data;
      setMessages((prev) => prev.map((m) => m._id === updated._id ? updated : m));
      setSelected(updated);
      setReplyMessage('');
      if (res.data.emailSent === false) {
        setEmailWarning('Reply saved but the email notification could not be sent to the user. Check SMTP configuration.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Contacts</h1>
        <p className="mt-1 text-sm text-luxury-gray">View and manage contact form submissions.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {/* List */}
          <div className="rounded-xl border border-glass-light bg-luxury-charcoal/50">
            {messages.length === 0 ? (
              <div className="p-12 text-center text-luxury-gray">No messages yet.</div>
            ) : (
              messages.map((msg) => (
                <button
                  key={msg._id}
                  onClick={() => { setSelected(msg); if (!msg.read) markAsRead(msg._id); }}
                  className={cn(
                    'flex w-full items-start gap-4 border-b border-glass-light/50 p-4 text-left transition-all hover:bg-glass-light/20',
                    !msg.read && 'bg-gold-500/5'
                  )}
                >
                  <div className={cn('mt-1 flex h-8 w-8 items-center justify-center rounded-full', msg.read ? 'bg-luxury-charcoal' : 'bg-gold-500/20')}>
                    <HiMail className={msg.read ? 'text-luxury-gray' : 'text-gold-500'} size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn('truncate text-sm', !msg.read ? 'font-bold text-white' : 'text-luxury-gray')}>{msg.name}</span>
                      <span className="shrink-0 text-xs text-luxury-gray">{formatDate(msg.createdAt)}</span>
                    </div>
                    <p className={cn('truncate text-sm', !msg.read ? 'text-white' : 'text-luxury-gray')}>{msg.subject}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-luxury-gray">{msg.message}</p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Detail */}
          <div className="flex flex-col rounded-xl border border-glass-light bg-luxury-charcoal/50">
            {selected ? (
              <div className="flex flex-1 flex-col">
                <div className="p-6 pb-0">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white">{selected.subject}</h3>
                        <span className={cn(
                          'rounded-full px-2.5 py-0.5 text-xs font-medium',
                          selected.status === 'open'
                            ? 'bg-yellow-500/10 text-yellow-500'
                            : 'bg-green-500/10 text-green-500'
                        )}>
                          {selected.status === 'open' ? 'Open' : 'Replied'}
                        </span>
                      </div>
                      <p className="text-sm text-luxury-gray">{selected.name} &lt;{selected.email}&gt;</p>
                    </div>
                    <span className="shrink-0 text-xs text-luxury-gray">{formatDate(selected.createdAt)}</span>
                  </div>
                  <div className="mb-4 h-px bg-glass-light" />
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-white">{selected.message}</p>

                  {/* Replies */}
                  {selected.replies.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <div className="h-px bg-glass-light" />
                      <p className="flex items-center gap-2 text-xs font-medium text-luxury-gray">
                        <HiReply size={14} />
                        Replies ({selected.replies.length})
                      </p>
                      {selected.replies.map((reply) => (
                        <div key={reply._id} className="rounded-lg border border-glass-light/50 bg-luxury-black/30 p-4">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-sm font-medium text-gold-500">
                              {reply.repliedBy?.name || 'Staff'}
                            </span>
                            <span className="text-xs text-luxury-gray">{formatDate(reply.createdAt)}</span>
                          </div>
                          <p className="whitespace-pre-wrap text-sm text-white">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Email Warning */}
                {emailWarning && (
                  <div className="mx-4 mt-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-400">
                    {emailWarning}
                  </div>
                )}
                {/* Reply Form */}
                <div className="mt-auto border-t border-glass-light p-4">
                  <div className="flex gap-3">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply..."
                      rows={2}
                      className="flex-1 resize-none rounded-xl border border-glass-light bg-luxury-black/50 px-4 py-2.5 text-sm text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                    />
                    <button
                      onClick={handleReply}
                      disabled={!replyMessage.trim() || sending}
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
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-luxury-gray">
                <HiEye size={32} className="mb-2" />
                <p className="text-sm">Select a message to view</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
