"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Grid3x3,
  Bookmark,
  Settings,
  MessageCircle,
  ThumbsUp,
  MoreHorizontal,
  Upload,
} from "lucide-react";
import Image from "next/image";

// --- Mock Data ---
const user = {
  name: "Robert Fox",
  username: "@robert",
  role: "Software Engineer",
  avatar: "../images/logo.svg",
  postsCount: 12,
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind",
    "Node.js",
    "PostgreSQL",
  ],
};

const myPosts = [
  {
    id: 1,
    content:
      "Received a lot of questions about breaking into the tech industry lately. If you're starting out or looking to switch careers, feel free to connect with me. I'm here to help and share insights! 🚀",
    time: "7 hours ago",
    likes: 270,
    hasImage: false,
  },
  {
    id: 2,
    content:
      "Just shipped a new feature using Next.js 15 and React 19. The performance improvements are insane! Check out the repo link in bio.",
    time: "1 day ago",
    likes: 142,
    hasImage: true,
    imageUrl: "../images/logo.svg",
  },
];

const savedPosts = [
  {
    id: 1,
    author: "Bessie Cooper",
    authorRole: "Digital Marketer",
    content:
      "In today's fast-paced, digitally driven world, digital marketing is not just a strategy; it's a necessity for businesses of all sizes. 📈",
    time: "7 hours ago",
    likes: 270,
  },
  {
    id: 2,
    author: "Jacob Jones",
    authorRole: "Sales Manager",
    content: "Prepare to be dazzled by our latest collection! From...",
    time: "1 day ago",
    likes: 45,
    hasImage: true,
    imageUrl: "../images/logo.svg",
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts"); // posts, saved, settings
  const [settingsSubTab, setSettingsSubTab] = useState("general"); // general, account

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
      {/* Responsive Grid Container */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-12">
        {/* ==========================================
            LEFT COLUMN: Profile Info (Sticky on Desktop)
            ========================================== */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="flex flex-col items-center space-y-4 rounded-xl border border-border bg-card p-6 text-center md:sticky md:top-8">
            {/* Avatar */}
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>RF</AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
              <p className="text-sm text-muted-foreground">{user.username}</p>
              <p className="text-sm font-medium text-primary">{user.role}</p>
            </div>

            <Separator className="my-2" />

            {/* Stats */}
            <div className="flex w-full justify-center gap-8 py-2">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-foreground">
                  {user.postsCount}
                </span>
                <span className="text-xs tracking-wide text-muted-foreground uppercase">
                  Posts
                </span>
              </div>
            </div>

            {/* Skills Tags */}
            <div className="w-full">
              <p className="mb-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                Skills & Technologies
              </p>
              <div className="flex flex-wrap justify-start gap-2">
                {user.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="cursor-default bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            RIGHT COLUMN: Main Content (Tabs & Feed)
            ========================================== */}
        <div className="space-y-6 md:col-span-8 lg:col-span-9">
          {/* Main Navigation Tabs */}
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex flex-1 items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${activeTab === "posts" ? "border-b-2 border-primary bg-muted/50 text-primary" : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"}`}
              >
                <Grid3x3 className="h-4 w-4" /> My Posts
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`flex flex-1 items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${activeTab === "saved" ? "border-b-2 border-primary bg-muted/50 text-primary" : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"}`}
              >
                <Bookmark className="h-4 w-4" /> Saved Posts
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex flex-1 items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${activeTab === "settings" ? "border-b-2 border-primary bg-muted/50 text-primary" : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"}`}
              >
                <Settings className="h-4 w-4" /> Settings
              </button>
            </div>

            {/* Tab Content Area */}
            <div className="min-h-100 p-4 md:p-6">
              {/* --- POSTS TAB --- */}
              {activeTab === "posts" && (
                <div className="space-y-4">
                  {myPosts.map((post) => (
                    <div
                      key={post.id}
                      className="space-y-3 rounded-lg border border-border bg-background/50 p-4 transition-colors hover:border-primary/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>RF</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.role}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <MoreHorizontal className="h-4 w-4 cursor-pointer text-muted-foreground" />
                          <p className="mt-1 text-xs text-muted-foreground">
                            {post.time}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed text-foreground">
                        {post.content}
                      </p>

                      {post.hasImage && (
                        <div className="overflow-hidden rounded-lg border border-border">
                          <Image
                            src=""
                            alt="Post content"
                            className="h-64 w-full object-cover"
                            height={24}
                            width={24}
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-border/50 pt-2 text-sm text-muted-foreground">
                        <button className="flex items-center gap-2 transition-colors hover:text-primary">
                          <MessageCircle className="h-4 w-4" /> Comment
                        </button>
                        <button className="flex items-center gap-2 transition-colors hover:text-primary">
                          <ThumbsUp className="h-4 w-4" /> {post.likes} Likes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* --- SAVED TAB --- */}
              {activeTab === "saved" && (
                <div className="space-y-4">
                  {savedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="space-y-3 rounded-lg border border-border bg-background/50 p-4 transition-colors hover:border-primary/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{post.author[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {post.author}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {post.authorRole}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <MoreHorizontal className="h-4 w-4 cursor-pointer text-muted-foreground" />
                          <p className="mt-1 text-xs text-muted-foreground">
                            {post.time}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed text-foreground">
                        {post.content}
                      </p>

                      {post.hasImage && (
                        <div className="overflow-hidden rounded-lg border border-border">
                          <Image
                            src={post.imageUrl}
                            alt="Saved content"
                            className="h-64 w-full object-cover"
                            height={24}
                            width={24}
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-border/50 pt-2 text-sm text-muted-foreground">
                        <button className="flex items-center gap-2 transition-colors hover:text-primary">
                          <MessageCircle className="h-4 w-4" /> Comment
                        </button>
                        <button className="flex items-center gap-2 transition-colors hover:text-primary">
                          <ThumbsUp className="h-4 w-4" /> {post.likes} Likes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* --- SETTINGS TAB --- */}
              {activeTab === "settings" && (
                <div className="mx-auto max-w-2xl space-y-6">
                  {/* Settings Sub-Navigation */}
                  <div className="mx-auto flex w-fit rounded-lg bg-muted p-1 md:mx-0">
                    <button
                      onClick={() => setSettingsSubTab("general")}
                      className={`rounded-md px-6 py-1.5 text-sm font-medium transition-all ${settingsSubTab === "general" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                    >
                      General
                    </button>
                    <button
                      onClick={() => setSettingsSubTab("account")}
                      className={`rounded-md px-6 py-1.5 text-sm font-medium transition-all ${settingsSubTab === "account" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                    >
                      Account
                    </button>
                  </div>

                  {settingsSubTab === "general" && (
                    <div className="space-y-6 pt-4">
                      {/* Avatar Upload */}
                      <div className="flex flex-col items-center space-y-2 md:items-start">
                        <Button
                          variant="outline"
                          className="w-full border-dashed border-border text-muted-foreground hover:bg-muted hover:text-foreground md:w-auto"
                        >
                          <Upload className="mr-2 h-4 w-4" /> Choose an image
                          for avatar
                        </Button>
                      </div>

                      {/* Inputs Grid */}
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Full Name
                          </label>
                          <Input
                            placeholder="Full name"
                            defaultValue={user.name}
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Username
                          </label>
                          <Input
                            placeholder="Username"
                            defaultValue={user.username}
                            disabled
                            className="h-11 cursor-not-allowed bg-muted/50"
                          />
                          <p className="text-xs text-muted-foreground">
                            Username cannot be changed currently.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Bio
                        </label>
                        <Textarea
                          placeholder="Tell us about yourself..."
                          className="min-h-30 resize-none"
                        />
                      </div>

                      <div className="pt-4">
                        <Button className="w-full px-8 md:w-auto">
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}

                  {settingsSubTab === "account" && (
                    <div className="space-y-6 border-t border-border pt-8">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-destructive">
                          Delete Account
                        </h3>
                        <p className="max-w-md text-sm text-muted-foreground">
                          Once you delete your account, there is no going back.
                          Please be certain. This action will remove all your
                          posts and data permanently.
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        className="w-full md:w-auto"
                      >
                        Delete Account
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
