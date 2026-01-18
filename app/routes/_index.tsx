import i18n from "i18next";
import { Button } from '@polarnl/polarui-react'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Button onClick={() => { alert('test') }}>
        {i18n.t("auth:login")}
      </Button>
    </div>
  );
}