import i18n from "i18next";
import Button1 from "~/components/Button1";
import { useEffect, useState } from "react";

export default function Home() {
  const [loginLabel, setLoginLabel] = useState("login");

  useEffect(() => {
    setLoginLabel(i18n.t("loginRelated:login"));
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <Button1 redirectTo="/auth/login">
        {loginLabel}
      </Button1>
    </div>
  );
}