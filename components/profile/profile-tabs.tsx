"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Project, User } from "@/types/models";

import { ProjectCard } from "@/components/feed/project-card";
import { EmptyState } from "@/components/shared/empty-state";

import { FolderGit2, Bookmark, LogOut, Trash2, Upload } from "lucide-react";

import { useAuthStore } from "@/stores/use-auth-store";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import { ThemeSwitcher } from "./theme-switcher";

import type { ProfileSection } from "./profile-header";

import { useQueryClient } from "@tanstack/react-query";

interface ProfileTabsProps {
  user: User;
  projects: Project[];
  bookmarkedProjects: Project[];
  activeSection: ProfileSection;
}

export function ProfileTabs({
  user,
  projects,
  bookmarkedProjects,
  activeSection,
}: ProfileTabsProps) {
  const [profession, setProfession] = useState(user.profession || "");

  const [name, setName] = useState(user.name || "");

  const [bio, setBio] = useState(user.bio || "");

  const router = useRouter();

  const { toast } = useToast();

  const logout = useAuthStore((state) => state.logout);

  const updateUser = useAuthStore((state) => state.updateUser);

  const queryClient = useQueryClient();

  const [isSaving, setIsSaving] = useState(false);

  const PROF_LIMIT = 50;
  const NAME_LIMIT = 50;
  const BIO_LIMIT = 200;

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Name is required",
        type: "error",
      });

      return;
    }

    if (!profession.trim()) {
      toast({
        title: "Profession is required",
        type: "error",
      });

      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/profile/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          profession,
          bio,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to update profile");
      }

      updateUser(result.data);

      await queryClient.invalidateQueries({
        queryKey: ["profile", user.id],
      });

      toast({
        title: "Profile updated successfully!",
        type: "success",
      });
    } catch (error) {
      toast({
        title:
          error instanceof Error ? error.message : "Failed to update profile",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion requested (Mock)",
      type: "warning",
    });

    logout();

    router.push("/login");
  };

  const handleLogout = () => {
    logout();

    router.push("/login");
  };

  /*
   * ============================================================
   * POSTS
   * ============================================================
   */

  if (activeSection === "posts") {
    return (
      <section className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FolderGit2}
            title="No posts yet"
            description="Share your first project!"
          />
        )}
      </section>
    );
  }

  /*
   * ============================================================
   * BOOKMARKED POSTS
   * ============================================================
   */

  if (activeSection === "saved") {
    return (
      <section className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {bookmarkedProjects.length > 0 ? (
          <div className="space-y-4">
            {bookmarkedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Bookmark}
            title="No saved posts"
            description="Bookmarks will appear here."
          />
        )}
      </section>
    );
  }

  /*
   * ============================================================
   * SETTINGS
   * ============================================================
   *
   * General is always the default whenever Settings is opened.
   */

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <Tabs defaultValue="general" className="w-full">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          {/* ====================================================
              SETTINGS MINI SIDEBAR
          ===================================================== */}

          <TabsList className="h-auto w-full shrink-0 justify-start rounded-lg border border-border bg-muted/30 p-1 lg:w-48 lg:flex-col lg:items-stretch">
            <TabsTrigger
              value="general"
              className="flex-1 justify-center rounded-md px-4 py-2.5 text-sm font-normal text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm lg:justify-start"
            >
              General
            </TabsTrigger>

            <TabsTrigger
              value="account"
              className="flex-1 justify-center rounded-md px-4 py-2.5 text-sm font-normal text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm lg:justify-start"
            >
              Account
            </TabsTrigger>

            <TabsTrigger
              value="logout"
              className="flex-1 justify-center rounded-md px-4 py-2.5 text-sm font-normal text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm lg:justify-start"
            >
              Logout
            </TabsTrigger>
          </TabsList>

          {/* ====================================================
              SETTINGS CONTENT
          ===================================================== */}

          <div className="min-w-0 flex-1">
            {/* ==================================================
                GENERAL
            =================================================== */}

            <TabsContent
              value="general"
              className="mt-0 focus-visible:outline-none"
            >
              <div className="rounded-xl border border-border bg-background">
                <div className="border-b border-border px-5 py-5 sm:px-8">
                  <h2 className="text-base font-semibold text-foreground">
                    General
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage your profile information and appearance.
                  </p>
                </div>

                <div className="space-y-7 px-5 py-6 sm:px-8 sm:py-8">
                  {/* Avatar */}

                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 w-full justify-start border-dashed font-normal text-muted-foreground hover:text-foreground sm:max-w-md"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose an image for avatar
                  </Button>

                  {/* Full name */}

                  <div className="space-y-2">
                    <Input
                      id="name"
                      value={name}
                      maxLength={NAME_LIMIT}
                      onChange={(e) =>
                        setName(e.target.value.slice(0, NAME_LIMIT))
                      }
                      placeholder="Full name"
                      className="h-11"
                    />

                    <div className="flex justify-end">
                      <span className="text-xs text-muted-foreground">
                        {name.length}/{NAME_LIMIT}
                      </span>
                    </div>
                  </div>

                  {/* Profession */}

                  <div className="space-y-2">
                    <Input
                      id="profession"
                      value={profession}
                      maxLength={PROF_LIMIT}
                      onChange={(e) =>
                        setProfession(e.target.value.slice(0, PROF_LIMIT))
                      }
                      placeholder="Profession"
                      className="h-11"
                    />

                    <div className="flex justify-end">
                      <span className="text-xs text-muted-foreground">
                        {profession.length}/{PROF_LIMIT}
                      </span>
                    </div>
                  </div>

                  {/* Bio */}

                  <div className="space-y-2">
                    <Textarea
                      id="bio"
                      value={bio}
                      maxLength={BIO_LIMIT}
                      onChange={(e) =>
                        setBio(e.target.value.slice(0, BIO_LIMIT))
                      }
                      placeholder="Tell people a little about yourself, your interests, or what you're building..."
                      rows={4}
                      className="resize-none"
                    />

                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs text-muted-foreground">
                        Keep it short and introduce yourself to other
                        developers.
                      </p>

                      <span className="shrink-0 text-xs text-muted-foreground">
                        {bio.length}/{BIO_LIMIT}
                      </span>
                    </div>
                  </div>

                  {/* Theme */}

                  <div className="border-t border-border pt-7">
                    <ThemeSwitcher />
                  </div>

                  {/* Save */}

                  <div className="flex justify-end border-t border-border pt-6">
                    <Button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full sm:w-auto"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ==================================================
                ACCOUNT
            =================================================== */}

            <TabsContent
              value="account"
              className="mt-0 focus-visible:outline-none"
            >
              <div className="rounded-xl border border-border bg-background">
                <div className="border-b border-border px-5 py-5 sm:px-8">
                  <h2 className="text-base font-semibold text-foreground">
                    Account
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage your account.
                  </p>
                </div>

                <div className="px-5 py-8 sm:px-8 sm:py-10">
                  <div className="max-w-2xl">
                    <h3 className="text-lg font-semibold text-foreground">
                      Delete Account
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      This action is irreversible and will permanently delete
                      all your data associated with the account.
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDeleteAccount}
                      className="hover:text-destructive-foreground mt-6 border-destructive text-destructive hover:bg-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete My Account
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ==================================================
                LOGOUT
            =================================================== */}

            <TabsContent
              value="logout"
              className="mt-0 focus-visible:outline-none"
            >
              <div className="rounded-xl border border-border bg-background">
                <div className="flex min-h-80 flex-col items-center justify-center px-5 py-10 text-center">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <LogOut className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground">
                    Logout
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                    Are you sure you want to logout? You will need to login
                    again to access your account.
                  </p>

                  <Button type="button" onClick={handleLogout} className="mt-6">
                    Logout
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </section>
  );
}
