import { User } from "@/types/models";

export interface Project {
  id: string;
  authorId: string;
  title: string;
  description: string;
  techStack: string[];
  stage: "Idea" | "MVP" | "Production";
  createdAt: string;
  bookmarkCount: number;
}

// This acts as our fake database
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Robert Fox",
    email: "robert@connct.dev",
    bio: "Frontend Developer | React Specialist | Open to Work",
    techStack: ["React", "TypeScript", "Next.js"],
  },
  {
    id: "2",
    name: "Bessie Cooper",
    email: "bessie@connct.dev",
    bio: "Digital Marketer & Growth Hacker",
    techStack: ["SEO", "Analytics", "Content Strategy"],
  },
  {
    id: "3",
    name: "Cameron Williamson",
    email: "cameron@connct.dev",
    bio: "Backend Engineer building scalable APIs",
    techStack: ["Node.js", "PostgreSQL", "Docker"],
  },
  {
    id: "4",
    name: "Dianne Russell",
    email: "dianne@connct.dev",
    bio: "Product Designer focused on accessible experiences",
    techStack: ["Figma", "Design Systems", "Accessibility"],
  },
  {
    id: "5",
    name: "Eleanor Pena",
    email: "eleanor@connct.dev",
    bio: "Full-stack developer and open-source contributor",
    techStack: ["Vue", "Go", "Redis"],
  },
  {
    id: "6",
    name: "Floyd Miles",
    email: "floyd@connct.dev",
    bio: "Cloud architect helping teams modernize infrastructure",
    techStack: ["AWS", "Terraform", "Kubernetes"],
  },
  {
    id: "7",
    name: "Grace Howard",
    email: "grace@connct.dev",
    bio: "Data analyst turning complex datasets into useful insights",
    techStack: ["Python", "SQL", "Tableau"],
  },
  {
    id: "8",
    name: "Henry Nichols",
    email: "henry@connct.dev",
    bio: "Mobile developer crafting smooth iOS applications",
    techStack: ["Swift", "SwiftUI", "Core Data"],
  },
  {
    id: "9",
    name: "Isabella Torres",
    email: "isabella@connct.dev",
    bio: "UX researcher who makes products easier to use",
    techStack: ["User Research", "Prototyping", "Usability Testing"],
  },
  {
    id: "10",
    name: "Jackie Flores",
    email: "jackie@connct.dev",
    bio: "Machine learning engineer exploring practical AI",
    techStack: ["Python", "PyTorch", "MLOps"],
  },
  {
    id: "11",
    name: "Kevin Hart",
    email: "kevin@connct.dev",
    bio: "QA engineer championing reliable software releases",
    techStack: ["Playwright", "Jest", "CI/CD"],
  },
  {
    id: "12",
    name: "Lauren Murphy",
    email: "lauren@connct.dev",
    bio: "Content designer making technical products clear",
    techStack: ["UX Writing", "Content Design", "Figma"],
  },
  {
    id: "13",
    name: "Marcus Lee",
    email: "marcus@connct.dev",
    bio: "Security engineer building safer web applications",
    techStack: ["AppSec", "OAuth", "Threat Modeling"],
  },
  {
    id: "14",
    name: "Nina Patel",
    email: "nina@connct.dev",
    bio: "Platform engineer improving developer workflows",
    techStack: ["Kubernetes", "Helm", "Prometheus"],
  },
  {
    id: "15",
    name: "Oscar Bennett",
    email: "oscar@connct.dev",
    bio: "Frontend engineer passionate about web performance",
    techStack: ["Svelte", "CSS", "Web Vitals"],
  },
  {
    id: "16",
    name: "Priya Shah",
    email: "priya@connct.dev",
    bio: "Business analyst connecting customer needs to solutions",
    techStack: ["Data Analysis", "Agile", "Jira"],
  },
  {
    id: "17",
    name: "Quentin Brooks",
    email: "quentin@connct.dev",
    bio: "Blockchain developer working on decentralized apps",
    techStack: ["Solidity", "Ethereum", "Hardhat"],
  },
  {
    id: "18",
    name: "Rosa Martinez",
    email: "rosa@connct.dev",
    bio: "Technical project manager guiding cross-functional teams",
    techStack: ["Roadmapping", "Scrum", "Notion"],
  },
  {
    id: "19",
    name: "Samuel Green",
    email: "samuel@connct.dev",
    bio: "Database engineer focused on dependable data platforms",
    techStack: ["MySQL", "PostgreSQL", "Database Design"],
  },
  {
    id: "20",
    name: "Tara Wilson",
    email: "tara@connct.dev",
    bio: "Growth strategist helping early-stage teams find customers",
    techStack: ["SEO", "Email Marketing", "Experimentation"],
  },
  {
    id: "21",
    name: "Umar Ahmed",
    email: "umar@connct.dev",
    bio: "DevOps engineer automating dependable deployments",
    techStack: ["Linux", "Ansible", "GitHub Actions"],
  },
  {
    id: "22",
    name: "Valerie Kim",
    email: "valerie@connct.dev",
    bio: "Android developer creating thoughtful mobile experiences",
    techStack: ["Kotlin", "Jetpack Compose", "Firebase"],
  },
  {
    id: "23",
    name: "Wesley Price",
    email: "wesley@connct.dev",
    bio: "Technical writer making developer tools approachable",
    techStack: ["Technical Writing", "Markdown", "Docs as Code"],
  },
  {
    id: "24",
    name: "Ximena Rivera",
    email: "ximena@connct.dev",
    bio: "Computer vision researcher bringing images to life",
    techStack: ["OpenCV", "Python", "TensorFlow"],
  },
];

export const mockProjects: Project[] = [
  {
    id: "p1",
    authorId: "2",
    title: "Building an AI-powered content calendar",
    description:
      "In today's fast-paced, digitally driven world, digital marketing is not just a strategy. It's a necessity for businesses of all sizes. I'm building a tool to automate this. Need a frontend dev to help with the dashboard UI.",
    techStack: ["React", "OpenAI API", "Tailwind"],
    stage: "MVP",
    createdAt: "2 hours ago",
    bookmarkCount: 12,
  },
  {
    id: "p2",
    authorId: "3",
    title: "Real-time collaborative code editor",
    description:
      "Fantastic post! Your content always brings a smile to my face. Keep up the great work! 🎉 Just kidding, I'm actually looking for contributors for a WebSockets-based code editor. Think Google Docs, but for code.",
    techStack: ["Node.js", "WebSockets", "Monaco Editor"],
    stage: "Idea",
    createdAt: "5 hours ago",
    bookmarkCount: 45,
  },
  {
    id: "p3",
    authorId: "1",
    title: "Open sourcing my Next.js 15 boilerplate",
    description:
      "Prepare to be dazzled by our latest collection! From trendy fashion to must-have gadgets... wait, wrong template. I just finished a boilerplate with TanStack Query, Zustand, and Tailwind v4. Check it out!",
    techStack: ["Next.js 15", "TypeScript", "Tailwind v4"],
    stage: "Production",
    createdAt: "1 day ago",
    bookmarkCount: 128,
  },
];

// Helper to simulate network delay (makes loading states visible)
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
