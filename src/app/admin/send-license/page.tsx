"use client";

import { useState, useRef } from "react";
import {
  ArrowLeft, Loader2, Send, Upload, FileText, CheckCircle,
  Building2, Mail, MessageSquare, AlertCircle, X,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SendLicensePage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    organizationName: "",
    contactPerson: "",
    email: "",
    subject: "",
    message: "",
  });
  const [files, setFiles] = useState<File[]>([]);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) {
      setFiles((prev) => [...prev, ...selected]);
      setError("");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.organizationName || !form.email || !form.subject || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    if (files.length === 0) {
      setError("Please attach at least one license document.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("to", form.email);
      formData.append("organizationName", form.organizationName);
      formData.append("subject", form.subject);
      formData.append("message", form.message);
      files.forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch("/api/admin/send-license", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card variant="glass" className="p-12 text-center">
          <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-warm-white mb-2">
            License Sent Successfully!
          </h2>
          <p className="text-warm-white/50 mb-8">
            {files.length} document{files.length !== 1 ? "s" : ""} sent to <strong className="text-warm-white">{form.email}</strong>.
            They can contact Ray Band for any questions.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setSent(false);
                setForm({ organizationName: "", contactPerson: "", email: "", subject: "", message: "" });
                setFiles([]);
                if (fileRef.current) fileRef.current.value = "";
              }}
            >
              Send Another
            </Button>
            <Link href="/admin">
              <Button variant="primary">Back to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin"
          className="p-2 rounded-lg hover:bg-surface-light transition-colors text-warm-white/60 hover:text-warm-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
            Send License
          </h1>
          <p className="text-warm-white/40 mt-1">
            Send license documents to organizations via email
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-deep-red/10 border border-deep-red/20 text-sm text-deep-red-light">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card variant="glass" className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-warm-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gold" />
            Organization Details
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Organization Name"
                placeholder="e.g. Sheraton Addis Ababa"
                value={form.organizationName}
                onChange={(e) => update("organizationName", e.target.value)}
                required
              />
              <Input
                label="Contact Person"
                placeholder="e.g. John Doe"
                value={form.contactPerson}
                onChange={(e) => update("contactPerson", e.target.value)}
              />
            </div>
            <Input
              label="Email Address"
              type="email"
              placeholder="organization@email.com"
              icon={<Mail className="w-4 h-4" />}
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>
        </Card>

        <Card variant="glass" className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-warm-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gold" />
            License Documents
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2">
                Upload Files
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-gold/30 hover:bg-gold/5 transition-all"
              >
                <Upload className="w-8 h-8 text-warm-white/30 mx-auto mb-2" />
                <p className="text-sm text-warm-white/50">
                  Click to upload PDF, images, or documents
                </p>
                <p className="text-xs text-warm-white/30 mt-1">
                  You can select multiple files at once
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-warm-white/40 uppercase tracking-wider">
                  {files.length} file{files.length !== 1 ? "s" : ""} selected
                </p>
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface-light border border-border"
                  >
                    <FileText className="w-5 h-5 text-gold shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-warm-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-warm-white/40">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 rounded-lg text-warm-white/40 hover:text-deep-red-light hover:bg-deep-red/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card variant="glass" className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-warm-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gold" />
            Email Message
          </h2>
          <div className="space-y-4">
            <Input
              label="Subject"
              placeholder="e.g. Official License Documents - Ray Band Entertainment"
              value={form.subject}
              onChange={(e) => update("subject", e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2">
                Message
              </label>
              <textarea
                rows={6}
                placeholder="Dear [Organization],&#10;&#10;Please find attached the required license documents. This certifies that Ray Band Entertainment is authorized to operate in accordance with local regulations.&#10;&#10;Should you have any questions, please do not hesitate to contact us.&#10;&#10;Best regards,&#10;Ray Band Entertainment"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm placeholder:text-warm-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                required
              />
            </div>
          </div>
        </Card>

        <div className="flex items-center gap-3 justify-end">
          <Link href="/admin">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send License{files.length > 1 ? "s" : ""}
          </Button>
        </div>
      </form>
    </div>
  );
}
