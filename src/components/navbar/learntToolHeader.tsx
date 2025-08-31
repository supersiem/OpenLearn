"use client";

import { memo, useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { X, ArrowLeft, Check, X as XIcon, Settings } from "lucide-react";
import Link from "next/link";
import Dropdown from "@/components/button/DropdownBtn";
import Image from "next/image";
import Timer from "./Timer";

// Import the images for the learning methods
import learn from "@/app/img/learn.svg";
import test from "@/app/img/test.svg";
import hints from "@/app/img/hint.svg";
import mind from "@/app/img/mind.svg";
import livequiz from "@/app/img/livequiz.svg";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";

// Memoized sub-components to prevent unnecessary re-renders
const BackButton = memo(({ url }: { url: string }) => (
    <Link
        href={url}
        className="flex items-center bg-neutral-700 hover:bg-neutral-600 transition-colors px-3 py-1 rounded-md"
    >
        <ArrowLeft className="h-4 w-4 mr-2" />
        <span>Terug</span>
    </Link>
));
BackButton.displayName = "BackButton";

const ProgressBar = memo(({ progress }: { progress: number }) => (
    <div className="flex-grow mr-4">
        <Progress value={progress} className="h-3 [&>div]:bg-sky-400" />
    </div>
));
ProgressBar.displayName = "ProgressBar";

const StatsCounter = memo(({ count, isCorrect }: { count: number; isCorrect: boolean }) => (
    <span className={`flex items-center px-2 py-1 rounded-md ${isCorrect ? 'text-green-500 bg-green-900/30' : 'text-red-500 bg-red-900/30'
        }`}>
        {isCorrect ? <Check className="h-5 w-5 mr-1" /> : <XIcon className="h-5 w-5 mr-1" />}
        {count}
    </span>
));
StatsCounter.displayName = "StatsCounter";

const StatsDisplay = memo(({ correctAnswers, wrongAnswers }: { correctAnswers: number; wrongAnswers: number }) => (
    <div className="flex items-center gap-3">
        <StatsCounter count={correctAnswers} isCorrect={true} />
        <StatsCounter count={wrongAnswers} isCorrect={false} />
    </div>
));
StatsDisplay.displayName = "StatsDisplay";

const SettingsButton = memo(() => (
    <Dialog>
        <DialogTrigger asChild>
            <button
                className="flex items-center justify-center h-8 w-8 bg-neutral-700 hover:bg-neutral-600 transition-colors rounded-full"
            >
                <Settings className="h-4 w-4" />
            </button>
        </DialogTrigger>
        <DialogContent>
            <DialogTitle>Leerinstellingen</DialogTitle>
            <div className="p-4">
                <p>Learning settings content can go here.</p>
            </div>
        </DialogContent>
    </Dialog>
));
SettingsButton.displayName = "SettingsButton";

const ExitButton = memo(() => (
    <Link
        href="/home/start"
        className="flex items-center justify-center h-8 w-8 bg-neutral-700 hover:bg-neutral-600 transition-colors rounded-full"
    >
        <X className="h-5 w-5" />
    </Link>
));
ExitButton.displayName = "ExitButton";

const MethodDropdown = memo(({
    currentMethod,
    learningMethods
}: {
    currentMethod: string;
    learningMethods: [React.ReactNode, string][]
}) => {
    const getMethodDisplayText = () => {
        switch (currentMethod) {
            case "toets":
                return "Toets";
            case "hints":
                return "Hints";
            case "gedachten":
                return "In gedachten";
            case "multikeuze":
                return "Meerkeuze";
            default:
                return "Leren";
        }
    };

    return (
        <div className="learn-dropdown hidden md:block w-45 mx-5">
            <Dropdown
                text={getMethodDisplayText()}
                dropdownMatrix={learningMethods}
                width={180}
            />
        </div>
    );
});
MethodDropdown.displayName = "MethodDropdown";

interface LearnToolHeaderProps {
    listId: string;
    progress?: number; // 0-100
    correctAnswers?: number;
    wrongAnswers?: number;
    onMethodChange?: (method: string) => void;
    currentMethod?: string;
}

const HeaderLearnTool = memo(({
    listId,
    progress = 0,
    correctAnswers = 0,
    wrongAnswers = 0,
    onMethodChange,
    currentMethod = "leren",
}: LearnToolHeaderProps) => {
    // Check if this is a custom learning session
    const isCustomMode = listId.startsWith('custom-');
    const actualListId = isCustomMode ? listId.replace('custom-', '') : listId;

    // Check if this is a combined list (multiple lists selected)
    const isCombinedList = actualListId.startsWith('combined-');

    // Determine the back button URL
    const backButtonUrl = isCombinedList ? '/home/start' : `/learn/viewlist/${actualListId}`;

    // Memoize the learning methods to prevent unnecessary re-renders
    const learningMethods = useMemo((): [React.ReactNode, string][] => [
        [
            <div key="leren" className="flex items-center">
                <Image
                    src={learn}
                    alt="leren plaatje"
                    width={20}
                    height={20}
                    className="mr-2"
                />
                <span className="font-medium">Leren</span>
            </div>,
            isCustomMode ? `/learn/custom/learn` : `/learn/learnlist/${listId}`,
        ],
        [
            <div key="toets" className="flex items-center">
                <Image
                    src={test}
                    alt="toets plaatje"
                    width={20}
                    height={20}
                    className="mr-2"
                />
                <span className="font-medium">Toets</span>
            </div>,
            isCustomMode ? `/learn/custom/test` : `/learn/test/${listId}`,
        ],
        [
            <div key="hints" className="flex items-center">
                <Image
                    src={hints}
                    alt="hints plaatje"
                    width={20}
                    height={20}
                    className="mr-2"
                />
                <span className="font-medium">Hints</span>
            </div>,
            isCustomMode ? `/learn/custom/hints` : `/learn/hints/${listId}`,
        ],
        [
            <div key="gedachten" className="flex items-center">
                <Image
                    src={mind}
                    alt="gedachten plaatje"
                    width={20}
                    height={20}
                    className="mr-2"
                />
                <span className="font-medium">In gedachten</span>
            </div>,
            isCustomMode ? `/learn/custom/mind` : `/learn/mind/${listId}`,
        ],
        [
            <div key="multikeuze" className="flex items-center">
                <Image
                    src={livequiz}
                    alt="Multikeuze plaatje"
                    width={20}
                    height={20}
                    className="mr-2"
                />
                <span className="font-medium">Multikeuze</span>
            </div>,
            isCustomMode ? `/learn/custom/multichoice` : `/learn/multichoice/${listId}`,
        ],
    ], [isCustomMode, listId]);

    return (
        <>
            <div className="w-full bg-neutral-800 p-3 flex items-center justify-between sticky top-0 z-100 border-b border-neutral-700">
                {/* Left side: Back button and timer */}
                <div className="flex items-center gap-3">
                    <BackButton url={backButtonUrl} />
                    <Timer />
                </div>

                {/* Method dropdown */}
                <MethodDropdown currentMethod={currentMethod} learningMethods={learningMethods} />

                {/* Progress bar */}
                <ProgressBar progress={progress} />

                {/* Right side: Settings, stats, and exit */}
                <div className="flex items-center gap-4">
                    <SettingsButton />
                    <StatsDisplay correctAnswers={correctAnswers} wrongAnswers={wrongAnswers} />
                    <ExitButton />
                </div>
            </div>

            <style>{`
        .learn-dropdown > div.absolute {
          position: fixed !important;
          left: 200px !important;
          top: 3px !important;
          z-index: 150;
        }
      `}</style>
        </>
    );
});
HeaderLearnTool.displayName = "HeaderLearnTool";

export default HeaderLearnTool;
