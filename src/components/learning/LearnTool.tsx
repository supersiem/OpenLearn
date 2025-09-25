"use client";
import React, { useState, useEffect } from 'react';
import { useListStore } from './listStore';
import Button1 from '@/components/button/Button1';

export default function LearnTool() {
  const {
    currentList,
    currentWord,
    currentMethod,
    setRandomCurrentWord,
    checkAnswer,
    answerCorrect,
    answerWrong,
    score
  } = useListStore();

  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // No need for useEffect - currentWord is set server-side with first shuffled word

  const handleSubmit = () => {
    if (!currentWord || !userInput.trim()) return;

    const correct = checkAnswer(userInput);
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      answerCorrect();
    } else {
      answerWrong(userInput);
    }
  };

  const handleNext = () => {
    setUserInput('');
    setShowResult(false);
    setRandomCurrentWord();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showResult) {
      handleSubmit();
    } else if (e.key === 'Enter' && showResult) {
      handleNext();
    }
  };

  // For SSR compatibility, render the interface even without currentWord
  // The useEffect will set a random word on client-side
  const displayWord = currentWord;

  if (!currentList || !currentList.data?.length) {
    return (
      <div className="bg-neutral-800 rounded-lg p-8 w-full max-w-md mx-auto text-white text-center">
        <p>No learning data available</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-800 rounded-lg p-8 w-full max-w-md mx-auto text-white">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold mb-2">
          {currentMethod === 'learnlist' ? 'Leren' :
            currentMethod === 'test' ? 'Toets' :
              currentMethod === 'hints' ? 'Hints' :
                currentMethod === 'mind' ? 'In gedachten' :
                  'Leren'}
        </h2>
        <p className="text-sm text-neutral-400">
          Score: {score.correct} correct, {score.wrong} wrong
        </p>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-neutral-400 mb-2">Vertaal:</p>
          <div className="text-2xl font-bold mb-4">
            {displayWord?.["1"] || "Loading..."}
          </div>
        </div>

        <hr className="border-neutral-600" />

        <div className="space-y-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Typ je antwoord..."
            className="w-full bg-neutral-700 text-white p-3 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={showResult}
          />

          {showResult && currentWord && (
            <div className={`text-center p-4 rounded-lg ${isCorrect ? 'bg-green-900' : 'bg-red-900'}`}>
              <p className="font-semibold">
                {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
              </p>
              {!isCorrect && (
                <p className="mt-2">
                  Het juiste antwoord is: <strong>{currentWord["2"]}</strong>
                </p>
              )}
            </div>
          )}

          <div className="text-center">
            {!showResult ? (
              <Button1
                text="Controleer"
                onClick={handleSubmit}
                disabled={!userInput.trim()}
              />
            ) : (
              <Button1
                text="Volgende"
                onClick={handleNext}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}