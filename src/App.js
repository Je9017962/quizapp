import React, { useState } from 'react';
import './App.css';

const questions = [
  {
    questionText: 'What is the name of our university?',
    answerOptions: [
      { answerText: 'University of Miami', isCorrect: false },
      { answerText: 'University of Florida', isCorrect: false },
      { answerText: 'University of Central Florida', isCorrect: true },
      { answerText: 'Florida State University', isCorrect: false },
    ],
  },
  {
    questionText: 'What is the name of our mascot?',
    answerOptions: [
      { answerText: 'Knightro', isCorrect: true },
      { answerText: 'Pegasus', isCorrect: true },
      { answerText: 'Knight', isCorrect: false },
      { answerText: 'Gator', isCorrect: false },
    ],
    multipleAnswersAllowed: true,
    requiredSelections: 2,
  },
  {
    questionText: 'The University of Central Florida is located in Miami?',
    answerOptions: [
      { answerText: 'True', isCorrect: false },
      { answerText: 'False', isCorrect: true },
    ],
  },
  {
    questionText: 'The name of this class is DIG4639C',
    answerOptions: [
      { answerText: 'True', isCorrect: true },
      { answerText: 'False', isCorrect: false },
    ],
  },
  {
    questionText: 'Which campus is the Digital Media program located?',
    answerOptions: [
      { answerText: 'Lake Nona', isCorrect: false },
      { answerText: 'Downtown Orlando', isCorrect: true },
      { answerText: 'West Orlando', isCorrect: false },
      { answerText: 'East Orlando', isCorrect: false },
    ],
  },
];

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  const handleAnswerClick = (index) => {
    const isMulti = questions[currentQuestion].multipleAnswersAllowed;
    const isSelected = selectedAnswers.includes(index);

    if (isMulti) {
      if (isSelected) {
        setSelectedAnswers(selectedAnswers.filter(i => i !== index));
      } else {
        setSelectedAnswers([...selectedAnswers, index]);
      }
    } else {
      setSelectedAnswers([index]);
    }
  };

  const checkAnswer = () => {
    const correctIndices = questions[currentQuestion].answerOptions
      .map((opt, idx) => (opt.isCorrect ? idx : null))
      .filter((idx) => idx !== null);

    const isMulti = questions[currentQuestion].multipleAnswersAllowed;
    const isCorrect = isMulti
      ? selectedAnswers.length === correctIndices.length &&
        selectedAnswers.every(i => correctIndices.includes(i)) &&
        correctIndices.every(i => selectedAnswers.includes(i))
      : correctIndices.includes(selectedAnswers[0]);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setUserAnswers(prev => [
      ...prev,
      {
        question: questions[currentQuestion].questionText,
        options: questions[currentQuestion].answerOptions,
        selected: selectedAnswers,
        correct: correctIndices,
      },
    ]);
  };

  const handleNextClick = () => {
    checkAnswer();
    setSelectedAnswers([]);
    setCurrentQuestion(currentQuestion + 1);
  };

  const handleSubmitClick = () => {
    checkAnswer();
    setShowSummary(true);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setShowSummary(false);
    setSelectedAnswers([]);
    setScore(0);
    setUserAnswers([]);
  };

  // FIX 5: Determine the minimum required selections for the current question
  const currentQ = questions[currentQuestion];
  const requiredCount = currentQ.multipleAnswersAllowed
    ? (currentQ.requiredSelections || 1)
    : 1;
  const canProceed = selectedAnswers.length >= requiredCount;

  return (
    <div className="app">
      <div className="quiz-container">
        {showSummary ? (
          <div className="summary-section">
            <h2>Summary</h2>
            {/* FIX 2: Changed testid to data-testid */}
            <p data-testid="total">Total Score: {score} / {questions.length}</p>
            {userAnswers.map((item, index) => (
              <div key={index} className="summary-question">
                <h3>Q{index + 1}: {item.question}</h3>
                <ul>
                  {item.options.map((opt, i) => {
                    const isSelected = item.selected.includes(i);
                    const isCorrect = item.correct.includes(i);

                    return (
                      <li
                        key={i}
                        style={{
                          fontWeight: isCorrect && isSelected ? 'bold' : 'normal',
                          textDecoration: !isCorrect && isSelected ? 'line-through' : 'none',
                          color: isCorrect ? '#4CAF50' : isSelected ? '#f44336' : '#ccc',
                        }}
                      >
                        {opt.answerText}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <button className="restart-btn" onClick={handleRestart}>Restart Quiz</button>
          </div>
        ) : (
          <>
            <div className="question-section">
              <div className="question-count">
                <span>Question {currentQuestion + 1}</span>/{questions.length}
              </div>
              <div className="question-text">{currentQ.questionText}</div>
              {/* FIX 4: Show hint for multiple-answer questions */}
              {currentQ.multipleAnswersAllowed && (
                <div className="multi-answer-hint">
                  Select {currentQ.requiredSelections} answers
                </div>
              )}
            </div>
            <div className="answer-section">
              {currentQ.answerOptions.map((option, index) => (
                <button
                  key={index}
                  className={`answer-button ${selectedAnswers.includes(index) ? 'selected' : ''}`}
                  onClick={() => handleAnswerClick(index)}
                >
                  {option.answerText}
                </button>
              ))}
            </div>
            <div className="controls">
              {currentQuestion < questions.length - 1 ? (
                <button
                  className="next-btn"
                  onClick={handleNextClick}
                  // FIX 5: Enforce requiredSelections before allowing Next
                  disabled={!canProceed}
                >
                  Next Question
                </button>
              ) : (
                <button
                  className="submit-btn"
                  onClick={handleSubmitClick}
                  // FIX 5: Enforce requiredSelections before allowing Submit
                  disabled={!canProceed}
                >
                  Submit
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
