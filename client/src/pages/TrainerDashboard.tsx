import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCalendar, HiUserGroup, HiClock, HiCheck, HiX, HiUserAdd, HiPhotograph, HiSave, HiUsers, HiMail, HiCollection, HiStar, HiPlus, HiChevronDown } from 'react-icons/hi';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import GlassCard from '@components/ui/GlassCard';
import { useAuth } from '@context/AuthContext';
import api from '@services/api';
import type { TrainerRequest } from '@/types';

interface Session {
  _id: string;
  user: { name: string; email: string; avatar?: string };
  program?: { title: string; slug: string };
  date: string;
  time: string;
  status: string;
  type: string;
}

export default function TrainerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'clients' | 'profile'>('overview');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<TrainerRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [clients, setClients] = useState<TrainerRequest[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [assignModalClient, setAssignModalClient] = useState<any>(null);

  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '', bio: '', specialties: '', experience: 0, phone: '', available: true,
    socialLinks: { instagram: '', facebook: '', twitter: '', linkedin: '' },
  });

  useEffect(() => {
    api.get('/bookings/trainer-sessions')
      .then((res) => setSessions(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'requests') {
      setRequestsLoading(true);
      api.get('/trainers/requests')
        .then((res) => setRequests(res.data.data || []))
        .catch(console.error)
        .finally(() => setRequestsLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'clients') {
      setClientsLoading(true);
      api.get('/trainers/clients')
        .then((res) => setClients(res.data.data || []))
        .catch(console.error)
        .finally(() => setClientsLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'profile') {
      setProfileLoading(true);
      api.get('/trainers/profile')
        .then((res) => {
          const p = res.data.data;
          setProfile(p);
          setProfileForm({
            name: p.name || '',
            bio: p.bio || '',
            specialties: p.specialties?.join(', ') || '',
            experience: p.experience || 0,
            phone: p.phone || '',
            available: p.available ?? true,
            socialLinks: {
              instagram: p.socialLinks?.instagram || '',
              facebook: p.socialLinks?.facebook || '',
              twitter: p.socialLinks?.twitter || '',
              linkedin: p.socialLinks?.linkedin || '',
            },
          });
        })
        .catch(console.error)
        .finally(() => setProfileLoading(false));
    }
  }, [activeTab]);

  const handleApproveRequest = async (id: string) => {
    setActionLoading(id);
    try {
      await api.put(`/trainers/requests/${id}/approve`);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to approve request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRequest = async (id: string) => {
    setActionLoading(id);
    try {
      await api.put(`/trainers/requests/${id}/reject`);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to reject request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const specialties = profileForm.specialties.split(',').map((s) => s.trim()).filter(Boolean);
      await api.put('/trainers/profile', { ...profileForm, specialties });
      setSaving(false);
      alert('Profile updated successfully!');
    } catch (err: any) {
      setSaving(false);
      alert(err?.response?.data?.message || 'Failed to update profile');
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const upcoming = sessions.filter((s) => s.date >= today && s.status !== 'cancelled');
  const completed = sessions.filter((s) => s.status === 'completed');
  const totalClients = new Set(sessions.map((s) => s.user?.email).filter(Boolean)).size;

  const tabs = [
    { key: 'overview' as const, label: 'Overview', icon: HiCalendar },
    { key: 'requests' as const, label: 'Requests', icon: HiUserAdd },
    { key: 'clients' as const, label: 'My Clients', icon: HiUsers },
    { key: 'profile' as const, label: 'Profile', icon: HiPhotograph },
  ];

  return (
    <PageTransition>
      <div className="noise-bg" />
      <Navbar />
      <main className="pt-32">
        <section className="relative min-h-screen py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white">Trainer Dashboard</h1>
              <p className="mt-1 text-luxury-gray">Welcome back, {user?.name || 'Trainer'}</p>
            </div>

            <div className="mb-8 flex gap-2 border-b border-glass-light">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                    activeTab === tab.key
                      ? 'border-gold-500 text-gold-500'
                      : 'border-transparent text-luxury-gray hover:text-white'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
                  {[
                    { label: 'Upcoming Sessions', value: upcoming.length, icon: HiCalendar },
                    { label: 'Total Clients', value: totalClients, icon: HiUserGroup },
                    { label: 'Completed', value: completed.length, icon: HiCheck },
                    { label: 'Hours This Week', value: `${upcoming.length * 1}h`, icon: HiClock },
                  ].map((stat) => (
                    <GlassCard key={stat.label} hover={false} className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/20">
                          <stat.icon className="text-gold-500" size={24} />
                        </div>
                        <div>
                          <p className="text-sm text-luxury-gray">{stat.label}</p>
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                  <button onClick={() => navigate('/trainer/contacts')} className="text-left">
                    <GlassCard hover={false} className="p-6 transition-all hover:border-gold-500/30">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                          <HiMail className="text-blue-500" size={24} />
                        </div>
                        <div>
                          <p className="text-sm text-luxury-gray">Messages</p>
                          <p className="text-2xl font-bold text-white">Contacts</p>
                        </div>
                      </div>
                    </GlassCard>
                  </button>
                </div>

                <GlassCard className="p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Upcoming Sessions</h2>
                    <span className="rounded-full bg-gold-500/10 px-3 py-1 text-xs font-medium text-gold-500">
                      {upcoming.length} session{upcoming.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {loading ? (
                    <p className="text-luxury-gray">Loading sessions...</p>
                  ) : upcoming.length === 0 ? (
                    <p className="text-luxury-gray">No upcoming sessions scheduled.</p>
                  ) : (
                    <div className="space-y-4">
                      {upcoming.map((session) => (
                        <div key={session._id} className="flex items-center justify-between rounded-xl bg-luxury-dark p-4 transition-all hover:bg-luxury-charcoal">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/20 text-sm font-bold text-gold-500">
                              {session.user?.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{session.user?.name}</p>
                              <div className="flex items-center gap-2 text-sm text-luxury-gray">
                                <span>{new Date(session.date).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{session.time}</span>
                                {session.program && (
                                  <><span>•</span><span className="text-gold-500">{session.program.title}</span></>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                              session.status === 'confirmed' ? 'bg-green-500/10 text-green-500'
                                : session.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500'
                                : 'bg-luxury-gray/10 text-luxury-gray'
                            }`}>
                              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                            </span>
                            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-500">{session.type}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>
              </>
            )}

            {activeTab === 'requests' && (
              <GlassCard className="p-8">
                <h2 className="mb-6 text-xl font-bold text-white">Client Requests</h2>
                {requestsLoading ? (
                  <p className="text-luxury-gray">Loading requests...</p>
                ) : requests.length === 0 ? (
                  <div className="flex flex-col items-center py-12">
                    <HiUserAdd className="text-luxury-gray/30" size={48} />
                    <p className="mt-4 text-luxury-gray">No pending client requests.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map((req) => (
                      <div key={req._id} className="flex items-center justify-between rounded-xl bg-luxury-dark p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/20 text-sm font-bold text-gold-500">
                            {req.user?.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{req.user?.name}</p>
                            <p className="text-sm text-luxury-gray">{req.user?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproveRequest(req._id)}
                            disabled={actionLoading === req._id}
                            className="flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-2 text-sm font-medium text-green-500 transition-all hover:bg-green-500/20 disabled:opacity-50"
                          >
                            <HiCheck size={16} /> Approve
                          </button>
                          <button
                            onClick={() => handleRejectRequest(req._id)}
                            disabled={actionLoading === req._id}
                            className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-500 transition-all hover:bg-red-500/20 disabled:opacity-50"
                          >
                            <HiX size={16} /> Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            )}

            {activeTab === 'clients' && (
              <div className="space-y-6">
                <GlassCard className="p-8">
                  <h2 className="mb-6 text-xl font-bold text-white">My Clients</h2>
                  {clientsLoading ? (
                    <p className="text-luxury-gray">Loading clients...</p>
                  ) : clients.length === 0 ? (
                    <div className="flex flex-col items-center py-12">
                      <HiUsers className="text-luxury-gray/30" size={48} />
                      <p className="mt-4 text-luxury-gray">No clients yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {clients.map((c) => (
                        <ClientCard key={c._id} client={c} onAssign={() => setAssignModalClient(c)} />
                      ))}
                    </div>
                  )}
                </GlassCard>
              </div>
            )}

            {activeTab === 'profile' && (
              <GlassCard className="p-8 max-w-2xl">
                <h2 className="mb-6 text-xl font-bold text-white">Trainer Profile</h2>
                {profileLoading ? (
                  <p className="text-luxury-gray">Loading profile...</p>
                ) : (
                  <div className="space-y-5">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-luxury-gray">Name</label>
                      <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-luxury-gray">Bio</label>
                      <textarea value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        rows={4}
                        className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500" />
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-luxury-gray">Specialties (comma-separated)</label>
                        <input type="text" value={profileForm.specialties} onChange={(e) => setProfileForm({ ...profileForm, specialties: e.target.value })}
                          className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-luxury-gray">Experience (years)</label>
                        <input type="number" value={profileForm.experience} onChange={(e) => setProfileForm({ ...profileForm, experience: parseInt(e.target.value) || 0 })}
                          min={0}
                          className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-luxury-gray">Phone</label>
                      <input type="text" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-luxury-gray">Social Links</label>
                      <div className="grid gap-3 md:grid-cols-2">
                        <input type="text" placeholder="Instagram URL" value={profileForm.socialLinks.instagram}
                          onChange={(e) => setProfileForm({ ...profileForm, socialLinks: { ...profileForm.socialLinks, instagram: e.target.value } })}
                          className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500" />
                        <input type="text" placeholder="Facebook URL" value={profileForm.socialLinks.facebook}
                          onChange={(e) => setProfileForm({ ...profileForm, socialLinks: { ...profileForm.socialLinks, facebook: e.target.value } })}
                          className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500" />
                        <input type="text" placeholder="Twitter URL" value={profileForm.socialLinks.twitter}
                          onChange={(e) => setProfileForm({ ...profileForm, socialLinks: { ...profileForm.socialLinks, twitter: e.target.value } })}
                          className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500" />
                        <input type="text" placeholder="LinkedIn URL" value={profileForm.socialLinks.linkedin}
                          onChange={(e) => setProfileForm({ ...profileForm, socialLinks: { ...profileForm.socialLinks, linkedin: e.target.value } })}
                          className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={profileForm.available}
                          onChange={(e) => setProfileForm({ ...profileForm, available: e.target.checked })}
                          className="h-4 w-4 rounded border-glass-light bg-luxury-charcoal text-gold-500 focus:ring-gold-500" />
                        <span className="text-sm text-luxury-gray">Available for new clients</span>
                      </label>
                    </div>
                    <button onClick={handleSaveProfile} disabled={saving}
                      className="flex items-center gap-2 rounded-xl bg-gold-500 px-6 py-3 text-sm font-bold text-luxury-black transition-all hover:bg-gold-400 disabled:opacity-50">
                      <HiSave size={18} /> {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                )}
              </GlassCard>
            )}
          </div>
        </section>
      </main>
      <Footer />
      {assignModalClient && (
        <AssignProgramModal
          client={assignModalClient}
          onClose={() => setAssignModalClient(null)}
          onAssigned={() => setAssignModalClient(null)}
        />
      )}
    </PageTransition>
  );
}

function ClientCard({ client, onAssign }: { client: any; onAssign: () => void }) {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [advancing, setAdvancing] = useState<string | null>(null);

  useEffect(() => {
    if (expanded) {
      setLoading(true);
      api.get(`/progress/client/${client.user._id}`)
        .then((res) => setPrograms(res.data.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [expanded, client.user._id]);

  const handleAdvance = async (progId: string) => {
    setAdvancing(progId);
    try {
      const res = await api.put(`/progress/${progId}/advance`);
      setPrograms((prev) => prev.map((p) => p._id === progId ? res.data.data : p));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to advance stage');
    } finally {
      setAdvancing(null);
    }
  };

  return (
    <div className="rounded-xl border border-glass-light bg-luxury-dark transition-all">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/20 text-sm font-bold text-gold-500">
            {client.user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-semibold text-white">{client.user?.name}</p>
            <p className="text-sm text-luxury-gray">{client.user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">Active</span>
          <HiChevronDown className={`text-luxury-gray transition-transform ${expanded ? 'rotate-180' : ''}`} size={18} />
        </div>
      </button>
      {expanded && (
        <div className="border-t border-glass-light/50 p-4">
          {loading ? (
            <p className="text-sm text-luxury-gray">Loading programs...</p>
          ) : programs.length === 0 ? (
            <p className="text-sm text-luxury-gray">No programs assigned yet.</p>
          ) : (
            <div className="space-y-3 mb-4">
              {programs.map((up: any) => {
                const total = up.stages?.length || 1;
                const completed = up.stages?.filter((s: any) => s.status === 'completed').length || 0;
                const pct = Math.round((completed / total) * 100);
                const stageName = up.program?.stages?.[up.currentStageIndex]?.title || `Stage ${up.currentStageIndex + 1}`;
                return (
                  <div key={up._id} className="rounded-lg bg-luxury-charcoal/50 p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{up.program?.title}</span>
                      <span className="text-xs text-gold-500">{pct}%</span>
                    </div>
                    <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-luxury-dark">
                      <div className="h-full rounded-full bg-gold-500" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-luxury-gray">{stageName} ({completed}/{total})</span>
                      {up.status !== 'completed' && (
                        <button
                          onClick={() => handleAdvance(up._id)}
                          disabled={advancing === up._id}
                          className="flex items-center gap-1 rounded-lg bg-gold-500/10 px-2.5 py-1 text-xs font-medium text-gold-500 hover:bg-gold-500/20 disabled:opacity-50"
                        >
                          {advancing === up._id ? '...' : <><HiStar size={12} /> Advance</>}
                        </button>
                      )}
                      {up.status === 'completed' && (
                        <span className="text-xs font-medium text-green-500">Completed</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => window.open(`/messages?user=${client.user._id}`, '_self')}
              className="flex items-center gap-1.5 rounded-lg border border-glass-light px-3 py-2 text-xs font-medium text-luxury-gray hover:border-gold-500/30 hover:text-gold-500"
            >
              <HiMail size={14} /> Message
            </button>
            <button
              onClick={onAssign}
              className="flex items-center gap-1.5 rounded-lg border border-glass-light px-3 py-2 text-xs font-medium text-luxury-gray hover:border-gold-500/30 hover:text-gold-500"
            >
              <HiPlus size={14} /> Assign Program
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AssignProgramModal({ client, onClose, onAssigned }: { client: any; onClose: () => void; onAssigned: () => void }) {
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/programs')
      .then((res) => setPrograms(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAssign = async () => {
    if (!selectedId) return;
    setSaving(true);
    try {
      await api.post('/progress', { userId: client.user._id, programId: selectedId });
      onAssigned();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to assign program');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-glass-light bg-luxury-charcoal p-6 shadow-2xl">
        <h3 className="mb-4 text-lg font-bold text-white">Assign Program to {client.user?.name}</h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
          </div>
        ) : (
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {programs.map((p) => (
              <button
                key={p._id}
                onClick={() => setSelectedId(p._id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                  selectedId === p._id
                    ? 'border-gold-500 bg-gold-500/10'
                    : 'border-glass-light bg-luxury-dark hover:border-gold-500/30'
                }`}
              >
                {p.image && <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" />}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">{p.title}</p>
                  <p className="text-xs text-luxury-gray">{p.duration} • {(p as any).stages?.length || 0} stages</p>
                </div>
              </button>
            ))}
          </div>
        )}
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-glass-light py-3 text-sm font-medium text-luxury-gray hover:bg-glass-light hover:text-white">Cancel</button>
          <button onClick={handleAssign} disabled={!selectedId || saving} className="flex-1 rounded-xl bg-gold-500 py-3 text-sm font-bold text-luxury-black hover:bg-gold-400 disabled:opacity-50">
            {saving ? 'Assigning...' : 'Assign Program'}
          </button>
        </div>
      </div>
    </div>
  );
}
