import type { Metadata } from "next";
import { cache } from "react";

import { loadProfile } from "@/lib/profile-data";
import { loadSettings } from "@/lib/settings-data";

import { ProfileEditor } from "./profile-editor";
import { navSections, sectionFromParam } from "./sections";

// Read once per request, for the title and the page.
const profileOnce = cache(() => loadProfile());

/** "Experience · Profile", so each section's tab and history entry says which it is. */
export async function generateMetadata({ searchParams }: PageProps<"/profile">): Promise<Metadata> {
  const [{ section }, profile] = await Promise.all([searchParams, profileOnce()]);
  const page = sectionFromParam(section, profile.customSections);
  const label = page === "new" ? "Add a section" : navSections(profile.customSections).find((entry) => entry.id === page)?.label;
  return { title: `${label} · Profile` };
}

/** The profile editor; the current section is in `?section=` (E4-1). */
export default async function ProfilePage({ searchParams }: PageProps<"/profile">) {
  const [{ section }, profile, settings] = await Promise.all([searchParams, profileOnce(), loadSettings()]);
  return (
    <ProfileEditor
      initial={profile}
      section={sectionFromParam(section, profile.customSections)}
      order={{ experience: settings.experienceOrder, projects: settings.projectOrder, education: settings.educationOrder, skills: settings.skillOrder }}
      sections={settings.resumeSections}
    />
  );
}
