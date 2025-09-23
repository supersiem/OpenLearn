"use client";

import { memo } from "react";

interface LearnToolProps {
  mode: "toets" | "gedachten" | "hints" | "learn" | "multikeuze" | "leren";
  rawlistdata: any[];
  onCorrectAnswer?: () => void;
  onWrongAnswer?: () => void;
  onProgressUpdate?: (completed: number, total: number) => void;
  onComplete?: () => void;
  flipQuestionLang?: boolean;
}

const LearnTool = ({
  mode,
  rawlistdata,
  onCorrectAnswer,
  onWrongAnswer,
  onProgressUpdate,
  onComplete,
  flipQuestionLang = false,
}: LearnToolProps) => {
  return (
    <div>
      {/* Empty LearnTool component */}
    </div>
  );
};

export default memo(LearnTool);
