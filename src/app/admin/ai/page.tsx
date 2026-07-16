"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles, Send, FileText, Mail, Calculator, Handshake,
  PenTool, Image, Users, BarChart3, FileSpreadsheet,
  Megaphone, ClipboardList, DollarSign, Bot, Copy, Check,
  ChevronDown, Lightbulb, Zap, X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type AiToolId =
  | "proposal" | "partnership" | "email" | "budget"
  | "contract" | "invoice" | "press" | "social"
  | "meeting" | "revenue" | "report" | "pricing";

interface AiTool {
  id: AiToolId;
  name: string;
  icon: React.ElementType;
  description: string;
  color: string;
  bgColor: string;
  fields: { name: string; label: string; placeholder: string; type?: string; multiline?: boolean }[];
}

const aiTools: AiTool[] = [
  {
    id: "proposal",
    name: "Sponsorship Proposal Writer",
    icon: FileText,
    description: "Generate professional sponsorship proposals",
    color: "text-violet-400",
    bgColor: "bg-violet-400/10",
    fields: [
      { name: "sponsorName", label: "Sponsor Name", placeholder: "e.g. Ethiopian Airlines" },
      { name: "eventName", label: "Event Name", placeholder: "e.g. New Year Gala 2026" },
      { name: "eventDate", label: "Event Date", placeholder: "e.g. December 31, 2026" },
      { name: "amount", label: "Sponsorship Amount (ETB)", placeholder: "e.g. 500000" },
      { name: "audience", label: "Target Audience Size", placeholder: "e.g. 5,000 attendees" },
    ],
  },
  {
    id: "partnership",
    name: "Partnership Request Generator",
    icon: Handshake,
    description: "Draft partnership request letters",
    color: "text-gold",
    bgColor: "bg-gold/10",
    fields: [
      { name: "orgName", label: "Organization Name", placeholder: "e.g. Ministry of Tourism" },
      { name: "contactPerson", label: "Contact Person", placeholder: "e.g. Dr. Alemayehu Tadesse" },
      { name: "partnershipType", label: "Partnership Type", placeholder: "e.g. venue, media, funding" },
      { name: "valueProposition", label: "Value Proposition", placeholder: "Brief description of mutual benefits", multiline: true },
    ],
  },
  {
    id: "email",
    name: "Professional Email Drafter",
    icon: Mail,
    description: "Draft professional business emails",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    fields: [
      { name: "recipientName", label: "Recipient Name", placeholder: "e.g. Mr. Ahmed Hassan" },
      { name: "recipientTitle", label: "Recipient Title", placeholder: "e.g. Marketing Director" },
      { name: "subject", label: "Subject", placeholder: "e.g. Partnership Proposal" },
      { name: "purpose", label: "Purpose of Email", placeholder: "e.g. Follow up on our meeting" },
      { name: "tone", label: "Tone", placeholder: "e.g. formal, friendly, urgent" },
    ],
  },
  {
    id: "budget",
    name: "Event Budget Calculator",
    icon: Calculator,
    description: "Build comprehensive event budgets",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    fields: [
      { name: "eventName", label: "Event Name", placeholder: "e.g. Summer Music Festival" },
      { name: "guestCount", label: "Expected Guests", placeholder: "e.g. 2000" },
      { name: "duration", label: "Duration (days)", placeholder: "e.g. 2" },
      { name: "venue", label: "Venue", placeholder: "e.g. Friendship Park" },
      { name: "category", label: "Event Type", placeholder: "e.g. concert, corporate, wedding" },
    ],
  },
  {
    id: "contract",
    name: "Contract Generator",
    icon: PenTool,
    description: "Create professional contract templates",
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    fields: [
      { name: "clientName", label: "Client Name", placeholder: "e.g. Habesha Hotels PLC" },
      { name: "serviceName", label: "Service", placeholder: "e.g. Event Management & Entertainment" },
      { name: "totalAmount", label: "Total Amount (ETB)", placeholder: "e.g. 750000" },
      { name: "startDate", label: "Start Date", placeholder: "e.g. January 1, 2026" },
      { name: "endDate", label: "End Date", placeholder: "e.g. March 31, 2026" },
    ],
  },
  {
    id: "invoice",
    name: "Invoice Generator",
    icon: FileSpreadsheet,
    description: "Create professional invoices",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    fields: [
      { name: "clientName", label: "Client Name", placeholder: "e.g. Addis Ababa University" },
      { name: "invoiceNumber", label: "Invoice Number", placeholder: "e.g. INV-2026-001" },
      { name: "items", label: "Line Items", placeholder: "e.g. Sound system - 50000, DJ - 30000", multiline: true },
      { name: "dueDate", label: "Due Date", placeholder: "e.g. February 15, 2026" },
    ],
  },
  {
    id: "press",
    name: "Press Release Writer",
    icon: Megaphone,
    description: "Write compelling press releases",
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
    fields: [
      { name: "headline", label: "Headline", placeholder: "e.g. Ray Entertainment and Promotion Announces New Year Gala" },
      { name: "eventDate", label: "Event Date", placeholder: "e.g. December 31, 2026" },
      { name: "venue", label: "Venue", placeholder: "e.g. African Union Conference Center" },
      { name: "highlights", label: "Key Highlights", placeholder: "e.g. International artists, VIP access, live broadcast", multiline: true },
    ],
  },
  {
    id: "social",
    name: "Social Media Campaign Creator",
    icon: Image,
    description: "Design social media marketing plans",
    color: "text-rose-400",
    bgColor: "bg-rose-400/10",
    fields: [
      { name: "campaignName", label: "Campaign Name", placeholder: "e.g. New Year Countdown 2026" },
      { name: "platforms", label: "Platforms", placeholder: "e.g. Instagram, TikTok, Facebook" },
      { name: "budget", label: "Budget (ETB)", placeholder: "e.g. 100000" },
      { name: "duration", label: "Duration", placeholder: "e.g. 4 weeks" },
      { name: "targetAudience", label: "Target Audience", placeholder: "e.g. 18-35, urban, music lovers" },
    ],
  },
  {
    id: "meeting",
    name: "Meeting Summarizer",
    icon: ClipboardList,
    description: "Summarize meeting notes into action items",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    fields: [
      { name: "meetingTitle", label: "Meeting Title", placeholder: "e.g. Q1 Sponsorship Strategy Meeting" },
      { name: "attendees", label: "Attendees", placeholder: "e.g. John, Sarah, Mike" },
      { name: "notes", label: "Meeting Notes", placeholder: "Paste your meeting notes here...", multiline: true },
    ],
  },
  {
    id: "revenue",
    name: "Revenue Forecaster",
    icon: DollarSign,
    description: "Generate revenue predictions and analysis",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    fields: [
      { name: "period", label: "Forecast Period", placeholder: "e.g. Q2 2026" },
      { name: "eventCount", label: "Planned Events", placeholder: "e.g. 12" },
      { name: "avgTicketPrice", label: "Average Ticket Price (ETB)", placeholder: "e.g. 2500" },
      { name: "sponsorshipRevenue", label: "Expected Sponsorship (ETB)", placeholder: "e.g. 2000000" },
      { name: "otherIncome", label: "Other Income Sources (ETB)", placeholder: "e.g. courses, merchandise" },
    ],
  },
  {
    id: "report",
    name: "Report Generator",
    icon: BarChart3,
    description: "Create executive summary reports",
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
    fields: [
      { name: "reportTitle", label: "Report Title", placeholder: "e.g. Q1 2026 Executive Summary" },
      { name: "period", label: "Reporting Period", placeholder: "e.g. January - March 2026" },
      { name: "keyMetrics", label: "Key Metrics", placeholder: "e.g. Revenue: 5M ETB, Events: 15, Satisfaction: 92%", multiline: true },
      { name: "audience", label: "Audience", placeholder: "e.g. Board of Directors" },
    ],
  },
  {
    id: "pricing",
    name: "Pricing Advisor",
    icon: Lightbulb,
    description: "Suggest optimal pricing strategies",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    fields: [
      { name: "serviceType", label: "Service/Product Type", placeholder: "e.g. Corporate event package" },
      { name: "targetMarket", label: "Target Market", placeholder: "e.g. Mid-size companies in Addis Ababa" },
      { name: "costs", label: "Base Costs (ETB)", placeholder: "e.g. 150000" },
      { name: "competitors", label: "Competitor Pricing", placeholder: "e.g. 200000 - 350000" },
      { name: "goal", label: "Pricing Goal", placeholder: "e.g. competitive positioning, premium brand" },
    ],
  },
];

const generateOutput = (tool: AiTool, inputs: Record<string, string>): string => {
  const v = (key: string) => inputs[key] || "____________________";
  const now = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  switch (tool.id) {
    case "proposal":
      return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SPONSORSHIP PROPOSAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Prepared for: ${v("sponsorName")}
Prepared by: Ray Entertainment & Promotion
Date: ${now}

──────────────────────────────────────
EXECUTIVE SUMMARY
──────────────────────────────────────

Dear ${v("sponsorName")} Leadership Team,

Ray Entertainment & Promotion is pleased to present this exclusive sponsorship opportunity for ${v("eventName")}, scheduled for ${v("eventDate")}. This premier entertainment event is expected to draw ${v("audience")}, offering an exceptional platform for brand visibility and audience engagement.

──────────────────────────────────────
EVENT OVERVIEW
──────────────────────────────────────

Event:           ${v("eventName")}
Date:            ${v("eventDate")}
Expected Reach:  ${v("audience")}
Venue:           Premium event venue, Addis Ababa

──────────────────────────────────────
SPONSORSHIP PACKAGE
──────────────────────────────────────

Proposed Investment: ETB ${v("amount")}

Package Benefits:
• Title branding on all promotional materials
• Exclusive stage naming rights
• VIP hospitality suite for ${v("sponsorName")} executives
• Logo placement on banners, backdrops, and digital screens
• Social media mentions across Ray Entertainment and Promotion platforms (50K+ followers)
• Featured interview in press coverage
• Complimentary VIP tickets for your team
• Post-event analytics and impact report

──────────────────────────────────────
AUDIENCE DEMOGRAPHICS
──────────────────────────────────────

• Expected attendance: ${v("audience")}
• Primary age group: 18-45
• High purchasing power demographic
• Social media engagement rate: 15%+

──────────────────────────────────────
WHY ${v("sponsorName").toUpperCase()} + RAY BAND?
──────────────────────────────────────

This partnership offers ${v("sponsorName")} direct access to Ethiopia's most engaged entertainment audience. Our events consistently deliver premium brand exposure with measurable ROI.

──────────────────────────────────────
NEXT STEPS
──────────────────────────────────────

We would welcome the opportunity to discuss this proposal further. Please contact us to schedule a meeting.

Warm regards,
Ray Entertainment & Promotion
info@rayband.com | +251 911 223 344`;

    case "partnership":
      return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PARTNERSHIP REQUEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Date: ${now}
To: ${v("contactPerson")}, ${v("orgName")}

──────────────────────────────────────

Dear ${v("contactPerson")},

I hope this letter finds you well. I am writing on behalf of Ray Entertainment & Promotion to propose a strategic ${v("partnershipType")} partnership between our organizations.

WHO WE ARE
──────────

Ray Entertainment & Promotion is Ethiopia's premier entertainment and event management company. We specialize in producing world-class concerts, corporate events, cultural celebrations, and promotional campaigns. Our portfolio includes over 200 successful events and partnerships with leading brands.

PARTNERSHIP VISION
──────────────────

${v("valueProposition")}

This ${v("partnershipType")} partnership would create significant mutual value:

• Enhanced brand visibility for both organizations
• Access to our extensive event network and audience base
• Shared resources and expertise in event production
• Co-branded marketing opportunities
• Long-term strategic growth alignment

PROPOSED STRUCTURE
──────────────────

Partnership Type:   ${v("partnershipType")}
Duration:           12 months (renewable)
Review Points:      Quarterly
Success Metrics:    To be defined collaboratively

NEXT STEPS
──────────

We would be delighted to arrange a meeting at your earliest convenience to discuss this partnership in detail. We believe this collaboration would be mutually beneficial and contribute to the growth of both our organizations.

Thank you for your consideration.

Sincerely,
Ray Entertainment & Promotion
Partnerships Team`;

    case "email":
      return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROFESSIONAL EMAIL DRAFT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

To: ${v("recipientName")}
Title: ${v("recipientTitle")}
Subject: ${v("subject")}
Date: ${now}

──────────────────────────────────────

Dear ${v("recipientName")},

${v("purpose")}

I am reaching out to you from Ray Entertainment & Promotion regarding ${v("subject").toLowerCase()}. We believe that this initiative presents an excellent opportunity for collaboration that would benefit both our organizations.

Our team has extensive experience in event management, entertainment production, and brand partnerships across Ethiopia. We have successfully delivered over 200 events, ranging from intimate corporate gatherings to large-scale music festivals.

We would greatly value the opportunity to discuss this matter further at a time convenient to you. Please let me know your availability for a brief meeting or call.

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,

Ray Entertainment & Promotion
info@rayband.com | +251 911 223 344
www.rayband.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tone: ${v("tone")} | Subject: ${v("subject")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    case "budget":
      return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVENT BUDGET ESTIMATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Event: ${v("eventName")}
Venue: ${v("venue")}
Duration: ${v("duration")} day(s)
Guests: ${v("guestCount")}
Type: ${v("category")}
Date: ${now}

──────────────────────────────────────
EXPENSE BREAKDOWN
──────────────────────────────────────

VENUE & LOGISTICS
  Venue rental (${v("duration")} day(s))        ETB   250,000
  Permits & licenses                    ETB    15,000
  Security services                     ETB    45,000
  Cleaning & waste management           ETB    20,000

PRODUCTION
  Sound system & engineering            ETB   180,000
  Lighting design & equipment           ETB   120,000
  Stage setup & design                  ETB   200,000
  LED screens & visual effects          ETB    95,000

ENTERTAINMENT
  Headline performers                   ETB   350,000
  Supporting acts / DJs                 ETB   120,000
  MC / Host                             ETB    50,000

CATERING & HOSPITALITY
  Food & beverage (${v("guestCount")} guests)   ETB   ${Number(v("guestCount").replace(/,/g, "") || "0") * 800}
  VIP hospitality suite                 ETB    80,000
  Staff meals                          ETB    30,000

MARKETING & PROMOTION
  Social media advertising              ETB    60,000
  Print materials (banners, posters)    ETB    35,000
  PR & media coverage                   ETB    25,000
  Photographer & videographer           ETB    40,000

PERSONNEL
  Event management team                 ETB   100,000
  Technical crew                        ETB    60,000
  Volunteers / ushers                   ETB    20,000

CONTINGENCY (10%)                       ETB   160,000

──────────────────────────────────────
TOTAL ESTIMATED BUDGET                 ETB 1,800,000
──────────────────────────────────────

REVENUE PROJECTIONS
  Ticket sales (${v("guestCount")} × avg 2,000) ETB ${(Number(v("guestCount").replace(/,/g, "") || "0") * 2000).toLocaleString()}
  Sponsorship                           ETB   500,000
  Merchandise & concessions             ETB   100,000
  ─────────────────────────────────────
  Projected Total Revenue               ETB  ${(Number(v("guestCount").replace(/,/g, "") || "0") * 2000 + 600000).toLocaleString()}

  ESTIMATED PROFIT MARGIN              ETB  ${((Number(v("guestCount").replace(/,/g, "") || "0") * 2000 + 600000) - 1800000).toLocaleString()}`;

    case "contract":
      return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERVICE AGREEMENT CONTRACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contract Number: RAY-CONTRACT-${Date.now().toString(36).toUpperCase()}
Date: ${now}

──────────────────────────────────────
PARTIES
──────────────────────────────────────

SERVICE PROVIDER ("the Company"):
  Ray Entertainment & Promotion
  Bole, Addis Ababa, Ethiopia
  Email: info@rayband.com
  Phone: +251 911 223 344

CLIENT ("the Client"):
  ${v("clientName")}

──────────────────────────────────────
ARTICLE 1: SCOPE OF SERVICES
──────────────────────────────────────

The Company agrees to provide the following services to the Client:

1.1  ${v("serviceName")}
1.2  Pre-event planning and coordination
1.3  On-site event management and execution
1.4  Post-event reporting and analysis

──────────────────────────────────────
ARTICLE 2: TERM
──────────────────────────────────────

2.1  This Agreement shall commence on ${v("startDate")} and shall continue until ${v("endDate")}, unless terminated earlier in accordance with this Agreement.

2.2  Extensions to the term must be agreed upon in writing by both parties.

──────────────────────────────────────
ARTICLE 3: COMPENSATION
──────────────────────────────────────

3.1  Total Contract Value: ETB ${v("totalAmount")}
3.2  Payment Schedule:
      • 50% deposit upon signing (ETB ${Number(v("totalAmount").replace(/,/g, "") || "0") / 2})
      • 30% upon event completion
      • 20% final payment within 30 days post-event

3.3  Late payments shall incur a 2% monthly service charge.

──────────────────────────────────────
ARTICLE 4: RESPONSIBILITIES
──────────────────────────────────────

The Client shall:
(a) Provide timely access to venue and relevant information
(b) Approve deliverables within 5 business days
(c) Ensure payment according to the schedule above

The Company shall:
(a) Deliver all services in a professional manner
(b) Maintain confidentiality of all Client information
(c) Provide regular progress updates

──────────────────────────────────────
ARTICLE 5: TERMINATION
──────────────────────────────────────

Either party may terminate this Agreement with 30 days written notice. In the event of termination, the Client shall pay for all services rendered up to the termination date.

──────────────────────────────────────
ARTICLE 6: GOVERNING LAW
──────────────────────────────────────

This Agreement shall be governed by the laws of the Federal Democratic Republic of Ethiopia.

──────────────────────────────────────
SIGNATURES
──────────────────────────────────────

For Ray Entertainment & Promotion:

___________________________
Name:
Title:
Date:

For ${v("clientName")}:

___________________________
Name:
Title:
Date:`;

    case "invoice":
      return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INVOICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Invoice #: ${v("invoiceNumber")}
Date: ${now}
Due Date: ${v("dueDate")}

──────────────────────────────────────
FROM
──────────────────────────────────────

Ray Entertainment & Promotion
Bole, Addis Ababa, Ethiopia
TIN: 1234567890
Phone: +251 911 223 344
Email: info@rayband.com

──────────────────────────────────────
BILL TO
──────────────────────────────────────

${v("clientName")}

──────────────────────────────────────
LINE ITEMS
──────────────────────────────────────

${v("items").split(",").map((item, i) => {
  const parts = item.trim().split("-").map((s: string) => s.trim());
  const name = parts[0] || `Item ${i + 1}`;
  const amount = parts[1] || "0";
  return `  ${i + 1}. ${name.padEnd(40)} ETB ${Number(amount.replace(/[^0-9]/g, "") || "0").toLocaleString().padStart(12)}`;
}).join("\n")}

──────────────────────────────────────

  Subtotal:                              ETB ${v("items").split(",").reduce((sum: number, item: string) => {
    const match = item.match(/[\d,]+/);
    return sum + (match ? parseInt(match[0].replace(/,/g, "")) : 0);
  }, 0).toLocaleString()}
  VAT (15%):                             ETB ${Math.round(v("items").split(",").reduce((sum: number, item: string) => {
    const match = item.match(/[\d,]+/);
    return sum + (match ? parseInt(match[0].replace(/,/g, "")) : 0);
  }, 0) * 0.15).toLocaleString()}
  ─────────────────────────────────────
  TOTAL DUE:                             ETB ${Math.round(v("items").split(",").reduce((sum: number, item: string) => {
    const match = item.match(/[\d,]+/);
    return sum + (match ? parseInt(match[0].replace(/,/g, "")) : 0);
  }, 0) * 1.15).toLocaleString()}

──────────────────────────────────────
PAYMENT INSTRUCTIONS
──────────────────────────────────────

Bank: Commercial Bank of Ethiopia
Account Name: Ray Entertainment & Promotion
Account Number: 1234567890123
Reference: ${v("invoiceNumber")}

Please include the invoice number as payment reference.
Thank you for your business!`;

    case "press":
      return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRESS RELEASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FOR IMMEDIATE RELEASE
Date: ${now}

──────────────────────────────────────
${v("headline").toUpperCase()}
──────────────────────────────────────

ADDIS ABABA, Ethiopia — Ray Entertainment & Promotion is thrilled to announce ${v("headline").toLowerCase()}, taking place on ${v("eventDate")} at ${v("venue")}.

HIGHLIGHTS
──────────

${v("highlights")}

"This event represents our commitment to delivering world-class entertainment experiences in Ethiopia," said the Ray Entertainment team. "We are creating something truly memorable for our audience."

EVENT DETAILS
─────────────

  Event:     ${v("headline")}
  Date:      ${v("eventDate")}
  Venue:     ${v("venue")}
  Tickets:   Available at rayband.com

ABOUT RAY ENTERTAINMENT & PROMOTION
────────────────────────────────────

Ray Entertainment & Promotion is Ethiopia's leading entertainment and event management company. With over 200 successful events, we specialize in concerts, corporate events, cultural celebrations, and brand promotions. Our mission is to elevate Ethiopia's entertainment industry to international standards.

──────────────────────────────────────
MEDIA CONTACT
──────────────────────────────────────

Ray Entertainment & Promotion
Email: press@rayband.com
Phone: +251 911 223 344
Website: www.rayband.com
Social: @raybandofficial

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    case "social":
      return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SOCIAL MEDIA CAMPAIGN PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Campaign: ${v("campaignName")}
Platforms: ${v("platforms")}
Budget: ETB ${v("budget")}
Duration: ${v("duration")}
Target: ${v("targetAudience")}

──────────────────────────────────────
CAMPAIGN STRATEGY
──────────────────────────────────────

Campaign Name:    ${v("campaignName")}
Total Budget:     ETB ${v("budget")}
Duration:         ${v("duration")}
Platforms:        ${v("platforms")}
Target Audience:  ${v("targetAudience")}

──────────────────────────────────────
WEEKLY CONTENT CALENDAR
──────────────────────────────────────

WEEK 1 — TEASER PHASE
  Mon: Campaign announcement + countdown graphic
  Wed: Behind-the-scenes teaser video (30s)
  Fri: Artist/speaker spotlight post
  Sun: Interactive poll / Q&A story

WEEK 2 — ENGAGEMENT PHASE
  Mon: Early-bird ticket promotion post
  Wed: User-generated content challenge
  Fri: Partner/sponsor shoutout carousel
  Sun: Live Q&A session (Instagram/TikTok)

WEEK 3 — HYPE PHASE
  Mon: Full lineup reveal post
  Wed: Short-form video reel (60s)
  Fri: Testimonial from past events
  Sun: Giveaway / contest announcement

WEEK 4 — FINAL PUSH
  Mon: Last chance ticket reminder
  Wed: Day-in-the-life prep video
  Fri: Final countdown story series
  Sun: Day-of live coverage plan

──────────────────────────────────────
BUDGET ALLOCATION
──────────────────────────────────────

  Instagram Ads:        35%  ETB ${Math.round(Number(v("budget").replace(/,/g, "") || "0") * 0.35).toLocaleString()}
  TikTok Ads:           25%  ETB ${Math.round(Number(v("budget").replace(/,/g, "") || "0") * 0.25).toLocaleString()}
  Facebook Ads:         20%  ETB ${Math.round(Number(v("budget").replace(/,/g, "") || "0") * 0.20).toLocaleString()}
  Content Production:   15%  ETB ${Math.round(Number(v("budget").replace(/,/g, "") || "0") * 0.15).toLocaleString()}
  Influencer Fees:       5%  ETB ${Math.round(Number(v("budget").replace(/,/g, "") || "0") * 0.05).toLocaleString()}

──────────────────────────────────────
KPIs & METRICS
──────────────────────────────────────

  Reach Goal:           100,000+
  Engagement Rate:      5%+
  Ticket Conversions:   500+
  Cost Per Click:       < ETB 15

──────────────────────────────────────
HASHTAG STRATEGY
──────────────────────────────────────

Primary:    #${v("campaignName").replace(/\s+/g, "")}
Secondary:  #RayBand #LiveEntertainment #AddisAbaba
Branded:    #${v("campaignName").replace(/\s+/g, "")}2026`;

    case "meeting":
      return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MEETING SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Title: ${v("meetingTitle")}
Date: ${now}
Attendees: ${v("attendees")}

──────────────────────────────────────
MEETING NOTES SUMMARY
──────────────────────────────────────

${v("notes") || "(Meeting notes will be summarized here)"}

──────────────────────────────────────
KEY DISCUSSION POINTS
──────────────────────────────────────

1. The team reviewed current progress on ${v("meetingTitle").toLowerCase()}
2. Several action items were identified requiring immediate attention
3. Budget and timeline alignment was discussed
4. Next review meeting was scheduled

──────────────────────────────────────
ACTION ITEMS
──────────────────────────────────────

  □  Review and finalize project scope          Due: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
     Assigned: Team Lead

  □  Prepare budget revision                    Due: ${new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
     Assigned: Finance

  □  Follow up with vendors                     Due: ${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
     Assigned: Operations

  □  Share updated timeline with stakeholders   Due: ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
     Assigned: Project Manager

──────────────────────────────────────
NEXT MEETING
──────────────────────────────────────

Date: ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
Time: 10:00 AM
Location: Conference Room / Virtual

──────────────────────────────────────
Attendees: ${v("attendees")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    case "revenue":
      return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REVENUE FORECAST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Period: ${v("period")}
Planned Events: ${v("eventCount")}
Generated: ${now}

──────────────────────────────────────
REVENUE PROJECTIONS
──────────────────────────────────────

TICKET SALES
  Events:                  ${v("eventCount")}
  Avg Ticket Price:        ETB ${v("avgTicketPrice")}
  Est. Attendance/Event:   800 (conservative)
  ─────────────────────────────────
  Projected Ticket Revenue: ETB ${(Number(v("avgTicketPrice").replace(/,/g, "") || "0") * 800 * Number(v("eventCount") || "1")).toLocaleString()}

SPONSORSHIP INCOME
  Confirmed Sponsors:      4
  Avg Sponsorship Value:   ETB ${Number(v("sponsorshipRevenue").replace(/,/g, "") || "0").toLocaleString()}
  ─────────────────────────────────
  Sponsorship Revenue:      ETB ${v("sponsorshipRevenue")}

OTHER INCOME
  Course Enrollments:       ETB 250,000
  Merchandise Sales:        ETB 150,000
  Merchandise:              ETB ${v("otherIncome")}
  ─────────────────────────────────
  Other Revenue:            ETB ${(250000 + 150000 + Number(v("otherIncome").replace(/,/g, "") || "0")).toLocaleString()}

══════════════════════════════════════
TOTAL PROJECTED REVENUE:    ETB ${(
  Number(v("avgTicketPrice").replace(/,/g, "") || "0") * 800 * Number(v("eventCount") || "1") +
  Number(v("sponsorshipRevenue").replace(/,/g, "") || "0") +
  400000 +
  Number(v("otherIncome").replace(/,/g, "") || "0")
).toLocaleString()}
══════════════════════════════════════

──────────────────────────────────────
EXPENSE PROJECTIONS
──────────────────────────────────────

  Production Costs (35%):    ETB ${Math.round((
    Number(v("avgTicketPrice").replace(/,/g, "") || "0") * 800 * Number(v("eventCount") || "1") +
    Number(v("sponsorshipRevenue").replace(/,/g, "") || "0") +
    400000 +
    Number(v("otherIncome").replace(/,/g, "") || "0")
  ) * 0.35).toLocaleString()}
  Marketing (15%):           ETB ${Math.round((
    Number(v("avgTicketPrice").replace(/,/g, "") || "0") * 800 * Number(v("eventCount") || "1") +
    Number(v("sponsorshipRevenue").replace(/,/g, "") || "0") +
    400000 +
    Number(v("otherIncome").replace(/,/g, "") || "0")
  ) * 0.15).toLocaleString()}
  Operations (20%):          ETB ${Math.round((
    Number(v("avgTicketPrice").replace(/,/g, "") || "0") * 800 * Number(v("eventCount") || "1") +
    Number(v("sponsorshipRevenue").replace(/,/g, "") || "0") +
    400000 +
    Number(v("otherIncome").replace(/,/g, "") || "0")
  ) * 0.20).toLocaleString()}

──────────────────────────────────────
PROFIT FORECAST
──────────────────────────────────────

  Estimated Net Profit:      ETB ${Math.round((
    Number(v("avgTicketPrice").replace(/,/g, "") || "0") * 800 * Number(v("eventCount") || "1") +
    Number(v("sponsorshipRevenue").replace(/,/g, "") || "0") +
    400000 +
    Number(v("otherIncome").replace(/,/g, "") || "0")
  ) * 0.30).toLocaleString()}
  Profit Margin:             ~30%

──────────────────────────────────────
RECOMMENDATIONS
──────────────────────────────────────

  1. Increase sponsorship outreach to boost confirmed revenue
  2. Consider dynamic ticket pricing for high-demand events
  3. Explore merchandise bundling with event tickets
  4. Invest in early-bird campaigns to secure base attendance
  5. Diversify revenue streams through content monetization`;

    case "report":
      return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXECUTIVE REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${v("reportTitle")}
Period: ${v("period")}
Prepared for: ${v("audience")}
Date: ${now}

──────────────────────────────────────
EXECUTIVE SUMMARY
──────────────────────────────────────

This report provides a comprehensive overview of Ray Entertainment & Promotion's performance during ${v("period")}. Key metrics indicate strong growth and operational excellence across all business segments.

──────────────────────────────────────
KEY PERFORMANCE METRICS
──────────────────────────────────────

${v("keyMetrics") || "Metrics will be displayed here once provided."}

──────────────────────────────────────
BUSINESS HIGHLIGHTS
──────────────────────────────────────

FINANCIAL PERFORMANCE
  • Total Revenue:              ETB 4,250,000
  • Net Profit:                 ETB 1,275,000 (30% margin)
  • YoY Growth:                 +24%

EVENT OPERATIONS
  • Events Executed:            12
  • Client Satisfaction:        94%
  • On-Time Delivery Rate:      98%

SPONSORSHIP & PARTNERSHIPS
  • Active Sponsorships:        8
  • New Partnerships:           3
  • Sponsorship Revenue:        ETB 2,000,000

──────────────────────────────────────
CHALLENGES & RISK ASSESSMENT
──────────────────────────────────────

  1. Venue availability during peak seasons
  2. Rising equipment rental costs
  3. Competition from emerging event organizers
  4. Currency fluctuation impact on imported equipment

──────────────────────────────────────
STRATEGIC RECOMMENDATIONS
──────────────────────────────────────

  1. Invest in owned production equipment to reduce long-term costs
  2. Expand into secondary cities (Hawassa, Bahir Dar, Dire Dawa)
  3. Launch premium membership program for repeat clients
  4. Develop in-house talent training academy
  5. Strengthen digital presence for international event opportunities

──────────────────────────────────────
OUTLOOK FOR NEXT PERIOD
──────────────────────────────────────

  • Projected Revenue:     ETB 5,500,000 (+29%)
  • Planned Events:        16
  • Key Focus Areas:       Sponsorship growth, venue expansion, team development

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Report prepared by: Ray Entertainment & Promotion
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    case "pricing":
      return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRICING STRATEGY ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Service: ${v("serviceType")}
Market: ${v("targetMarket")}
Base Cost: ETB ${v("costs")}
Competitor Range: ETB ${v("competitors")}
Goal: ${v("goal")}
Date: ${now}

──────────────────────────────────────
COST ANALYSIS
──────────────────────────────────────

  Direct Costs:           ETB ${v("costs")}
  Overhead (25%):         ETB ${Math.round(Number(v("costs").replace(/,/g, "") || "0") * 0.25).toLocaleString()}
  Marketing (10%):        ETB ${Math.round(Number(v("costs").replace(/,/g, "") || "0") * 0.10).toLocaleString()}
  Contingency (5%):       ETB ${Math.round(Number(v("costs").replace(/,/g, "") || "0") * 0.05).toLocaleString()}
  ─────────────────────────
  Total Cost:             ETB ${Math.round(Number(v("costs").replace(/,/g, "") || "0") * 1.40).toLocaleString()}

──────────────────────────────────────
PRICING STRATEGIES
──────────────────────────────────────

STRATEGY 1: COMPETITIVE PRICING
  Price Point: ETB ${Math.round(Number(v("costs").replace(/,/g, "") || "0") * 1.50).toLocaleString()}
  Margin: 33%
  Best for: ${v("goal").includes("competitive") ? "High volume, market penetration" : "Standard positioning"}
  Risk: Lower margins but higher volume

STRATEGY 2: VALUE-BASED PRICING  ★ RECOMMENDED
  Price Point: ETB ${Math.round(Number(v("costs").replace(/,/g, "") || "0") * 1.80).toLocaleString()}
  Margin: 44%
  Best for: Premium positioning
  Risk: Requires strong brand differentiation

STRATEGY 3: PREMIUM PRICING
  Price Point: ETB ${Math.round(Number(v("costs").replace(/,/g, "") || "0") * 2.20).toLocaleString()}
  Margin: 55%
  Best for: Exclusive, high-touch services
  Risk: Lower volume, niche market

──────────────────────────────────────
RECOMMENDED PACKAGES
──────────────────────────────────────

  BASIC PACKAGE
    ETB ${Math.round(Number(v("costs").replace(/,/g, "") || "0") * 1.50).toLocaleString()}
    Core services included
    1 revision round
    Email support

  PREMIUM PACKAGE  ★
    ETB ${Math.round(Number(v("costs").replace(/,/g, "") || "0") * 1.80).toLocaleString()}
    Full service suite
    Unlimited revisions
    Dedicated manager
    Priority support

  VIP PACKAGE
    ETB ${Math.round(Number(v("costs").replace(/,/g, "") || "0") * 2.50).toLocaleString()}
    Everything in Premium
    Custom additions
    24/7 priority support
    Post-event analytics

──────────────────────────────────────
COMPETITIVE POSITIONING
──────────────────────────────────────

  Competitor Range: ${v("competitors")}
  Our Recommended: ETB ${Math.round(Number(v("costs").replace(/,/g, "") || "0") * 1.80).toLocaleString()}
  Position: Upper-mid range (premium quality, competitive value)

──────────────────────────────────────
IMPLEMENTATION NOTES
──────────────────────────────────────

  1. Start with Value-Based Pricing to establish premium perception
  2. Offer introductory discounts (10-15%) for first-time clients
  3. Build loyalty program for repeat customers
  4. Review pricing quarterly based on demand and costs
  5. Consider seasonal pricing adjustments for peak periods`;

    default:
      return "Select a tool and fill in the fields to generate output.";
  }
};

export default function AiAssistantPage() {
  const [activeTool, setActiveTool] = useState<AiTool | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<
    { id: string; role: "user" | "assistant"; content: string; toolName?: string }[]
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleToolSelect = (tool: AiTool) => {
    setActiveTool(tool);
    setInputs({});
  };

  const handleGenerate = () => {
    if (!activeTool) return;
    const hasContent = Object.values(inputs).some((v) => v.trim());
    if (!hasContent) return;

    setIsGenerating(true);

    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user" as const,
      content: `Generate ${activeTool.name} with the provided details.`,
      toolName: activeTool.name,
    };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const output = generateOutput(activeTool, inputs);
      const assistantMsg = {
        id: `a-${Date.now()}`,
        role: "assistant" as const,
        content: output,
        toolName: activeTool.name,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsGenerating(false);
    }, 1200);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      {/* Sidebar - AI Tools */}
      <div
        className={`${
          showSidebar ? "w-80" : "w-0"
        } flex-shrink-0 transition-all duration-300 overflow-hidden`}
      >
        <Card variant="glass" className="h-full flex flex-col p-0">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-lg bg-gold/10">
                <Sparkles className="w-4 h-4 text-gold" />
              </div>
              <h2 className="font-bold text-warm-white">AI Tools</h2>
            </div>
            <p className="text-xs text-warm-white/40">
              {aiTools.length} tools available
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {aiTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolSelect(tool)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  activeTool?.id === tool.id
                    ? "bg-gold/10 border border-gold/20"
                    : "hover:bg-surface-light border border-transparent"
                }`}
              >
                <div className={`p-1.5 rounded-lg ${tool.bgColor}`}>
                  <tool.icon className={`w-4 h-4 ${tool.color}`} />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      activeTool?.id === tool.id
                        ? "text-gold"
                        : "text-warm-white"
                    }`}
                  >
                    {tool.name}
                  </p>
                  <p className="text-xs text-warm-white/40 truncate">
                    {tool.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showSidebar ? "" : "-rotate-90"
                }`}
              />
            </Button>
            <div>
              <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
                AI Business Assistant
              </h1>
              <p className="text-sm text-warm-white/40">
                {activeTool
                  ? activeTool.name
                  : "Select a tool from the sidebar to get started"}
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setMessages([]);
                setActiveTool(null);
                setInputs({});
              }}
            >
              <Zap className="w-4 h-4 mr-1" /> New Chat
            </Button>
          )}
        </div>

        <div className="flex-1 flex gap-4 min-h-0">
          {/* Messages */}
          <Card variant="glass" className="flex-1 flex flex-col p-0 min-w-0">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 && !activeTool && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="p-4 rounded-2xl bg-gold/10 mb-4">
                    <Bot className="w-12 h-12 text-gold" />
                  </div>
                  <h2 className="text-xl font-bold text-warm-white mb-2">
                    Welcome to AI Assistant
                  </h2>
                  <p className="text-warm-white/40 max-w-md mb-6">
                    Choose an AI tool from the sidebar to generate
                    professional business documents, proposals, budgets, and
                    more for Ray Entertainment & Promotion.
                  </p>
                  <div className="grid grid-cols-3 gap-3 max-w-lg">
                    {aiTools.slice(0, 6).map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => handleToolSelect(tool)}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface-light hover:bg-surface-lighter border border-border hover:border-gold/30 transition-all"
                      >
                        <tool.icon
                          className={`w-5 h-5 ${tool.color}`}
                        />
                        <span className="text-xs text-warm-white/60 text-center">
                          {tool.name.split(" ").slice(0, 2).join(" ")}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-2xl ${
                      msg.role === "user"
                        ? "bg-gold/10 border border-gold/20 rounded-2xl rounded-br-sm px-5 py-3"
                        : "bg-surface-light border border-border rounded-2xl rounded-bl-sm px-5 py-4"
                    }`}
                  >
                    {msg.toolName && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
                        <Bot className="w-3.5 h-3.5 text-gold" />
                        <span className="text-xs font-medium text-gold">
                          {msg.toolName}
                        </span>
                      </div>
                    )}
                    {msg.role === "assistant" ? (
                      <div className="relative group">
                        <pre className="text-sm text-warm-white/80 whitespace-pre-wrap font-[family-name:var(--font-geist-mono)] leading-relaxed">
                          {msg.content}
                        </pre>
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="absolute top-0 right-0 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-charcoal-lighter hover:bg-surface-lighter"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-warm-white/40" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-warm-white/80">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-surface-light border border-border rounded-2xl rounded-bl-sm px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                      <span className="text-sm text-warm-white/40 ml-1">
                        Generating...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {activeTool && (
              <div className="border-t border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <activeTool.icon
                      className={`w-4 h-4 ${activeTool.color}`}
                    />
                    <span className="text-sm font-medium text-warm-white">
                      {activeTool.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTool(null);
                      setInputs({});
                    }}
                    className="p-1 rounded hover:bg-surface-lighter transition-colors"
                  >
                    <X className="w-4 h-4 text-warm-white/40" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {activeTool.fields.map((field) => (
                    <div
                      key={field.name}
                      className={field.multiline ? "col-span-2" : ""}
                    >
                      {field.multiline ? (
                        <div>
                          <label className="block text-xs font-medium text-warm-white/60 mb-1.5">
                            {field.label}
                          </label>
                          <textarea
                            rows={3}
                            placeholder={field.placeholder}
                            value={inputs[field.name] || ""}
                            onChange={(e) =>
                              setInputs((prev) => ({
                                ...prev,
                                [field.name]: e.target.value,
                              }))
                            }
                            className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-sm text-warm-white placeholder:text-warm-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                          />
                        </div>
                      ) : (
                        <Input
                          label={field.label}
                          placeholder={field.placeholder}
                          value={inputs[field.name] || ""}
                          onChange={(e) =>
                            setInputs((prev) => ({
                              ...prev,
                              [field.name]: e.target.value,
                            }))
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="primary"
                  onClick={handleGenerate}
                  disabled={
                    isGenerating ||
                    !Object.values(inputs).some((v) => v.trim())
                  }
                  className="w-full"
                >
                  {isGenerating ? (
                    "Generating..."
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Generate{" "}
                      {activeTool.name.split(" ")[0]}
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>

          {/* Quick Input (when no tool selected) */}
          {!activeTool && messages.length > 0 && (
            <div className="w-72">
              <Card variant="glass" className="p-4">
                <h3 className="text-sm font-bold text-warm-white mb-3">
                  Recent Generations
                </h3>
                <div className="space-y-2">
                  {[...messages]
                    .reverse()
                    .filter((m) => m.role === "assistant")
                    .slice(0, 5)
                    .map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="w-full text-left p-2.5 rounded-lg bg-surface-light/50 border border-border/50 hover:border-gold/20 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="gold" size="sm">
                            {msg.toolName?.split(" ").slice(0, 2).join(" ")}
                          </Badge>
                          {copiedId === msg.id && (
                            <Check className="w-3 h-3 text-emerald-400 ml-auto" />
                          )}
                        </div>
                        <p className="text-xs text-warm-white/40 mt-1 line-clamp-2">
                          {msg.content.slice(0, 100)}...
                        </p>
                      </button>
                    ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
