"use client";

import { useEffect, useState } from "react";
import type { Profile } from "@/types/profile";
import type { UserDetails } from "@/types/user-details";
import {
  getAvatarColorClass,
  getAvatarInitial,
  resolveAvatarSrc,
} from "@/utils/user-avatar";

type UserAvatarSize = "sm" | "md" | "lg";

const sizeClasses: Record<UserAvatarSize, string> = {
  sm: "size-8 text-xs",
  md: "size-9 text-sm",
  lg: "size-12 text-base",
};

type UserAvatarProps = {
  displayName: string;
  user?: Profile | null;
  userDetails?: UserDetails | null;
  size?: UserAvatarSize;
  className?: string;
};

export function UserAvatar({
  displayName,
  user,
  userDetails,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const avatarSrc = resolveAvatarSrc(userDetails, user);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [avatarSrc]);

  const initial = getAvatarInitial(displayName, user, userDetails);
  const colorClass = getAvatarColorClass(user?._id ?? displayName);
  const sizeClass = sizeClasses[size];
  const showImage = Boolean(avatarSrc) && !imageFailed;

  if (showImage && avatarSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarSrc}
        alt={displayName}
        onError={() => setImageFailed(true)}
        className={`rounded-full object-cover ${sizeClass} ${className}`.trim()}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-platform-white ${colorClass} ${sizeClass} ${className}`.trim()}
    >
      {initial}
    </span>
  );
}
