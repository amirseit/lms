// src/app/dev2/page.tsx (Server Component – no "use client")
export default function Dev2() {
  // render-time error -> caught by app/error.tsx
  throw new Error("Render blowup from /dev2");
}
