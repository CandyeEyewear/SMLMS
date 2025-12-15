export function generateQuizPrompt(params: {
  moduleTitle: string;
  topics: string[];
  questionCount?: number;
}) {
  const { moduleTitle, topics, questionCount = 5 } = params;

  return `Create a quiz for:

Module: ${moduleTitle}
Topics covered: ${topics.join(', ')}

Generate ${questionCount} questions with mix:
- 30% multiple_choice (select one)
- 20% true_false
- 20% fill_blank (fill in the blank)
- 20% multiple_select (select all that apply)
- 10% short_answer (brief text response)

Return JSON:
{
  "questions": [
    {
      "question_type": "multiple_choice",
      "question_text": "Question text here",
      "answer_config": {
        "options": [
          {"id": "a", "text": "Option A"},
          {"id": "b", "text": "Option B"},
          {"id": "c", "text": "Option C"},
          {"id": "d", "text": "Option D"}
        ],
        "shuffle": true
      },
      "correct_answer": {"selected": "b"},
      "explanation": "Why this answer is correct",
      "points": 1
    },
    {
      "question_type": "true_false",
      "question_text": "True or false statement",
      "answer_config": {},
      "correct_answer": {"selected": true},
      "explanation": "Explanation",
      "points": 1
    },
    {
      "question_type": "fill_blank",
      "question_text": "The capital of France is ___.",
      "answer_config": {
        "blanks": [
          {
            "id": "blank1",
            "accepted_answers": ["Paris", "paris"],
            "case_sensitive": false
          }
        ]
      },
      "correct_answer": {"blank1": "Paris"},
      "explanation": "Explanation",
      "points": 1
    }
  ]
}

Return ONLY valid JSON, no markdown formatting, no code blocks.`;
}

