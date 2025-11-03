"use client"

import { useEffect } from "react";
import { useUserDataStore } from "@/store/user/UserDataProvider";

export default function Chatwoot({
  url,
  token,
  hmac,
}: {
  url?: string;
  token?: string;
  hmac?: string;
}) {
  const user = useUserDataStore().getState();
  useEffect(() => {
    if (!url || !token || !hmac) {
      return;
    }

    // Set settings before loading the script
    (window as any).chatwootSettings = {
      locale: "nl",
      darkMode: "auto",
      type: "expanded_bubble"
    };

    const script = document.createElement("script");
    script.src = `${url}/packs/js/sdk.js`;
    script.async = true;

    script.onload = () => {
      if (typeof window !== "undefined" && (window as any).chatwootSDK) {
        (window as any).chatwootSDK.run({
          websiteToken: token,
          baseUrl: url,
          identifierHash: hmac,
        });

        // Set user after SDK is loaded
        if ((window as any).$chatwoot) {
          (window as any).$chatwoot.setUser(user.id, {
            name: user.name,
            email: user.email,
            avatar_url: user.image,
            identifier_hash: hmac,
          });
        }
      }
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [url, token, hmac]);

  return null;
}