export const programPages = [
  {
    key: "industry-internships",
    path: "/industry-internships",
    label: "Industry Internships",
    hero: {
      kicker: "Internships with real teams",
      title: "Industry internships that ship real work",
      subtitle:
        "Join partner companies and work on live briefs with mentorship, feedback loops, and portfolio-ready results.",
      background: "internships",
    },
    stats: [
      { label: "Active partners", value: 48, suffix: "+" },
      { label: "Intern roles", value: 160, suffix: "+" },
      { label: "Avg. placement", value: 86, suffix: "%" },
      { label: "Hiring outcomes", value: 71, suffix: "%" },
    ],
    highlights: [
      {
        title: "Live project briefs",
        text: "Every internship starts with a scoped brief and success metrics agreed by the partner and PraktikaX.",
      },
      {
        title: "Mentor guidance",
        text: "Weekly check-ins with industry mentors, code reviews, and deliverable feedback.",
      },
      {
        title: "Verified outcomes",
        text: "Each internship ends with a verified work summary and skills validation.",
      },
    ],
    carousel: {
      title: "What partners request most",
      items: [
        "Frontend feature delivery with QA handoff",
        "API integrations + QA checklists",
        "Design system contributions",
        "Analytics setup + insight reporting",
      ],
    },
    form: {
      title: "Apply for an internship",
      description: "Share your background and upload your latest CV.",
      fields: [
        { name: "fullName", label: "Full name", type: "text", placeholder: "Your full name", required: true },
        { name: "email", label: "Email", type: "email", placeholder: "you@domain.com", required: true },
        { name: "track", label: "Preferred track", type: "select", options: ["Frontend", "Backend", "Full-stack", "QA"], required: true },
        { name: "cv", label: "Upload CV", type: "file", accept: ".pdf,.doc,.docx", required: true },
        { name: "note", label: "Why PraktikaX?", type: "textarea", placeholder: "Tell us what you want to build", required: false },
      ],
    },
    meta: {
      title: "Industry Internships | PraktikaX",
      description:
        "Apply to industry internships with real briefs, mentorship, and portfolio-ready outcomes.",
      schemaType: "Course",
    },
  },
  {
    key: "co-hosted-programs",
    path: "/co-hosted-programs",
    label: "Co-Hosted Programs",
    hero: {
      kicker: "Academia x industry",
      title: "Co-hosted programs with verified outcomes",
      subtitle:
        "Partner with PraktikaX to run semester-long programs with measurable learning outcomes and employer-aligned rubrics.",
      background: "cohosted",
    },
    stats: [
      { label: "University partners", value: 24, suffix: "+" },
      { label: "Program modules", value: 52, suffix: "+" },
      { label: "Learner cohorts", value: 12, suffix: "+" },
      { label: "Mentor hours", value: 3800, suffix: "+" },
    ],
    highlights: [
      {
        title: "Shared curriculum",
        text: "Blend faculty expertise with partner projects for live assignments.",
      },
      {
        title: "Assessment rubrics",
        text: "Rubrics mapped to industry competencies and skills badges.",
      },
      {
        title: "Placement pipeline",
        text: "Top learners progress into internships or partner interviews.",
      },
    ],
    carousel: {
      title: "Program formats",
      items: [
        "Semester capstone studios",
        "Short sprints for employers",
        "Guest-led live labs",
        "Career launch cohorts",
      ],
    },
    form: {
      title: "Plan a co-hosted program",
      description: "Tell us about your institution or company and goals.",
      fields: [
        { name: "organization", label: "Organization name", type: "text", placeholder: "Your institution", required: true },
        { name: "contact", label: "Contact person", type: "text", placeholder: "Full name", required: true },
        { name: "email", label: "Email", type: "email", placeholder: "you@domain.com", required: true },
        { name: "cohortSize", label: "Expected cohort size", type: "number", placeholder: "30", required: true },
        { name: "notes", label: "Program goals", type: "textarea", placeholder: "Describe the outcomes you need", required: false },
      ],
    },
    meta: {
      title: "Co-Hosted Programs | PraktikaX",
      description:
        "Launch co-hosted education programs with PraktikaX and industry partners.",
      schemaType: "Organization",
    },
  },
  {
    key: "custom-training",
    path: "/custom-training",
    label: "Custom Training",
    hero: {
      kicker: "Upskill your teams",
      title: "Custom training designed for your tech stack",
      subtitle:
        "Build on-demand training tracks for product, engineering, and operations teams with real deliverables.",
      background: "training",
    },
    stats: [
      { label: "Training pathways", value: 40, suffix: "+" },
      { label: "Average NPS", value: 93, suffix: " NPS" },
      { label: "Time to deploy", value: 4, suffix: " weeks" },
      { label: "Industries served", value: 18, suffix: "+" },
    ],
    highlights: [
      {
        title: "Role-based tracks",
        text: "From junior onboarding to leadership enablement.",
      },
      {
        title: "Live simulations",
        text: "Train teams with sandboxed environments and scenarios.",
      },
      {
        title: "Progress dashboards",
        text: "Weekly reporting with skill and productivity insights.",
      },
    ],
    carousel: {
      title: "Popular modules",
      items: [
        "API design and integration",
        "Secure DevOps workflows",
        "Product analytics bootstraps",
        "Cloud cost optimization",
      ],
    },
    form: {
      title: "Request a training plan",
      description: "Tell us the skills you want to accelerate.",
      fields: [
        { name: "company", label: "Company name", type: "text", placeholder: "Company", required: true },
        { name: "teamSize", label: "Team size", type: "number", placeholder: "15", required: true },
        { name: "focus", label: "Training focus", type: "select", options: ["Engineering", "Product", "Data", "Operations"], required: true },
        { name: "email", label: "Work email", type: "email", placeholder: "you@company.com", required: true },
        { name: "notes", label: "Key objectives", type: "textarea", placeholder: "Describe the outcomes", required: false },
      ],
    },
    meta: {
      title: "Custom Training | PraktikaX",
      description: "Design custom training for teams with PraktikaX instructors and mentors.",
      schemaType: "Organization",
    },
  },
  {
    key: "industrial-courses",
    path: "/industrial-courses",
    label: "Industrial Courses",
    hero: {
      kicker: "Course tracks",
      title: "Industrial courses built with employers",
      subtitle:
        "Deep-dive courses that map directly to job-ready deliverables and partner certification.",
      background: "courses",
    },
    stats: [
      { label: "Courses live", value: 28, suffix: "+" },
      { label: "Avg. completion", value: 82, suffix: "%" },
      { label: "Skills badges", value: 120, suffix: "+" },
      { label: "Live sessions", value: 210, suffix: "+" },
    ],
    highlights: [
      {
        title: "Employer-reviewed",
        text: "Course content reviewed and approved by hiring teams.",
      },
      {
        title: "Hands-on labs",
        text: "Live projects every week to build applied skills.",
      },
      {
        title: "Career insights",
        text: "Includes role mapping, salary data, and hiring criteria.",
      },
    ],
    carousel: {
      title: "Trending course themes",
      items: [
        "Full-stack PHP development",
        "Cloud-native APIs",
        "UX for enterprise teams",
        "Data storytelling for PMs",
      ],
    },
    form: {
      title: "Get course recommendations",
      description: "We will send you curated course paths.",
      fields: [
        { name: "fullName", label: "Full name", type: "text", placeholder: "Your full name", required: true },
        { name: "email", label: "Email", type: "email", placeholder: "you@domain.com", required: true },
        { name: "experience", label: "Experience level", type: "select", options: ["Beginner", "Intermediate", "Advanced"], required: true },
        { name: "goals", label: "Career goals", type: "textarea", placeholder: "Share your target role", required: false },
      ],
    },
    meta: {
      title: "Industrial Courses | PraktikaX",
      description: "Explore industrial courses with employer-reviewed learning outcomes.",
      schemaType: "Course",
    },
  },
  {
    key: "bootcamps",
    path: "/bootcamps",
    label: "Bootcamps",
    hero: {
      kicker: "Intensive cohorts",
      title: "Bootcamps engineered for rapid career switches",
      subtitle:
        "Full-time and part-time bootcamps with accountability, milestone reviews, and hiring support.",
      background: "bootcamps",
    },
    stats: [
      { label: "Cohort length", value: 12, suffix: " weeks" },
      { label: "Live hours", value: 210, suffix: " hrs" },
      { label: "Project reviews", value: 36, suffix: "+" },
      { label: "Hiring partners", value: 45, suffix: "+" },
    ],
    highlights: [
      {
        title: "Sprint-based learning",
        text: "Weekly sprints with demos, code reviews, and feedback.",
      },
      {
        title: "Career acceleration",
        text: "Portfolio reviews, mock interviews, and hiring prep.",
      },
      {
        title: "Team delivery",
        text: "Work in squads to deliver real-world products.",
      },
    ],
    carousel: {
      title: "Bootcamp milestones",
      items: [
        "Week 1-2: Foundations + tooling",
        "Week 3-5: Feature delivery sprints",
        "Week 6-9: Partner project build",
        "Week 10-12: Hiring prep + showcase",
      ],
    },
    timeline: [
      {
        title: "Discover",
        text: "Assess goals, map the right cohort, and set success metrics.",
      },
      {
        title: "Build",
        text: "Weekly sprints with demos, and mentor check-ins.",
      },
      {
        title: "Ship",
        text: "Finalize capstone deliverables and publish your portfolio.",
      },
      {
        title: "Hire",
        text: "Match with partners for interviews and placements.",
      },
    ],
    form: {
      title: "Join the next bootcamp",
      description: "Tell us your goals and preferred schedule.",
      fields: [
        { name: "fullName", label: "Full name", type: "text", placeholder: "Your full name", required: true },
        { name: "email", label: "Email", type: "email", placeholder: "you@domain.com", required: true },
        { name: "schedule", label: "Preferred schedule", type: "select", options: ["Full-time", "Part-time", "Weekend"], required: true },
        { name: "goal", label: "Primary goal", type: "textarea", placeholder: "Describe the role you want", required: false },
      ],
    },
    meta: {
      title: "Bootcamps | PraktikaX",
      description: "Accelerate your career with PraktikaX bootcamps and employer support.",
      schemaType: "Course",
    },
  },
  {
    key: "career-tracks",
    path: "/career-tracks",
    label: "Career Tracks",
    hero: {
      kicker: "Guided journeys",
      title: "Career tracks mapped to real roles",
      subtitle:
        "Stack modular learning, projects, and mentorship in curated career tracks built with partner input.",
      background: "tracks",
    },
    stats: [
      { label: "Tracks", value: 14, suffix: "+" },
      { label: "Skills per track", value: 18, suffix: "+" },
      { label: "Mentor hours", value: 520, suffix: "+" },
      { label: "Projects", value: 65, suffix: "+" },
    ],
    highlights: [
      {
        title: "Skill mapping",
        text: "Each track maps to exact hiring requirements.",
      },
      {
        title: "Portfolio planning",
        text: "Every milestone builds into a portfolio artifact.",
      },
      {
        title: "Accountability",
        text: "Weekly check-ins keep learners on target.",
      },
    ],
    carousel: {
      title: "Popular career tracks",
      items: [
        "Full-stack PHP developer",
        "Product operations lead",
        "Data analytics specialist",
        "Cloud infrastructure engineer",
      ],
    },
    form: {
      title: "Start a career track",
      description: "Let us recommend the best path for you.",
      fields: [
        { name: "fullName", label: "Full name", type: "text", placeholder: "Your full name", required: true },
        { name: "email", label: "Email", type: "email", placeholder: "you@domain.com", required: true },
        { name: "interest", label: "Interest area", type: "select", options: ["Engineering", "Data", "Product", "Design"], required: true },
        { name: "timeline", label: "Timeline", type: "text", placeholder: "e.g. 3-6 months", required: false },
      ],
    },
    meta: {
      title: "Career Tracks | PraktikaX",
      description: "Explore guided career tracks aligned to real job roles.",
      schemaType: "Course",
    },
  },
  {
    key: "workshops-masterclasses",
    path: "/workshops-masterclasses",
    label: "Workshops & Masterclasses",
    hero: {
      kicker: "Short live sessions",
      title: "Workshops and masterclasses with practitioners",
      subtitle:
        "Short-form, high-impact sessions delivered by industry leaders with live Q&A and take-home resources.",
      background: "workshops",
    },
    stats: [
      { label: "Live sessions", value: 96, suffix: "+" },
      { label: "Avg. rating", value: 4.8, suffix: " /5" },
      { label: "Speakers", value: 62, suffix: "+" },
      { label: "Upcoming events", value: 14, suffix: "+" },
    ],
    highlights: [
      {
        title: "Live delivery",
        text: "Interactive sessions with dedicated Q&A time.",
      },
      {
        title: "Actionable resources",
        text: "Playbooks and templates for immediate use.",
      },
      {
        title: "Community access",
        text: "Access to follow-up office hours and groups.",
      },
    ],
    carousel: {
      title: "Upcoming themes",
      items: [
        "Prompt engineering for developers",
        "Hiring-ready portfolios",
        "AI product strategy",
        "Business analytics in 2 hours",
      ],
    },
    form: {
      title: "Reserve a seat",
      description: "Register to receive updates and calendar invites.",
      fields: [
        { name: "fullName", label: "Full name", type: "text", placeholder: "Your full name", required: true },
        { name: "email", label: "Email", type: "email", placeholder: "you@domain.com", required: true },
        { name: "topic", label: "Topic interest", type: "select", options: ["AI", "Career", "Product", "Engineering"], required: true },
        { name: "questions", label: "Questions for speakers", type: "textarea", placeholder: "Optional", required: false },
      ],
    },
    meta: {
      title: "Workshops & Masterclasses | PraktikaX",
      description: "Join PraktikaX workshops and masterclasses led by industry practitioners.",
      schemaType: "Event",
    },
  },
  {
    key: "career-mentorship",
    path: "/career-mentorship",
    label: "Career Mentorship",
    hero: {
      kicker: "1:1 mentorship",
      title: "Career mentorship with people who hire",
      subtitle:
        "Get matched to mentors who help you build strategy, confidence, and interview readiness.",
      background: "mentorship",
    },
    stats: [
      { label: "Mentors", value: 210, suffix: "+" },
      { label: "Industries", value: 32, suffix: "+" },
      { label: "Mentor sessions", value: 820, suffix: "+" },
      { label: "Career outcomes", value: 74, suffix: "%" },
    ],
    highlights: [
      {
        title: "Tailored coaching",
        text: "Mentors map your experience to the right roles.",
      },
      {
        title: "Interview readiness",
        text: "Mock interviews and feedback loops built-in.",
      },
      {
        title: "Long-term growth",
        text: "Track progress with a personal growth plan.",
      },
    ],
    carousel: {
      title: "Mentorship focus areas",
      items: [
        "Career strategy and positioning",
        "Portfolio and CV reviews",
        "Interview preparation",
        "Negotiation and offer strategy",
      ],
    },
    form: {
      title: "Request a mentor",
      description: "Tell us about your goals and availability.",
      fields: [
        { name: "fullName", label: "Full name", type: "text", placeholder: "Your full name", required: true },
        { name: "email", label: "Email", type: "email", placeholder: "you@domain.com", required: true },
        { name: "availability", label: "Availability", type: "text", placeholder: "Weekdays / weekends", required: false },
        { name: "goal", label: "Career goals", type: "textarea", placeholder: "Describe your goals", required: true },
      ],
    },
    meta: {
      title: "Career Mentorship | PraktikaX",
      description: "Find a career mentor and build a long-term growth plan.",
      schemaType: "Organization",
    },
  },
];

export const getProgramPage = (key) => programPages.find((page) => page.key === key);
