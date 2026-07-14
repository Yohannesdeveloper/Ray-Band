import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Building2,
  ArrowLeft,
  Edit,
  Globe,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Share2,
  Users,
  Handshake,
  MessageSquare,
  FileText,
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  PhoneCall,
  Video,
  StickyNote,
  Link2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const statusColors: Record<string, string> = {
  prospect: "bg-gray-500/10 text-gray-400",
  initial_contact: "bg-blue-500/10 text-blue-400",
  discovery_meeting: "bg-cyan-500/10 text-cyan-400",
  proposal_sent: "bg-amber-500/10 text-amber-400",
  negotiation: "bg-orange-500/10 text-orange-400",
  approved: "bg-green-500/10 text-green-400",
  rejected: "bg-red-500/10 text-red-400",
  active: "bg-emerald-500/10 text-emerald-400",
  renewed: "bg-violet-500/10 text-violet-400",
  closed: "bg-gray-500/10 text-gray-400",
};

const statusLabels: Record<string, string> = {
  prospect: "Prospect",
  initial_contact: "Initial Contact",
  discovery_meeting: "Discovery Meeting",
  proposal_sent: "Proposal Sent",
  negotiation: "Negotiation",
  approved: "Approved",
  rejected: "Rejected",
  active: "Active",
  renewed: "Renewed",
  closed: "Closed",
};

const sponsorshipStatusColors: Record<string, string> = {
  proposed: "bg-amber-500/10 text-amber-400",
  approved: "bg-green-500/10 text-green-400",
  active: "bg-emerald-500/10 text-emerald-400",
  completed: "bg-blue-500/10 text-blue-400",
  cancelled: "bg-red-500/10 text-red-400",
};

const commTypeIcons: Record<string, typeof Mail> = {
  email: Mail,
  phone: PhoneCall,
  meeting: Video,
  note: StickyNote,
  follow_up: Clock,
};

export const dynamic = "force-dynamic";

export default async function SponsorDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const tab = sp.tab || "overview";

  const sponsor = await db.sponsor.findUnique({
    where: { id },
    include: {
      contacts: { orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }] },
      sponsorships: { orderBy: { createdAt: "desc" } },
      communications: { orderBy: { createdAt: "desc" } },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!sponsor) notFound();

  let socialMedia: Record<string, string> = {};
  try {
    if (sponsor.socialMedia) socialMedia = JSON.parse(sponsor.socialMedia);
  } catch {}

  let tags: string[] = [];
  try {
    if (sponsor.tags) tags = JSON.parse(sponsor.tags);
  } catch {}

  const tabs = [
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "contacts", label: "Contacts", icon: Users },
    { id: "sponsorships", label: "Sponsorships", icon: Handshake },
    { id: "communications", label: "Communications", icon: MessageSquare },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/sponsors"
          className="flex items-center gap-2 text-sm text-warm-white/40 hover:text-warm-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sponsors
        </Link>
      </div>

      <Card variant="glass" className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center flex-shrink-0">
            {sponsor.logoUrl ? (
              <img
                src={sponsor.logoUrl}
                alt={sponsor.companyName}
                className="w-16 h-16 rounded-2xl object-cover"
              />
            ) : (
              <Building2 className="w-8 h-8 text-gold/60" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
                {sponsor.companyName}
              </h1>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  statusColors[sponsor.status] || "bg-gray-500/10 text-gray-400"
                }`}
              >
                {statusLabels[sponsor.status] || sponsor.status}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-warm-white/50 flex-wrap">
              {sponsor.industry && (
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" /> {sponsor.industry}
                </span>
              )}
              {sponsor.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {sponsor.city},{" "}
                  {sponsor.country}
                </span>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold text-gold">
              {formatCurrency(sponsor.totalValue, sponsor.currency)}
            </p>
            <p className="text-xs text-warm-white/40">Total Value</p>
          </div>
          <Link href={`/admin/sponsors/${sponsor.id}/edit`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="w-3.5 h-3.5" /> Edit
            </Button>
          </Link>
        </div>
      </Card>

      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`/admin/sponsors/${sponsor.id}?tab=${t.id}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              tab === t.id
                ? "bg-gold/15 text-gold border border-gold/30"
                : "text-warm-white/40 hover:text-warm-white hover:bg-surface-light border border-transparent"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
            {t.id === "contacts" && sponsor.contacts.length > 0 && (
              <span className="ml-1 text-[10px] bg-surface-light px-1.5 py-0.5 rounded-full">
                {sponsor.contacts.length}
              </span>
            )}
            {t.id === "sponsorships" && sponsor.sponsorships.length > 0 && (
              <span className="ml-1 text-[10px] bg-surface-light px-1.5 py-0.5 rounded-full">
                {sponsor.sponsorships.length}
              </span>
            )}
            {t.id === "communications" && sponsor.communications.length > 0 && (
              <span className="ml-1 text-[10px] bg-surface-light px-1.5 py-0.5 rounded-full">
                {sponsor.communications.length}
              </span>
            )}
          </Link>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card variant="glass" className="p-6">
              <h3 className="font-bold text-warm-white mb-4">Company Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sponsor.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-warm-white/30" />
                    <div>
                      <p className="text-warm-white/40 text-xs">Email</p>
                      <p className="text-warm-white">{sponsor.email}</p>
                    </div>
                  </div>
                )}
                {sponsor.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-warm-white/30" />
                    <div>
                      <p className="text-warm-white/40 text-xs">Phone</p>
                      <p className="text-warm-white">{sponsor.phone}</p>
                    </div>
                  </div>
                )}
                {sponsor.website && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="w-4 h-4 text-warm-white/30" />
                    <div>
                      <p className="text-warm-white/40 text-xs">Website</p>
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold hover:underline flex items-center gap-1"
                      >
                        {sponsor.website.replace(/^https?:\/\//, "")}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
                {sponsor.address && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-warm-white/30" />
                    <div>
                      <p className="text-warm-white/40 text-xs">Address</p>
                      <p className="text-warm-white">{sponsor.address}</p>
                    </div>
                  </div>
                )}
                {sponsor.taxId && (
                  <div className="flex items-center gap-3 text-sm">
                    <CreditCard className="w-4 h-4 text-warm-white/30" />
                    <div>
                      <p className="text-warm-white/40 text-xs">Tax ID</p>
                      <p className="text-warm-white">{sponsor.taxId}</p>
                    </div>
                  </div>
                )}
              </div>

              {Object.values(socialMedia).some((v) => v) && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-xs text-warm-white/40 mb-2 flex items-center gap-1">
                    <Share2 className="w-3 h-3" /> Social Media
                  </p>
                  <div className="flex gap-3">
                    {socialMedia.facebook && (
                      <a
                        href={socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] px-2 py-1 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                      >
                        Facebook
                      </a>
                    )}
                    {socialMedia.instagram && (
                      <a
                        href={socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] px-2 py-1 rounded bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 transition-colors"
                      >
                        Instagram
                      </a>
                    )}
                    {socialMedia.twitter && (
                      <a
                        href={socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] px-2 py-1 rounded bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-colors"
                      >
                        Twitter/X
                      </a>
                    )}
                    {socialMedia.linkedin && (
                      <a
                        href={socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] px-2 py-1 rounded bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-colors"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}

              {tags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {sponsor.notes && (
              <Card variant="glass" className="p-6">
                <h3 className="font-bold text-warm-white mb-3">Notes</h3>
                <p className="text-sm text-warm-white/60 whitespace-pre-wrap">
                  {sponsor.notes}
                </p>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card variant="glass" className="p-6">
              <h3 className="font-bold text-warm-white mb-4">Key Personnel</h3>
              <div className="space-y-3">
                {sponsor.ceoName && (
                  <div>
                    <p className="text-[10px] text-warm-white/40 uppercase tracking-wider">
                      CEO
                    </p>
                    <p className="text-sm text-warm-white">{sponsor.ceoName}</p>
                  </div>
                )}
                {sponsor.marketingDirector && (
                  <div>
                    <p className="text-[10px] text-warm-white/40 uppercase tracking-wider">
                      Marketing Director
                    </p>
                    <p className="text-sm text-warm-white">
                      {sponsor.marketingDirector}
                    </p>
                  </div>
                )}
                {sponsor.brandManager && (
                  <div>
                    <p className="text-[10px] text-warm-white/40 uppercase tracking-wider">
                      Brand Manager
                    </p>
                    <p className="text-sm text-warm-white">{sponsor.brandManager}</p>
                  </div>
                )}
                {sponsor.prManager && (
                  <div>
                    <p className="text-[10px] text-warm-white/40 uppercase tracking-wider">
                      PR Manager
                    </p>
                    <p className="text-sm text-warm-white">{sponsor.prManager}</p>
                  </div>
                )}
                {sponsor.sponsorshipManager && (
                  <div>
                    <p className="text-[10px] text-warm-white/40 uppercase tracking-wider">
                      Sponsorship Manager
                    </p>
                    <p className="text-sm text-warm-white">
                      {sponsor.sponsorshipManager}
                    </p>
                  </div>
                )}
                {sponsor.financeOfficer && (
                  <div>
                    <p className="text-[10px] text-warm-white/40 uppercase tracking-wider">
                      Finance Officer
                    </p>
                    <p className="text-sm text-warm-white">
                      {sponsor.financeOfficer}
                    </p>
                  </div>
                )}
                {!sponsor.ceoName &&
                  !sponsor.marketingDirector &&
                  !sponsor.brandManager &&
                  !sponsor.prManager &&
                  !sponsor.sponsorshipManager &&
                  !sponsor.financeOfficer && (
                    <p className="text-sm text-warm-white/30">
                      No key personnel added yet
                    </p>
                  )}
              </div>
            </Card>

            <Card variant="glass" className="p-6">
              <h3 className="font-bold text-warm-white mb-3">Recent Activity</h3>
              {sponsor.communications.length > 0 ? (
                <div className="space-y-3">
                  {sponsor.communications.slice(0, 5).map((comm) => {
                    const Icon = commTypeIcons[comm.type] || MessageSquare;
                    return (
                      <div
                        key={comm.id}
                        className="flex items-start gap-3 text-sm"
                      >
                        <Icon className="w-4 h-4 text-warm-white/30 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-warm-white truncate">
                            {comm.subject || comm.content.slice(0, 50)}
                          </p>
                          <p className="text-[10px] text-warm-white/30">
                            {formatDate(comm.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-warm-white/30">No activity yet</p>
              )}
            </Card>

            <Card variant="glass" className="p-6">
              <h3 className="font-bold text-warm-white mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-warm-white/40">Contacts</span>
                  <span className="text-warm-white font-medium">
                    {sponsor.contacts.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-warm-white/40">Sponsorships</span>
                  <span className="text-warm-white font-medium">
                    {sponsor.sponsorships.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-warm-white/40">Communications</span>
                  <span className="text-warm-white font-medium">
                    {sponsor.communications.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-warm-white/40">Documents</span>
                  <span className="text-warm-white font-medium">
                    {sponsor.documents.length}
                  </span>
                </div>
                <div className="pt-3 border-t border-border/50 flex items-center justify-between text-sm">
                  <span className="text-warm-white/40">Since</span>
                  <span className="text-warm-white font-medium">
                    {formatDate(sponsor.createdAt)}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === "contacts" && (
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-warm-white">Contacts</h3>
            <span className="text-xs text-warm-white/40">
              {sponsor.contacts.length} contact{sponsor.contacts.length !== 1 && "s"}
            </span>
          </div>
          {sponsor.contacts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-warm-white/10 mx-auto mb-3" />
              <p className="text-warm-white/40 text-sm">No contacts added yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sponsor.contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-surface-light/50 border border-border/30"
                >
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-gold">
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-warm-white text-sm">
                        {contact.name}
                      </h4>
                      {contact.isPrimary && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">
                          Primary
                        </span>
                      )}
                    </div>
                    {contact.position && (
                      <p className="text-xs text-warm-white/40">{contact.position}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-warm-white/50 flex-wrap">
                      {contact.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {contact.email}
                        </span>
                      )}
                      {contact.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {contact.phone}
                        </span>
                      )}
                      {contact.linkedin && (
                        <a
                          href={contact.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-gold hover:underline"
                        >
                          <Link2 className="w-3 h-3" /> LinkedIn
                        </a>
                      )}
                    </div>
                    {contact.notes && (
                      <p className="text-xs text-warm-white/30 mt-2">{contact.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === "sponsorships" && (
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-warm-white">Sponsorship Packages</h3>
            <span className="text-xs text-warm-white/40">
              {sponsor.sponsorships.length} package
              {sponsor.sponsorships.length !== 1 && "s"}
            </span>
          </div>
          {sponsor.sponsorships.length === 0 ? (
            <div className="text-center py-12">
              <Handshake className="w-12 h-12 text-warm-white/10 mx-auto mb-3" />
              <p className="text-warm-white/40 text-sm">
                No sponsorship packages yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sponsor.sponsorships.map((sp) => (
                <div
                  key={sp.id}
                  className="p-4 rounded-xl bg-surface-light/50 border border-border/30"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-warm-white text-sm">
                        {sp.name}
                      </h4>
                      <p className="text-xs text-warm-white/40 capitalize">
                        {sp.packageType} Package
                      </p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        sponsorshipStatusColors[sp.status] ||
                        "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      {sp.status.charAt(0).toUpperCase() + sp.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-warm-white/50 mt-2">
                    <span className="font-bold text-gold">
                      {formatCurrency(sp.amount, sp.currency)}
                    </span>
                    {sp.startDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(sp.startDate)}
                        {sp.endDate && ` - ${formatDate(sp.endDate)}`}
                      </span>
                    )}
                  </div>
                  {sp.notes && (
                    <p className="text-xs text-warm-white/30 mt-2">{sp.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === "communications" && (
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-warm-white">Communications</h3>
            <span className="text-xs text-warm-white/40">
              {sponsor.communications.length} interaction
              {sponsor.communications.length !== 1 && "s"}
            </span>
          </div>
          {sponsor.communications.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-warm-white/10 mx-auto mb-3" />
              <p className="text-warm-white/40 text-sm">
                No communications logged yet
              </p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-border/50" />
              <div className="space-y-6">
                {sponsor.communications.map((comm) => {
                  const Icon = commTypeIcons[comm.type] || MessageSquare;
                  return (
                    <div key={comm.id} className="relative flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-light border-2 border-border flex items-center justify-center flex-shrink-0 z-10">
                        <Icon className="w-4 h-4 text-warm-white/50" />
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] text-warm-white/30 uppercase tracking-wider">
                            {comm.type}
                          </span>
                          <span className="text-[10px] text-warm-white/20">•</span>
                          <span className="text-[10px] text-warm-white/30">
                            {comm.direction === "outbound" ? "Outgoing" : "Incoming"}
                          </span>
                          <span className="text-[10px] text-warm-white/20">•</span>
                          <span className="text-[10px] text-warm-white/30">
                            {formatDate(comm.createdAt)}
                          </span>
                        </div>
                        {comm.subject && (
                          <p className="font-medium text-warm-white text-sm mb-1">
                            {comm.subject}
                          </p>
                        )}
                        <p className="text-sm text-warm-white/60">{comm.content}</p>
                        {comm.contactName && (
                          <p className="text-[10px] text-warm-white/30 mt-1">
                            Contact: {comm.contactName}
                          </p>
                        )}
                        {comm.followUpDate && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-amber-400">
                            <Clock className="w-3 h-3" />
                            Follow up: {formatDate(comm.followUpDate)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
      )}

      {tab === "documents" && (
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-warm-white">Documents</h3>
            <span className="text-xs text-warm-white/40">
              {sponsor.documents.length} document
              {sponsor.documents.length !== 1 && "s"}
            </span>
          </div>
          {sponsor.documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-warm-white/10 mx-auto mb-3" />
              <p className="text-warm-white/40 text-sm">
                No documents linked yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sponsor.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-light/50 border border-border/30"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-gold/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-warm-white text-sm truncate">
                      {doc.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-warm-white/40 mt-0.5">
                      <span className="capitalize">{doc.type}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                          doc.status === "signed"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : doc.status === "approved"
                            ? "bg-green-500/10 text-green-400"
                            : doc.status === "expired"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {doc.status.replace("_", " ")}
                      </span>
                      {doc.effectiveDate && (
                        <span>{formatDate(doc.effectiveDate)}</span>
                      )}
                    </div>
                  </div>
                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-warm-white/30 hover:text-gold transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
