"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare, Search, Mail, MailOpen,
  Trash2, Clock, User, Phone, Send, Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((data) => setMessages(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.subject && m.subject.toLowerCase().includes(search.toLowerCase()))
  );

  const unreadCount = messages.filter((m) => !m.read).length;
  const selected = messages.find((m) => m.id === selectedMsg);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
          Messages
        </h1>
        <p className="text-warm-white/40 mt-1">
          {unreadCount} unread message{unreadCount !== 1 && "s"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
            <input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <Card variant="glass" className="divide-y divide-border/50">
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 className="w-6 h-6 text-gold animate-spin mx-auto" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-10 h-10 text-warm-white/10 mx-auto mb-3" />
                <p className="text-warm-white/30 text-sm">No messages yet</p>
              </div>
            ) : (
              filtered.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMsg(msg.id)}
                  className={`w-full text-left p-4 transition-colors hover:bg-surface-light/50 ${
                    selectedMsg === msg.id ? "bg-surface-light/50 border-l-2 border-gold" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${msg.read ? "bg-transparent" : "bg-gold"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-warm-white truncate">{msg.name}</p>
                      <p className="text-xs text-warm-white/40 truncate">{msg.subject || "No subject"}</p>
                      <p className="text-[10px] text-warm-white/30 mt-1">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <Card variant="glass" className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-warm-white">{selected.subject || "No subject"}</h2>
                  <p className="text-sm text-warm-white/40 mt-1">From {selected.name}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <MailOpen className="w-3 h-3" /> Mark Read
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1 text-red-400">
                    <Trash2 className="w-3 h-3" /> Delete
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6 p-4 rounded-lg bg-surface-light/50 border border-border/50">
                <div className="flex items-center gap-2 text-sm text-warm-white/60">
                  <User className="w-4 h-4" /> {selected.name}
                </div>
                <div className="flex items-center gap-2 text-sm text-warm-white/60">
                  <Mail className="w-4 h-4" /> {selected.email}
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2 text-sm text-warm-white/60">
                    <Phone className="w-4 h-4" /> {selected.phone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-warm-white/60">
                  <Clock className="w-4 h-4" /> {new Date(selected.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="prose prose-invert max-w-none mb-6">
                <p className="text-sm text-warm-white/70 leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-sm font-medium text-warm-white/60 mb-3">Reply</h3>
                <textarea
                  placeholder="Type your reply..."
                  rows={4}
                  className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm placeholder:text-warm-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                />
                <div className="flex justify-end mt-3">
                  <Button variant="primary" className="gap-2">
                    <Send className="w-4 h-4" /> Send Reply
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card variant="glass" className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-warm-white/10 mx-auto mb-4" />
              <p className="text-warm-white/30">Select a message to read</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
