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
  avatar: "./images/logo.svg",
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
    imageUrl: "./images/logo.svg",
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
    imageUrl: "./images/logo.svg",
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts"); // posts, saved, settings
  const [settingsSubTab, setSettingsSubTab] = useState("general"); // general, account

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
      {/* Responsive Grid Container */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* ==========================================
            LEFT COLUMN: Profile Info (Sticky on Desktop)
            ========================================== */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center space-y-4 md:sticky md:top-8">
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
            <div className="w-full flex justify-center gap-8 py-2">
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg text-foreground">
                  {user.postsCount}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Posts
                </span>
              </div>
            </div>

            {/* Skills Tags */}
            <div className="w-full">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-3 text-left">
                Skills & Technologies
              </p>
              <div className="flex flex-wrap gap-2 justify-start">
                {user.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
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
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          {/* Main Navigation Tabs */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex-1 py-4 flex justify-center items-center gap-2 text-sm font-medium transition-colors ${activeTab === "posts" ? "text-primary border-b-2 border-primary bg-muted/50" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}`}
              >
                <Grid3x3 className="h-4 w-4" /> My Posts
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`flex-1 py-4 flex justify-center items-center gap-2 text-sm font-medium transition-colors ${activeTab === "saved" ? "text-primary border-b-2 border-primary bg-muted/50" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}`}
              >
                <Bookmark className="h-4 w-4" /> Saved Posts
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 py-4 flex justify-center items-center gap-2 text-sm font-medium transition-colors ${activeTab === "settings" ? "text-primary border-b-2 border-primary bg-muted/50" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}`}
              >
                <Settings className="h-4 w-4" /> Settings
              </button>
            </div>

            {/* Tab Content Area */}
            <div className="p-4 md:p-6 min-h-100">
              {/* --- POSTS TAB --- */}
              {activeTab === "posts" && (
                <div className="space-y-4">
                  {myPosts.map((post) => (
                    <div
                      key={post.id}
                      className="border border-border rounded-lg p-4 bg-background/50 space-y-3 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
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
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground cursor-pointer" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {post.time}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-foreground leading-relaxed">
                        {post.content}
                      </p>

                      {post.hasImage && (
                        <div className="rounded-lg overflow-hidden border border-border">
                          <Image
                            src={post.imageUrl}
                            alt="Post content"
                            className="w-full h-64 object-cover"
                            height={24}
                            width={24}
                          />
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2 text-muted-foreground text-sm border-t border-border/50">
                        <button className="flex items-center gap-2 hover:text-primary transition-colors">
                          <MessageCircle className="h-4 w-4" /> Comment
                        </button>
                        <button className="flex items-center gap-2 hover:text-primary transition-colors">
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
                      className="border border-border rounded-lg p-4 bg-background/50 space-y-3 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
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
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground cursor-pointer" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {post.time}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-foreground leading-relaxed">
                        {post.content}
                      </p>

                      {post.hasImage && (
                        <div className="rounded-lg overflow-hidden border border-border">
                          <Image
                            src={post.imageUrl}
                            alt="Saved content"
                            className="w-full h-64 object-cover"
                            height={24}
                            width={24}
                          />
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2 text-muted-foreground text-sm border-t border-border/50">
                        <button className="flex items-center gap-2 hover:text-primary transition-colors">
                          <MessageCircle className="h-4 w-4" /> Comment
                        </button>
                        <button className="flex items-center gap-2 hover:text-primary transition-colors">
                          <ThumbsUp className="h-4 w-4" /> {post.likes} Likes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* --- SETTINGS TAB --- */}
              {activeTab === "settings" && (
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Settings Sub-Navigation */}
                  <div className="flex p-1 bg-muted rounded-lg w-fit mx-auto md:mx-0">
                    <button
                      onClick={() => setSettingsSubTab("general")}
                      className={`px-6 py-1.5 text-sm font-medium rounded-md transition-all ${settingsSubTab === "general" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                    >
                      General
                    </button>
                    <button
                      onClick={() => setSettingsSubTab("account")}
                      className={`px-6 py-1.5 text-sm font-medium rounded-md transition-all ${settingsSubTab === "account" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                    >
                      Account
                    </button>
                  </div>

                  {settingsSubTab === "general" && (
                    <div className="space-y-6 pt-4">
                      {/* Avatar Upload */}
                      <div className="flex flex-col items-center md:items-start space-y-2">
                        <Button
                          variant="outline"
                          className="w-full md:w-auto border-dashed border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <Upload className="mr-2 h-4 w-4" /> Choose an image
                          for avatar
                        </Button>
                      </div>

                      {/* Inputs Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            className="h-11 bg-muted/50 cursor-not-allowed"
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
                        <Button className="w-full md:w-auto px-8">
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}

                  {settingsSubTab === "account" && (
                    <div className="space-y-6 pt-8 border-t border-border">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-destructive">
                          Delete Account
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md">
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
