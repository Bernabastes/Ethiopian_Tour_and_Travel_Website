import { Facebook, Instagram, Youtube } from "lucide-react";
import { company } from "@/data/company";

// X/Twitter and TikTok aren't in lucide's stable set — use lightweight inline glyphs.
function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 3c.3 2.1 1.6 3.7 3.5 4v2.5c-1.3 0-2.5-.4-3.5-1v6.3a5.8 5.8 0 1 1-5.8-5.8c.3 0 .6 0 .9.1v2.7a3.1 3.1 0 1 0 2.2 3V3h2.7Z" />
    </svg>
  );
}
function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-7 8 8.2 12h-6.4l-5-7.3L5.9 22H2.8l7.5-8.6L2.4 2h6.5l4.5 6.7L18.9 2Zm-1.1 18h1.8L7.3 4H5.4l12.4 16Z" />
    </svg>
  );
}

const links = [
  { href: company.social.facebook, label: "Facebook", Icon: Facebook },
  { href: company.social.instagram, label: "Instagram", Icon: Instagram },
  { href: company.social.tiktok, label: "TikTok", Icon: TikTokIcon },
  { href: company.social.youtube, label: "YouTube", Icon: Youtube },
  { href: company.social.twitter, label: "X (Twitter)", Icon: XIcon },
];

export function SocialLinks({
  className = "",
  iconSize = 20,
  tone = "light",
}: {
  className?: string;
  iconSize?: number;
  tone?: "light" | "dark";
}) {
  const base =
    tone === "light"
      ? "text-white/80 hover:text-brand-gold"
      : "text-ink/60 hover:text-brand-green";
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`transition-colors ${base}`}
        >
          <Icon size={iconSize} />
        </a>
      ))}
    </div>
  );
}
