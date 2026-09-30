export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  techStack?: string[];
  profession?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

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
