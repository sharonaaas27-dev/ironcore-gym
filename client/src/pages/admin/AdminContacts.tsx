import { useState, useEffect, useCallback } from 'react';
import { HiMail, HiCheck, HiEye } from 'react-icons/hi';
import { cn } from '@utils/cn';
import api from '@services/api';
import { formatDate } from '@utils/helpers';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminContacts() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

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
        <div className="grid gap-4 lg:grid-cols-2">
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
          <div className="rounded-xl border border-glass-light bg-luxury-charcoal/50 p-6">
            {selected ? (
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">{selected.subject}</h3>
                    <p className="text-sm text-luxury-gray">{selected.name} &lt;{selected.email}&gt;</p>
                  </div>
                  <span className="text-xs text-luxury-gray">{formatDate(selected.createdAt)}</span>
                </div>
                <div className="mb-4 h-px bg-glass-light" />
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-white">{selected.message}</p>
                <div className="mt-6 flex items-center gap-2 text-xs text-luxury-gray">
                  <HiCheck size={14} />
                  {selected.read ? 'Read' : 'Unread'}
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
