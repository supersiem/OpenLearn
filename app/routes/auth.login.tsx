import i18n from "i18next";
import { Button } from '@polarnl/polarui-react'
function handleLoginClick() {
  console.log("Login knop geklikt");
}

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center" >
      <Button onClick={handleLoginClick}>
        {i18n.t("auth:login")}
      </Button>
    </div>
  );
}