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
      type: "expanded_bubble",
      baseDomain: process.env.NEXT_PUBLIC_URL 
    };

    const initializeChatwoot = () => {
      if ((window as any).chatwootSDK) {
        (window as any).chatwootSDK.run({
          websiteToken: token,
          baseUrl: url,
          identifierHash: hmac,
        });

        if ((window as any).$chatwoot) {
          console.log("Setting user with id:", user.id, "HMAC:", hmac);
          (window as any).$chatwoot.setUser(user.id, {
            name: user.name,
            email: user.email,
            avatar_url: user.image,
          });
        }
      }
    };

    // Check if SDK is already loaded
    if ((window as any).chatwootSDK) {
      initializeChatwoot();
      return;
    }

    // Script not yet loaded, create and append it
    const script = document.createElement("script");
    script.src = `${url}/packs/js/sdk.js`;
    script.async = true;

    script.onload = () => {
      if (typeof window !== "undefined") {
        initializeChatwoot();
      }
    };

    document.body.appendChild(script);
  }, [url, token, hmac, user.email, user.name, user.image]);

  return null;
}
