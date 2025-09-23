"use client";

import { useState, useCallback, memo } from 'react';
import LearnTool from './learnTool';
import LearnToolHeader from '../navbar/learntToolHeader';

interface LearnToolWithProgressProps {
    mode: "toets" | "gedachten" | "hints" | "learn" | "multikeuze" | "leren";
    rawlistdata: any[];
    listId: string;
}

export default memo(function LearnToolWithProgress({
    mode,
    rawlistdata,
    listId,
}: LearnToolWithProgressProps) {

    return (
        <div className="min-h-screen flex flex-col">
            <LearnToolHeader />

            {/* Ensure this container allows LearnTool to grow */}
            <div className="flex-grow flex items-center justify-center py-8"> {/* Added padding */}
                <LearnTool
                    mode={mode}
                    rawlistdata={rawlistdata}
                />
            </div>
        </div>
    );
});
