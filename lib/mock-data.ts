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
    profession: "Frontend Developer",
    email: "robert@connct.dev",
    bio: "Frontend Developer | React Specialist | Open to Work",
    techStack: ["React", "TypeScript", "Next.js"],
  },
  {
    id: "2",
    name: "Bessie Cooper",
    profession: "Digital Marketer",
    email: "bessie@connct.dev",
    bio: "Digital Marketer & Growth Hacker",
    techStack: ["SEO", "Analytics", "Content Strategy"],
  },
  {
    id: "3",
    name: "Cameron Williamson",
    profession: "Backend Engineer",
    email: "cameron@connct.dev",
    bio: "Backend Engineer building scalable APIs",
    techStack: ["Node.js", "PostgreSQL", "Docker"],
  },
  {
    id: "4",
    name: "Dianne Russell",
    profession: "Product Designer",
    email: "dianne@connct.dev",
    bio: "Product Designer focused on accessible experiences",
    techStack: ["Figma", "Design Systems", "Accessibility"],
  },
  {
    id: "5",
    name: "Eleanor Pena",
    profession: "Full-stack Developer",
    email: "eleanor@connct.dev",
    bio: "Full-stack developer and open-source contributor",
    techStack: ["Vue", "Go", "Redis"],
  },
  {
    id: "6",
    name: "Floyd Miles",
    profession: "Cloud Architect",
    email: "floyd@connct.dev",
    bio: "Cloud architect helping teams modernize infrastructure",
    techStack: ["AWS", "Terraform", "Kubernetes"],
  },
  {
    id: "7",
    name: "Grace Howard",
    profession: "Data Analyst",
    email: "grace@connct.dev",
    bio: "Data analyst turning complex datasets into useful insights",
    techStack: ["Python", "SQL", "Tableau"],
  },
  {
    id: "8",
    name: "Henry Nichols",
    profession: "iOS Developer",
    email: "henry@connct.dev",
    bio: "Mobile developer crafting smooth iOS applications",
    techStack: ["Swift", "SwiftUI", "Core Data"],
  },
  {
    id: "9",
    name: "Isabella Torres",
    profession: "UX Researcher",
    email: "isabella@connct.dev",
    bio: "UX researcher who makes products easier to use",
    techStack: ["User Research", "Prototyping", "Usability Testing"],
  },
  {
    id: "10",
    name: "Jackie Flores",
    profession: "Machine Learning Engineer",
    email: "jackie@connct.dev",
    bio: "Machine learning engineer exploring practical AI",
    techStack: ["Python", "PyTorch", "MLOps"],
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

// In-memory storage for bookmarks (resets on server restart, which is fine for mock)
export let bookmarkedProjectIds: string[] = [];

// Helper to toggle a bookmark ID
export const toggleBookmark = (projectId: string) => {
  if (bookmarkedProjectIds.includes(projectId)) {
    bookmarkedProjectIds = bookmarkedProjectIds.filter(
      (id) => id !== projectId,
    );
  } else {
    bookmarkedProjectIds.push(projectId);
  }
  return bookmarkedProjectIds;
};

// Helper to simulate network delay (makes loading states visible)
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
