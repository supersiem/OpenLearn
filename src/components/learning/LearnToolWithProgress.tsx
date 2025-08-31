"use client";

import { useState, useCallback, memo } from 'react';
import LearnTool from './learnTool';
import LearnToolHeader from '../navbar/learntToolHeader';
import { useStreakUpdate } from '@/hooks/useStreakUpdate';

interface LearnToolWithProgressProps {
    mode: "toets" | "gedachten" | "hints" | "learn" | "multikeuze" | "leren";
    rawlistdata: any[];
    listId: string;
    currentMethod?: string;  // Make currentMethod optional
    onComplete?: () => void;
}

export default memo(function LearnToolWithProgress({
    mode,
    rawlistdata,
    listId,
    currentMethod,
    onComplete
}: LearnToolWithProgressProps) {
    const [progress, setProgress] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);

    const handleCorrectAnswer = useCallback(() => {
        setCorrectAnswers(prev => prev + 1);
    }, []);

    const handleWrongAnswer = useCallback(() => {
        setWrongAnswers(prev => prev + 1);
    }, []);

    const handleProgressUpdate = useCallback((completed: number, total: number) => {
        const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        setProgress(progressPercentage);
    }, []);

    // Handle completion - always provide a callback to LearnTool
    const handleCompletion = useCallback(() => {
        // Call the external onComplete callback if provided
        if (onComplete) {
            onComplete();
        }
        // If no external callback, that's fine - LearnTool will handle streak updates internally
    }, [onComplete]);

    return (
        <div className="min-h-screen flex flex-col">
            <LearnToolHeader
                listId={listId}
                progress={progress}
                correctAnswers={correctAnswers}
                wrongAnswers={wrongAnswers}
                currentMethod={currentMethod}
            />

            {/* Ensure this container allows LearnTool to grow */}
            <div className="flex-grow flex items-center justify-center py-8"> {/* Added padding */}
                <LearnTool
                    mode={mode}
                    rawlistdata={rawlistdata}
                    onCorrectAnswer={handleCorrectAnswer}
                    onWrongAnswer={handleWrongAnswer}
                    onProgressUpdate={handleProgressUpdate}
                    onComplete={handleCompletion}
                />
            </div>
        </div>
    );
});
