'use client';

import { useState } from 'react';

interface QuestionRendererProps {
  question: {
    id: string;
    question_type: string;
    question_text: string;
    question_media?: any;
    answer_config: any;
    correct_answer?: any;
    explanation?: string | null;
  };
  answer: any;
  onAnswerChange: (answer: any) => void;
  showFeedback?: boolean;
}

export function QuestionRenderer({
  question,
  answer,
  onAnswerChange,
  showFeedback = false,
}: QuestionRendererProps) {
  const isCorrect = showFeedback && question.correct_answer
    ? JSON.stringify(answer) === JSON.stringify(question.correct_answer)
    : null;

  switch (question.question_type) {
    case 'multiple_choice':
      return <MultipleChoiceQuestion question={question} answer={answer} onAnswerChange={onAnswerChange} showFeedback={showFeedback} isCorrect={isCorrect} />;
    case 'multiple_select':
      return <MultipleSelectQuestion question={question} answer={answer} onAnswerChange={onAnswerChange} showFeedback={showFeedback} />;
    case 'true_false':
      return <TrueFalseQuestion question={question} answer={answer} onAnswerChange={onAnswerChange} showFeedback={showFeedback} isCorrect={isCorrect} />;
    case 'fill_blank':
      return <FillBlankQuestion question={question} answer={answer} onAnswerChange={onAnswerChange} showFeedback={showFeedback} />;
    case 'short_answer':
      return <ShortAnswerQuestion question={question} answer={answer} onAnswerChange={onAnswerChange} showFeedback={showFeedback} />;
    default:
      return <div className="text-gray-500 italic">Question type not supported: {question.question_type}</div>;
  }
}

function MultipleChoiceQuestion({ question, answer, onAnswerChange, showFeedback, isCorrect }: any) {
  const options = question.answer_config?.options || [];
  const selected = answer?.selected;

  return (
    <div>
      <p className="text-lg font-medium text-gray-900 mb-4">{question.question_text}</p>
      <div className="space-y-2">
        {options.map((option: any) => {
          const isSelected = selected === option.id;
          const isCorrectOption = showFeedback && question.correct_answer?.selected === option.id;
          return (
            <label
              key={option.id}
              className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${
                showFeedback && isCorrectOption
                  ? 'border-green-500 bg-green-50'
                  : ''
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.id}
                checked={isSelected}
                onChange={() => onAnswerChange({ selected: option.id })}
                className="w-5 h-5 text-primary-500"
                disabled={showFeedback}
              />
              <span className="flex-1 text-gray-900">{option.text}</span>
              {showFeedback && isCorrectOption && (
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </label>
          );
        })}
      </div>
      {showFeedback && question.explanation && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

function MultipleSelectQuestion({ question, answer, onAnswerChange, showFeedback }: any) {
  const options = question.answer_config?.options || [];
  const selected = answer?.selected || [];

  const handleToggle = (optionId: string) => {
    const newSelected = selected.includes(optionId)
      ? selected.filter((id: string) => id !== optionId)
      : [...selected, optionId];
    onAnswerChange({ selected: newSelected });
  };

  return (
    <div>
      <p className="text-lg font-medium text-gray-900 mb-4">{question.question_text}</p>
      <div className="space-y-2">
        {options.map((option: any) => {
          const isSelected = selected.includes(option.id);
          return (
            <label
              key={option.id}
              className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(option.id)}
                className="w-5 h-5 text-primary-500"
                disabled={showFeedback}
              />
              <span className="flex-1 text-gray-900">{option.text}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function TrueFalseQuestion({ question, answer, onAnswerChange, showFeedback, isCorrect }: any) {
  const selected = answer?.selected;

  return (
    <div>
      <p className="text-lg font-medium text-gray-900 mb-4">{question.question_text}</p>
      <div className="grid grid-cols-2 gap-4">
        {[true, false].map((value) => {
          const isSelected = selected === value;
          const isCorrectOption = showFeedback && question.correct_answer?.selected === value;
          return (
            <button
              key={value.toString()}
              onClick={() => onAnswerChange({ selected: value })}
              disabled={showFeedback}
              className={`p-6 border-2 rounded-lg text-center font-medium transition-colors ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              } ${
                showFeedback && isCorrectOption
                  ? 'border-green-500 bg-green-50'
                  : ''
              }`}
            >
              {value ? 'True' : 'False'}
            </button>
          );
        })}
      </div>
      {showFeedback && question.explanation && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

function FillBlankQuestion({ question, answer, onAnswerChange, showFeedback }: any) {
  const blanks = question.answer_config?.blanks || [];
  const answers = answer || {};

  return (
    <div>
      <p className="text-lg font-medium text-gray-900 mb-4">{question.question_text}</p>
      <div className="space-y-4">
        {blanks.map((blank: any, index: number) => (
          <div key={blank.id || index}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blank {index + 1}
            </label>
            <input
              type="text"
              value={answers[blank.id] || ''}
              onChange={(e) => onAnswerChange({ ...answers, [blank.id]: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={showFeedback}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ShortAnswerQuestion({ question, answer, onAnswerChange, showFeedback }: any) {
  return (
    <div>
      <p className="text-lg font-medium text-gray-900 mb-4">{question.question_text}</p>
      <textarea
        value={answer?.text || ''}
        onChange={(e) => onAnswerChange({ text: e.target.value })}
        rows={6}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        placeholder="Type your answer here..."
        disabled={showFeedback}
      />
      {question.answer_config?.min_words && (
        <p className="text-sm text-gray-500 mt-2">
          Minimum {question.answer_config.min_words} words required
        </p>
      )}
    </div>
  );
}


