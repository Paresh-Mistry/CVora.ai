import {
  CheckCircle,
  Sparkles,
  Infinity,
} from "lucide-react";

export const TEMPLATES = [
    // ── LAYOUT A (Stack) variants ──
    {
        id: "t1", name: "Classic", layout: "A",
        desc: "Traditional centered serif",
        previewBg: "#fafaf8", previewAccent: "#1a1a1a", premium:true,
        tokens: { accent: "#1a1a1a", font: "'Georgia', serif", displayFont: "'Georgia', serif", nameSize: "30px", headerStyle: "centered", divider: "underline", skillStyle: "tag", padding: "44px 52px" },
    },
    {
        id: "t2", name: "Minimal", layout: "A",
        desc: "Ultra-light weight, ruled",
        previewBg: "#fafafa", previewAccent: "#111", premium: true,
        tokens: { accent: "#111", font: "'system-ui', sans-serif", displayFont: "'system-ui', sans-serif", nameSize: "40px", headerStyle: "minimal", divider: "underline", skillStyle: "plain", padding: "52px 60px" },
    },
    {
        id: "t3", name: "Bold Red", layout: "A",
        desc: "Strong accent, band titles",
        previewBg: "#fff8f8", previewAccent: "#c0392b", premium: true,
        tokens: { accent: "#c0392b", font: "'system-ui', sans-serif", displayFont: "'system-ui', sans-serif", nameSize: "28px", headerStyle: "split", divider: "band", skillStyle: "pill", padding: "36px 44px" },
    },
    // ── LAYOUT B (Sidebar) variants ──
    {
        id: "t4", name: "Navy Pro", layout: "B",
        desc: "Dark navy sidebar, progress bars",
        previewBg: "#f0f4f8", previewAccent: "#1e3a5f", premium: true,
        tokens: { accent: "#1e3a5f", font: "'system-ui', sans-serif", displayFont: "'system-ui', sans-serif", sidebarBg: "#1e3a5f", sidebarText: "#fff", sidebarAccent: "rgba(255,255,255,0.45)", sideWidth: "185px", avatar: "circle", skillStyle: "bar" },
    },
    {
        id: "t5", name: "Forest", layout: "B",
        desc: "Deep green, serif, skill pills",
        previewBg: "#f0f5f2", previewAccent: "#1a4731", premium: true,
        tokens: { accent: "#1a4731", font: "'Georgia', serif", displayFont: "'Georgia', serif", sidebarBg: "#1a4731", sidebarText: "#e8f5ee", sidebarAccent: "rgba(232,245,238,0.5)", sideWidth: "190px", avatar: "square", skillStyle: "pill" },
    },
    // ── LAYOUT C (Banner) variants ──
    {
        id: "t6", name: "Executive", layout: "C",
        desc: "Dark banner, two-col body",
        previewBg: "#f5f5f5", previewAccent: "#0f2537", premium: true,
        tokens: { accent: "#0f2537", font: "'Georgia', serif", displayFont: "'Georgia', serif", nameSize: "28px", bannerBg: "#0f2537", skillStyle: "bar" },
    },
    {
        id: "t7", name: "Creative", layout: "C",
        desc: "Vibrant coral banner, clean",
        previewBg: "#fff5f3", previewAccent: "#c0392b", premium: true, 
        tokens: { accent: "#c0392b", font: "'system-ui', sans-serif", displayFont: "'system-ui', sans-serif", nameSize: "32px", bannerBg: "#c0392b", skillStyle: "pill" },
    },
    {
        id: "t8", name: "Violet", layout: "C",
        desc: "Rich purple, diamond bullets",
        previewBg: "#f8f5ff", previewAccent: "#5b21b6", premium: true,
        tokens: { accent: "#5b21b6", font: "'system-ui', sans-serif", displayFont: "'system-ui', sans-serif", nameSize: "30px", bannerBg: "#5b21b6", skillStyle: "dot" },
    },
    {
        id: "t9", name: "Modern", layout: "C",
        desc: "Clean lines, spacious padding",
        previewBg: "#f0f4f8", previewAccent: "#111", premium: true,
        tokens: { accent: "#111", font: "'system-ui', sans-serif", displayFont: "'system-ui', sans-serif", nameSize: "30px", bannerBg: "#111", skillStyle: "plain", padding: "48px 60px" },
    },
    {
        id: "t10", name: "Techie", layout: "C",
        desc: "Dark green banner, monospaced font",
        previewBg: "#f4f7f2", previewAccent: "#0f4c35", premium: false, 
        tokens: { accent: "#0f4c35", font: "'Courier New', monospace", displayFont: "'Courier New', monospace", nameSize: "30px", bannerBg: "#0f4c35", skillStyle: "plain" },
    },
    {
        id: "t11", name: "Royal Blue", layout: "A",
        desc: "Elegant blue accents, professional",
        previewBg: "#f5f9ff", previewAccent: "#2563eb", premium: true,
        tokens: { accent: "#2563eb", font: "'Georgia', serif", displayFont: "'Georgia', serif", nameSize: "32px", headerStyle: "centered", divider: "underline", skillStyle: "pill", padding: "44px 52px" },
    },
    {
        id: "t12", name: "Charcoal", layout: "A",
        desc: "Dark modern executive style",
        previewBg: "#f8f8f8", previewAccent: "#374151", premium: false,
        tokens: { accent: "#374151", font: "'Arial', sans-serif", displayFont: "'Arial', sans-serif", nameSize: "34px", headerStyle: "minimal", divider: "band", skillStyle: "tag", padding: "48px 56px" },
    },
    {
        id: "t13", name: "Golden Edge", layout: "A",
        desc: "Luxury gold highlights",
        previewBg: "#fffdf7", previewAccent: "#b8860b", premium: true,
        tokens: { accent: "#b8860b", font: "'Georgia', serif", displayFont: "'Georgia', serif", nameSize: "30px", headerStyle: "split", divider: "underline", skillStyle: "pill", padding: "42px 50px" },
    },
    {
        id: "t14", name: "Slate", layout: "A",
        desc: "Modern gray minimalist",
        previewBg: "#f4f6f8", previewAccent: "#475569", premium: false,
        tokens: { accent: "#475569", font: "'system-ui', sans-serif", displayFont: "'system-ui', sans-serif", nameSize: "38px", headerStyle: "minimal", divider: "underline", skillStyle: "plain", padding: "50px 60px" },
    },
    {
        id: "t15", name: "Emerald", layout: "B",
        desc: "Premium green sidebar",
        previewBg: "#f3faf6", previewAccent: "#059669", premium: true,
        tokens: { accent: "#059669", font: "'system-ui', sans-serif", displayFont: "'system-ui', sans-serif", sidebarBg: "#059669", sidebarText: "#fff", sidebarAccent: "rgba(255,255,255,0.45)", sideWidth: "180px", avatar: "circle", skillStyle: "bar" },
    },
    {
        id: "t16", name: "Midnight", layout: "B",
        desc: "Dark luxury profile layout",
        previewBg: "#f5f6fa", previewAccent: "#111827", premium: true,
        tokens: { accent: "#111827", font: "'Arial', sans-serif", displayFont: "'Arial', sans-serif", sidebarBg: "#111827", sidebarText: "#f9fafb", sidebarAccent: "rgba(255,255,255,0.3)", sideWidth: "200px", avatar: "square", skillStyle: "pill" },
    },
    {
        id: "t17", name: "Crimson", layout: "B",
        desc: "Strong red leadership theme",
        previewBg: "#fff5f5", previewAccent: "#b91c1c", premium: true,
        tokens: { accent: "#b91c1c", font: "'Georgia', serif", displayFont: "'Georgia', serif", sidebarBg: "#b91c1c", sidebarText: "#fff", sidebarAccent: "rgba(255,255,255,0.4)", sideWidth: "190px", avatar: "circle", skillStyle: "dot" },
    },
    {
        id: "t18", name: "Ocean", layout: "B",
        desc: "Fresh blue creative sidebar",
        previewBg: "#eef8ff", previewAccent: "#0284c7", premium: false,
        tokens: { accent: "#0284c7", font: "'system-ui', sans-serif", displayFont: "'system-ui', sans-serif", sidebarBg: "#0284c7", sidebarText: "#fff", sidebarAccent: "rgba(255,255,255,0.35)", sideWidth: "185px", avatar: "square", skillStyle: "bar" },
    },
    {
        id: "t19", name: "Corporate", layout: "C",
        desc: "Clean business presentation",
        previewBg: "#f8fafc", previewAccent: "#1e293b", premium: true,
        tokens: { accent: "#1e293b", font: "'Arial', sans-serif", displayFont: "'Arial', sans-serif", nameSize: "32px", bannerBg: "#1e293b", skillStyle: "pill" },
    },
    {
        id: "t20", name: "Sunset", layout: "C",
        desc: "Warm orange professional look",
        previewBg: "#fff8f1", previewAccent: "#ea580c",
        tokens: { accent: "#ea580c", font: "'system-ui', sans-serif", displayFont: "'system-ui', sans-serif", nameSize: "30px", bannerBg: "#ea580c", skillStyle: "dot" },
    },
    {
        id: "t21", name: "Aqua", layout: "C",
        desc: "Fresh teal modern design",
        previewBg: "#f0fdfa", previewAccent: "#0f766e", premium: true,
        tokens: { accent: "#0f766e", font: "'system-ui', sans-serif", displayFont: "'system-ui', sans-serif", nameSize: "31px", bannerBg: "#0f766e", skillStyle: "bar" },
    },
    {
        id: "t22", name: "Lavender", layout: "C",
        desc: "Soft purple creative profile",
        previewBg: "#faf5ff", previewAccent: "#7c3aed", premium: true,
        tokens: { accent: "#7c3aed", font: "'Georgia', serif", displayFont: "'Georgia', serif", nameSize: "32px", bannerBg: "#7c3aed", skillStyle: "pill" },
    },
    {
        id: "t23", name: "Graphite", layout: "C",
        desc: "Dark gray premium resume",
        previewBg: "#f5f5f5", previewAccent: "#2d3748", premium: false,
        tokens: { accent: "#2d3748", font: "'Arial', sans-serif", displayFont: "'Arial', sans-serif", nameSize: "30px", bannerBg: "#2d3748", skillStyle: "plain" },
    },
    {
        id: "t24", name: "Startup", layout: "C",
        desc: "Modern startup-inspired design",
        previewBg: "#f9fafb", previewAccent: "#0891b2", premium: true,
        tokens: { accent: "#0891b2", font: "'Inter', sans-serif", displayFont: "'Inter', sans-serif", nameSize: "34px", bannerBg: "#0891b2", skillStyle: "tag" },
    },
    {
        id: "t25", name: "Luxury Black", layout: "C",
        desc: "Black and gold executive style",
        previewBg: "#fafafa", previewAccent: "#c9a227", premium: false,
        tokens: { accent: "#c9a227", font: "'Georgia', serif", displayFont: "'Georgia', serif", nameSize: "30px", bannerBg: "#111111", skillStyle: "pill" },
    },
];

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
      "Cover Letter Generator",
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


const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Express.js",
  "NestJS",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Python",
  "Django",
  "Flask",
  "FastAPI",
  "Go",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Git",
  "GitHub",
  "Tailwind CSS",
  "Bootstrap",
  "Redux",
  "GraphQL",
  "REST API",
  "Machine Learning",
  "TensorFlow",
  "PyTorch",
  "Linux",
  "CI/CD",
  "Terraform",
  "Kafka",
  "RabbitMQ"
]