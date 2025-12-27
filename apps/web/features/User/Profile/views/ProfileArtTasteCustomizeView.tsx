"use client";

import { ArtTasteSlider } from "../components/ArtTasteSlider";

export const ProfileArtTasteCustomizeView = () => {
  return (
    <div className="relative h-dvh flex items-center justify-center flex-col px-4">
      <div className="h-auth-header-height-mobile w-full bg-red-500"></div>
      <div className="w-full flex-col flex h-full gap-8 max-w-sm mx-auto py-4">
        <ArtTasteSlider />
      </div>
    </div>
  );
};
