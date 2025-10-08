"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

export default function PostHogInit() {
    useEffect(() => {
        const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
        if (!key) return;

        posthog.init(key, {
            api_host:
                process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
            capture_pageview: true, // auto pageviews
        });
    }, []);

    return null;
}
