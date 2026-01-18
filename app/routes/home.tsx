import i18n from "i18next";
import Button1 from "~/components/Button1";

export default function Home() {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <Button1 redirectTo="/auth/login">
        {i18n.t("loginRelated:login")}
      </Button1>
    </div>
  );
}