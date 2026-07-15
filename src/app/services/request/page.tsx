"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, ArrowLeft, Check, Upload, X, FileText, FileVideo,
  FileImage, FileAudio, File, Loader2, CheckCircle2,
} from "lucide-react";

const STORAGE_KEY = "studio-request-form";

const steps = ["Project Details", "Upload Files", "Contact Information", "Review & Submit"];

interface FormData {
  services: string;
  projectTitle: string;
  projectDescription: string;
  preferredDate: string;
  budget: string;
  files: File[];
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
}

const initialData: FormData = {
  services: "",
  projectTitle: "",
  projectDescription: "",
  preferredDate: "",
  budget: "",
  files: [],
  fullName: "",
  email: "",
  phone: "",
  whatsapp: "",
};

function getFileIcon(name: string) {
  if (name.match(/\.(mp3|wav|ogg|m4a|flac)$/i)) return FileAudio;
  if (name.match(/\.(mp4|mov|avi|mkv)$/i)) return FileVideo;
  if (name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return FileImage;
  if (name.match(/\.pdf$/i)) return FileText;
  return File;
}

function StudioRequestContent() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("services") || "";

  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>({ ...initialData, services: serviceParam });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData((prev) => ({ ...prev, ...parsed, services: serviceParam || parsed.services, files: [] }));
      }
    } catch {}
  }, [serviceParam]);

  useEffect(() => {
    const toSave = { ...data, files: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [data]);

  const update = useCallback((field: keyof FormData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const addFiles = (newFiles: FileList | File[]) => {
    setData((prev) => ({ ...prev, files: [...prev.files, ...Array.from(newFiles)] }));
  };

  const removeFile = (index: number) => {
    setData((prev) => ({ ...prev, files: prev.files.filter((_, i) => i !== index) }));
  };

  const validate = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!data.services.trim()) e.services = "Please select at least one service";
      if (!data.projectTitle.trim()) e.projectTitle = "Project title is required";
      if (!data.projectDescription.trim()) e.projectDescription = "Description is required";
    }
    if (s === 2) {
      if (!data.fullName.trim()) e.fullName = "Full name is required";
      if (!data.email.trim()) e.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Invalid email format";
      if (!data.phone.trim()) e.phone = "Phone number is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate(step)) setStep((s) => Math.min(s + 1, 3));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!validate(2)) {
      setStep(2);
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("services", data.services);
      fd.append("projectTitle", data.projectTitle);
      fd.append("projectDescription", data.projectDescription);
      fd.append("preferredDate", data.preferredDate);
      fd.append("budget", data.budget);
      fd.append("fullName", data.fullName);
      fd.append("email", data.email);
      fd.append("phone", data.phone);
      fd.append("whatsapp", data.whatsapp);
      data.files.forEach((f) => fd.append("files", f));

      const res = await fetch("/api/studio-request", { method: "POST", body: fd });
      if (res.ok) {
        setSubmitted(true);
        localStorage.removeItem(STORAGE_KEY);
      } else {
        throw new Error("Failed");
      }
    } catch {
      setErrors({ submit: "Failed to submit. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-background">
          <Container>
            <div className="max-w-md mx-auto text-center py-20">
              <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] mb-3">Request Submitted!</h1>
              <p className="text-warm-white/50 mb-2">
                Thank you, <strong className="text-warm-white">{data.fullName}</strong>!
              </p>
              <p className="text-warm-white/50 mb-8">
                We&apos;ve received your studio request and sent a confirmation to <strong className="text-warm-white">{data.email}</strong>.
                Our team will get back to you within 24 hours.
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="gold" asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/services">View Studio Services</Link>
                </Button>
              </div>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 pb-8 bg-background">
          <Container>
            <Badge variant="gold" className="mb-4">Studio Request</Badge>
            <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-playfair)] mb-2">
              Submit Your <span className="gradient-text">Project</span>
            </h1>
            <p className="text-warm-white/50 mb-8">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>

            {/* Progress */}
            <div className="flex items-center gap-0 max-w-xl mb-10">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                      i < step ? "bg-gold text-charcoal" : i === step ? "bg-gold/20 border border-gold text-gold" : "bg-surface-lighter text-warm-white/30"
                    }`}>
                      {i < step ? <Check className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={`text-[10px] mt-1.5 text-center hidden sm:block ${i === step ? "text-gold" : "text-warm-white/30"}`}>
                      {s}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 rounded ${i < step ? "bg-gold" : "bg-surface-lighter"}`} />
                  )}
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="pb-24 bg-background">
          <Container>
            <div className="max-w-2xl mx-auto">
              {/* Step 0: Project Details */}
              {step === 0 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)] mb-4">Project Details</h2>
                  <div>
                    <label className="block text-sm text-warm-white/60 mb-1.5">Service(s) *</label>
                    <Input
                      value={data.services}
                      onChange={(e) => update("services", e.target.value)}
                      placeholder="e.g. Vocal Recording, Mixing & Mastering"
                      className={errors.services ? "border-red-500" : ""}
                    />
                    {errors.services && <p className="text-xs text-red-500 mt-1">{errors.services}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-warm-white/60 mb-1.5">Project Title *</label>
                    <Input
                      value={data.projectTitle}
                      onChange={(e) => update("projectTitle", e.target.value)}
                      placeholder="e.g. My Debut Single"
                      className={errors.projectTitle ? "border-red-500" : ""}
                    />
                    {errors.projectTitle && <p className="text-xs text-red-500 mt-1">{errors.projectTitle}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-warm-white/60 mb-1.5">Brief Description *</label>
                    <textarea
                      value={data.projectDescription}
                      onChange={(e) => update("projectDescription", e.target.value)}
                      placeholder="Describe your project, goals, and any specific requirements..."
                      rows={5}
                      className={`w-full rounded-lg bg-surface border border-border px-4 py-3 text-sm text-warm-white placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 resize-none ${errors.projectDescription ? "border-red-500" : ""}`}
                    />
                    {errors.projectDescription && <p className="text-xs text-red-500 mt-1">{errors.projectDescription}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-warm-white/60 mb-1.5">Preferred Completion Date</label>
                      <Input
                        type="date"
                        value={data.preferredDate}
                        onChange={(e) => update("preferredDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-warm-white/60 mb-1.5">Budget (Optional)</label>
                      <Input
                        value={data.budget}
                        onChange={(e) => update("budget", e.target.value)}
                        placeholder="e.g. 50,000 ETB"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Upload Files */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)] mb-4">Upload Files</h2>
                  <p className="text-sm text-warm-white/40">Upload any supporting files: audio, lyrics, scripts, videos, images, PDFs, or reference materials.</p>
                  <div
                    className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                      dragOver ? "border-gold bg-gold/5" : "border-border hover:border-gold/30"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-10 h-10 text-warm-white/20 mx-auto mb-3" />
                    <p className="text-sm text-warm-white/50 mb-1">Drag & drop files here, or click to browse</p>
                    <p className="text-xs text-warm-white/30">Audio, video, images, PDFs, documents</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }}
                    />
                  </div>
                  {data.files.length > 0 && (
                    <div className="space-y-2">
                      {data.files.map((f, i) => {
                        const Icon = getFileIcon(f.name);
                        return (
                          <div key={`${f.name}-${i}`} className="flex items-center gap-3 bg-surface border border-border rounded-lg px-3 py-2.5">
                            <Icon className="w-4 h-4 text-gold shrink-0" />
                            <span className="text-sm text-warm-white truncate flex-1">{f.name}</span>
                            <span className="text-xs text-warm-white/30">{(f.size / 1024).toFixed(0)} KB</span>
                            <button onClick={() => removeFile(i)} className="text-warm-white/30 hover:text-red-400 transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Contact Information */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)] mb-4">Contact Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm text-warm-white/60 mb-1.5">Full Name *</label>
                      <Input
                        value={data.fullName}
                        onChange={(e) => update("fullName", e.target.value)}
                        placeholder="John Doe"
                        className={errors.fullName ? "border-red-500" : ""}
                      />
                      {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-warm-white/60 mb-1.5">Email Address *</label>
                      <Input
                        type="email"
                        value={data.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="john@example.com"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-warm-white/60 mb-1.5">Phone Number *</label>
                      <Input
                        value={data.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="+251 911 223 344"
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-warm-white/60 mb-1.5">WhatsApp Number (Optional)</label>
                      <Input
                        value={data.whatsapp}
                        onChange={(e) => update("whatsapp", e.target.value)}
                        placeholder="+251 911 223 344"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)] mb-4">Review & Submit</h2>

                  <div className="bg-surface border border-border rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">Project Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-warm-white/40">Service(s)</span><span className="text-warm-white">{data.services || "—"}</span></div>
                      <div className="flex justify-between"><span className="text-warm-white/40">Project Title</span><span className="text-warm-white">{data.projectTitle || "—"}</span></div>
                      <div className="flex justify-between"><span className="text-warm-white/40">Preferred Date</span><span className="text-warm-white">{data.preferredDate || "—"}</span></div>
                      <div className="flex justify-between"><span className="text-warm-white/40">Budget</span><span className="text-warm-white">{data.budget || "—"}</span></div>
                    </div>
                    {data.projectDescription && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-xs text-warm-white/40 mb-1">Description</p>
                        <p className="text-sm text-warm-white/70">{data.projectDescription}</p>
                      </div>
                    )}
                  </div>

                  {data.files.length > 0 && (
                    <div className="bg-surface border border-border rounded-xl p-5">
                      <h3 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">Files ({data.files.length})</h3>
                      <div className="space-y-1.5">
                        {data.files.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-warm-white/60">
                            <Check className="w-3 h-3 text-green-500" />
                            {f.name} <span className="text-warm-white/30">({(f.size / 1024).toFixed(0)} KB)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-surface border border-border rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-warm-white/40">Name</span><span className="text-warm-white">{data.fullName || "—"}</span></div>
                      <div className="flex justify-between"><span className="text-warm-white/40">Email</span><span className="text-warm-white">{data.email || "—"}</span></div>
                      <div className="flex justify-between"><span className="text-warm-white/40">Phone</span><span className="text-warm-white">{data.phone || "—"}</span></div>
                      {data.whatsapp && (
                        <div className="flex justify-between"><span className="text-warm-white/40">WhatsApp</span><span className="text-warm-white">{data.whatsapp}</span></div>
                      )}
                    </div>
                  </div>

                  {errors.submit && <p className="text-sm text-red-500 text-center">{errors.submit}</p>}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
                {step > 0 ? (
                  <Button variant="outline" onClick={back}>
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                ) : (
                  <Button variant="outline" asChild>
                    <Link href="/services"><ArrowLeft className="w-4 h-4" /> Back to Studio</Link>
                  </Button>
                )}
                {step < 3 ? (
                  <Button variant="gold" onClick={next}>
                    Next <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button variant="gold" onClick={submit} disabled={submitting}>
                    {submitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                    ) : (
                      <>Submit Request <Check className="w-4 h-4" /></>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function StudioRequestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <StudioRequestContent />
    </Suspense>
  );
}
