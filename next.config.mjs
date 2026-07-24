/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Placeholder image hosts — swap/remove when real assets are added to /public.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Supabase Storage public bucket (uploaded images)
      { protocol: "https", hostname: "*.supabase.co" },
    ],
    formats: ["image/webp"],
  },
  async headers() {
    return [
      {
        // Long cache for static assets (§1.2 Caching).
        source: "/:all*(svg|jpg|jpeg|png|webp|gif|ico|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
