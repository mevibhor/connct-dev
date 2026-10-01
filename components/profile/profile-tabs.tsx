"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Project, User } from "@/types/models";

import { ProjectCard } from "@/components/feed/project-card";
import { EmptyState } from "@/components/shared/empty-state";

import { FolderGit2, Bookmark, LogOut, Trash2, Upload, X } from "lucide-react";

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

  const [techStack, setTechStack] = useState<string[]>(user.techStack || []);

  const [skillInput, setSkillInput] = useState("");

  const router = useRouter();

  const { toast } = useToast();

  const logout = useAuthStore((state) => state.logout);

  const updateUser = useAuthStore((state) => state.updateUser);

  const queryClient = useQueryClient();

  const [isSaving, setIsSaving] = useState(false);

  const PROF_LIMIT = 50;
  const NAME_LIMIT = 50;

  const MIN_SKILLS = 5;
  const MAX_SKILLS = 10;

  const handleAddSkill = () => {
    const skill = skillInput.trim();

    if (!skill) {
      return;
    }

    const alreadyExists = techStack.some(
      (item) => item.toLowerCase() === skill.toLowerCase(),
    );

    if (alreadyExists) {
      toast({
        title: "Skill already added",
        type: "warning",
      });

      setSkillInput("");
      return;
    }

    if (techStack.length >= MAX_SKILLS) {
      toast({
        title: `You can add a maximum of ${MAX_SKILLS} skills`,
        type: "warning",
      });

      return;
    }

    setTechStack((current) => [...current, skill]);
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setTechStack((current) =>
      current.filter(
        (skill) => skill.toLowerCase() !== skillToRemove.toLowerCase(),
      ),
    );
  };

  const handleSkillKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddSkill();
    }
  };

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

    if (techStack.length < MIN_SKILLS) {
      toast({
        title: `Please add at least ${MIN_SKILLS} skills`,
        type: "error",
      });

      return;
    }

    if (techStack.length > MAX_SKILLS) {
      toast({
        title: `You can add a maximum of ${MAX_SKILLS} skills`,
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
          techStack,
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

                  {/* Skills */}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-foreground">
                          Skills
                        </h3>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Add the technologies you use for collaboration.
                        </p>
                      </div>

                      <span
                        className={
                          techStack.length < MIN_SKILLS
                            ? "shrink-0 text-xs font-medium text-destructive"
                            : "shrink-0 text-xs text-muted-foreground"
                        }
                      >
                        {techStack.length}/{MAX_SKILLS}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleSkillKeyDown}
                        placeholder="Add a skill, e.g. React"
                        disabled={techStack.length >= MAX_SKILLS}
                        className="h-11"
                      />

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddSkill}
                        disabled={
                          !skillInput.trim() || techStack.length >= MAX_SKILLS
                        }
                        className="h-11 shrink-0"
                      >
                        Add Skill
                      </Button>
                    </div>

                    {techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {techStack.map((skill) => (
                          <div
                            key={skill}
                            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-sm text-foreground"
                          >
                            <span>{skill}</span>

                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              aria-label={`Remove ${skill}`}
                              className="rounded-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <p
                      className={
                        techStack.length < MIN_SKILLS
                          ? "text-xs text-destructive"
                          : "text-xs text-muted-foreground"
                      }
                    >
                      {techStack.length < MIN_SKILLS
                        ? `Add at least ${MIN_SKILLS - techStack.length} more ${
                            MIN_SKILLS - techStack.length === 1
                              ? "skill"
                              : "skills"
                          }.`
                        : `You can add up to ${MAX_SKILLS} skills.`}
                    </p>
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
