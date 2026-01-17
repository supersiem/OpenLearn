import i18n from "i18next";
import { useEffect, useState } from "react";
import Button1 from "~/components/Button1";

function handleLoginClick() {
    // Voeg hier de logica toe die moet worden uitgevoerd bij het klikken op de knop
    console.log("Login knop geklikt");
}

export default function Home() {
    const [login, setlogniLabel] = useState("login");

    useEffect(() => {
        setlogniLabel(i18n.t("loginRelated:login"));
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white" >
            <Button1 onClick={handleLoginClick}>
                {login}
            </Button1>
        </div>
    );
}