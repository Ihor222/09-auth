import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProfileServer } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "User profile page",
  openGraph: {
    title: "Profile | NoteHub",
    description: "User profile page",
    url: "https://your-app.com/profile",
    siteName: "NoteHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile | NoteHub",
    description: "User profile page",
  },
};

export default async function ProfilePage() {
  const profile = await getProfileServer();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={profile.avatar || "/avatar-placeholder.png"}
            alt={`${profile.username} avatar`}
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {profile.username}</p>
          <p>Email: {profile.email}</p>
        </div>
      </div>
    </main>
  );
}
