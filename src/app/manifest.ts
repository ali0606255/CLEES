import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "كلييز — Clees",
    short_name: "Clees",
    description: "إدارة وتنظيف الشقق المفروشة في أبها",
    start_url: "/ar",
    display: "standalone",
    background_color: "#F6F3EE",
    theme_color: "#0F3D3E",
    lang: "ar",
    dir: "rtl",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
