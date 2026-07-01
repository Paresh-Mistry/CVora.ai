import {
  CheckCircle,
  Sparkles,
  Infinity,
} from "lucide-react";

export const AI_QUICK_PROMPTS = [
    { emoji: "✨", label: "Rewrite summary", prompt: "Rewrite my resume summary to be more compelling and concise." },
    { emoji: "💪", label: "Stronger verbs", prompt: "Add strong action verbs to all my experience bullet points." },
    { emoji: "📊", label: "Add metrics", prompt: "Quantify my achievements in the experience section with realistic metrics." },
    { emoji: "🎯", label: "Senior tone", prompt: "Make my resume more suitable for a senior-level role." },
    { emoji: "🚀", label: "Startup tone", prompt: "Make my resume more suitable for a startup environment." },
    { emoji: "🗂️", label: "Tailor for PM", prompt: "Tailor my resume for a product management position." },
    { emoji: "🔍", label: "Find gaps", prompt: "Check my resume for gaps and suggest missing sections." },
    { emoji: "✂️", label: "Shorten to 1 page", prompt: "Shorten my resume to fit on a single page while keeping all key information." },
];

export const SCORE_CHECKS = [
    { label: "Contact info complete", status: "ok", badge: "Done" },
    { label: "Summary present", status: "ok", badge: "Done" },
    { label: "2+ experience entries", status: "ok", badge: "Done" },
    { label: "Missing quantified metrics", status: "warn", badge: "Improve" },
    { label: "Skills section sparse", status: "warn", badge: "Improve" },
    { label: "No LinkedIn / portfolio URL", status: "bad", badge: "Missing" },
];

export const EXPORT_OPTIONS = [
    { icon: "📄", label: "Download as PDF", desc: "Best for applications — preserves layout exactly" },
    { icon: "📝", label: "Download as Word (.docx)", desc: "Editable in Microsoft Word or Google Docs" },
    { icon: "</>", label: "Export as HTML", desc: "For personal portfolio or web use" },
    { icon: "🔗", label: "Share link", desc: "Get a public URL to share with recruiters" },
    { icon: "🖨", label: "Print", desc: "Open print dialog for physical copies" },
];

export const HISTORY_ENTRIES = [
    { label: "Updated summary section", time: "Just now", current: true },
    { label: "Added 2 experience entries", time: "12 min ago" },
    { label: "Switched to Classic template", time: "34 min ago" },
    { label: "Changed accent color to blue", time: "1 hr ago" },
    { label: "Resume created", time: "2 hrs ago" },
];

export const TABS = [
    { id: "preview", label: "Preview", icon: "👁" },
    { id: "templates", label: "Templates", icon: "⊞" },
    { id: "ai", label: "AI Generate", icon: "✦" },
    { id: "score", label: "ATS score", icon: "✦" },
];


export const plans = [
  {
    title: "Free",
    price: "₹0",
    description: "Perfect for getting started",
    buttonText: "Current Plan",
    variant: "outline",
    icon: CheckCircle,
    features: [
      "1 Resume",
      "Basic Templates",
      "PDF Export",
      "Limited AI Suggestions",
    ],
  },
  {
    title: "Pro",
    price: "₹299",
    description: "Everything needed to land interviews",
    buttonText: "Upgrade to Pro",
    variant: "default",
    popular: true,
    icon: Sparkles,
    features: [
      "Unlimited Resumes",
      "Premium Templates",
      "ATS Optimization",
      "AI Resume Writer",
      "Priority Support",
    ],
  },
  {
    title: "Lifetime",
    price: "₹1999",
    description: "One payment forever",
    buttonText: "Get Lifetime",
    variant: "secondary",
    icon: Infinity,
    features: [
      "All Pro Features",
      "Lifetime Updates",
      "Future AI Features",
      "Priority Support",
    ],
  },
];

export const faqs = [
  {
    q: "Can I cancel anytime?",
    a: "Yes, you can cancel your subscription whenever you want.",
  },
  {
    q: "Are templates ATS friendly?",
    a: "Yes. All templates are optimized for ATS systems.",
  },
  {
    q: "Do I get AI credits?",
    a: "Pro and Lifetime plans include AI-powered resume generation.",
  },
];
