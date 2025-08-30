import { Metadata } from "next";
import { getProfileServer } from "@/lib/api/serverApi"; // <-- змінив імпорт
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
          <h1 className={css.formTitle}>Profile Page</h1>
          <a href="#" className={css.editProfileButton}>
            Edit Profile
          </a>
        </div>
        <div className={css.avatarWrapper}>
          <img
            src="Avatar"
            alt="User Avatar"
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
