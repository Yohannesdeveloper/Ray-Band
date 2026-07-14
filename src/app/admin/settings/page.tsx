"use client";

import { useState } from "react";
import {
  Save, Globe, Mail, Bell, Shield,
  CreditCard, Database,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "email", label: "Email", icon: Mail },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
          Settings
        </h1>
        <p className="text-warm-white/40 mt-1">
          Manage your platform configuration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tab Nav */}
        <Card variant="glass" className="p-2 h-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-warm-white/50 hover:text-warm-white hover:bg-surface-light"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </Card>

        {/* Tab Content */}
        <div className="lg:col-span-3">
          <Card variant="glass" className="p-6">
            {activeTab === "general" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-warm-white">General Settings</h2>
                <Input
                  label="Business Name"
                  defaultValue="Ray Band Entertainment"
                />
                <Input
                  label="Business Email"
                  type="email"
                    defaultValue="info@rayband.com"
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  defaultValue="+251911223344"
                />
                <Input
                  label="Address"
                  defaultValue="Bole, Addis Ababa, Ethiopia"
                />
                <Input
                  label="Website URL"
                  defaultValue="https://rayband.com"
                />
                <div>
                  <label className="text-sm text-warm-white/60 mb-2 block">Business Description</label>
                  <textarea
                    rows={4}
                    defaultValue="Premium live band entertainment, music academy, and event booking platform."
                    className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm placeholder:text-warm-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                  />
                </div>
                <Button variant="primary" className="gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-warm-white">Payment Settings</h2>
                <div className="p-4 rounded-lg bg-surface-light/50 border border-border/50">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="w-5 h-5 text-gold" />
                    <h3 className="font-medium text-warm-white">Chapa Integration</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                      Connected
                    </span>
                  </div>
                  <p className="text-sm text-warm-white/40 mb-4">
                    Chapa is your payment gateway. Configure keys and webhook settings.
                  </p>
                  <Input
                    label="Chapa Secret Key"
                    type="password"
                    defaultValue="CHASECK-test-XXXXXXXXXXXXXXXX"
                  />
                  <Input
                    label="Webhook Secret"
                    type="password"
                    className="mt-4"
                  />
                </div>
                <div className="p-4 rounded-lg bg-surface-light/50 border border-border/50">
                  <h3 className="font-medium text-warm-white mb-3">Accepted Payment Methods</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["Telebirr", "CBE Birr", "M-Pesa", "Credit/Debit Card", "Bank Transfer"].map((method) => (
                      <label key={method} className="flex items-center gap-2 text-sm text-warm-white/60 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded accent-gold" />
                        {method}
                      </label>
                    ))}
                  </div>
                </div>
                <Button variant="primary" className="gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            )}

            {activeTab === "email" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-warm-white">Email Settings</h2>
                <Input
                  label="SMTP Host"
                  defaultValue="smtp.gmail.com"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="SMTP Port"
                    defaultValue="587"
                  />
                  <Input
                    label="SMTP Username"
defaultValue="info@rayband.com"
                  />
                </div>
                <Input
                  label="SMTP Password"
                  type="password"
                />
                <div>
                  <h3 className="font-medium text-warm-white mb-3">Email Templates</h3>
                  <div className="space-y-2">
                    {["Booking Confirmation", "Payment Receipt", "Course Enrollment", "Newsletter"].map((template) => (
                      <div key={template} className="flex items-center justify-between p-3 rounded-lg bg-surface-light/50 border border-border/50">
                        <span className="text-sm text-warm-white/70">{template}</span>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    ))}
                  </div>
                </div>
                <Button variant="primary" className="gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-warm-white">Notification Settings</h2>
                <div className="space-y-3">
                  {[
                    { label: "New booking request", desc: "Get notified when a new booking comes in" },
                    { label: "Payment received", desc: "Get notified when a payment is confirmed" },
                    { label: "New course enrollment", desc: "Get notified when a student enrolls" },
                    { label: "Contact form submission", desc: "Get notified when someone contacts you" },
                    { label: "Course review", desc: "Get notified when a student leaves a review" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-surface-light/50 border border-border/50">
                      <div>
                        <p className="text-sm text-warm-white">{item.label}</p>
                        <p className="text-xs text-warm-white/40">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-9 h-5 bg-surface-light rounded-full peer peer-checked:bg-gold/30 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-warm-white/40 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:bg-gold" />
                      </label>
                    </div>
                  ))}
                </div>
                <Button variant="primary" className="gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-warm-white">Security Settings</h2>
                <div className="p-4 rounded-lg bg-surface-light/50 border border-border/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-5 h-5 text-gold" />
                    <h3 className="font-medium text-warm-white">Authentication</h3>
                  </div>
                  <p className="text-sm text-warm-white/40 mb-2">
                    Authentication is managed by Clerk. Users sign in via Clerk&apos;s hosted UI.
                  </p>
                  <p className="text-xs text-warm-white/30">
                    Configure allowed sign-in methods, MFA, and session settings in your Clerk Dashboard.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-surface-light/50 border border-border/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Database className="w-5 h-5 text-gold" />
                    <h3 className="font-medium text-warm-white">Database</h3>
                  </div>
                  <p className="text-sm text-warm-white/40">
                    SQLite database for development. Switch to PostgreSQL for production.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
