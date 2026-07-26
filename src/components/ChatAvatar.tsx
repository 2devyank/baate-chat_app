import { useMemo, useState } from "react";

type ChatAvatarProps = {
  src?: string | null;
  title?: string | null;
  className?: string;
};

const avatarColors = [
  "#0e7490",
  "#2563eb",
  "#7c3aed",
  "#be123c",
  "#047857",
  "#b45309",
];

const getInitial = (title?: string | null) => {
  const cleanedTitle = title?.trim();
  return cleanedTitle ? cleanedTitle.charAt(0).toUpperCase() : "?";
};

const getColor = (title?: string | null) => {
  const name = title?.trim() || "chat";
  const total = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return avatarColors[total % avatarColors.length];
};

const ChatAvatar = ({ src, title, className = "" }: ChatAvatarProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const initial = getInitial(title);
  const backgroundColor = useMemo(() => getColor(title), [title]);
  const shouldShowImage = Boolean(src && !imageFailed);

  return (
    <span
      className={`chatavatar ${className}`}
      style={{ backgroundColor }}
      aria-label={`${title || "Chat"} avatar`}
    >
      {shouldShowImage ? (
        <img src={src || ""} alt="" onError={() => setImageFailed(true)} />
      ) : (
        <span aria-hidden="true">{initial}</span>
      )}
    </span>
  );
};

export default ChatAvatar;
