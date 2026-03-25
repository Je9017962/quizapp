import React, { useState } from 'react';
import './App.css';

// ─── UCF Fan Quiz Questions ───────────────────────────────────────────────────
const ucfQuestions = [
  {
    questionText: 'What year was the University of Central Florida founded?',
    answerOptions: [
      { answerText: '1957', isCorrect: false },
      { answerText: '1963', isCorrect: true },
      { answerText: '1971', isCorrect: false },
      { answerText: '1948', isCorrect: false },
    ],
  },
  {
    questionText: "What are UCF's official school colors?",
    answerOptions: [
      { answerText: 'Black and Gold', isCorrect: true },
      { answerText: 'Blue and Gold', isCorrect: false },
      { answerText: 'Black and Silver', isCorrect: false },
      { answerText: 'Orange and Blue', isCorrect: false },
    ],
  },
  {
    questionText: "What is the name of UCF's on-campus football stadium?",
    answerOptions: [
      { answerText: 'Spectrum Stadium', isCorrect: false },
      { answerText: 'Knight Stadium', isCorrect: false },
      { answerText: 'FBC Mortgage Stadium', isCorrect: true },
      { answerText: 'Bounce House Arena', isCorrect: false },
    ],
  },
  {
    questionText: 'Which athletic conference does UCF currently compete in?',
    answerOptions: [
      { answerText: 'SEC', isCorrect: false },
      { answerText: 'ACC', isCorrect: false },
      { answerText: 'American Athletic Conference', isCorrect: false },
      { answerText: 'Big 12', isCorrect: true },
    ],
  },
  {
    questionText: "What is the name of UCF's beloved mascot?",
    answerOptions: [
      { answerText: 'Pegasus', isCorrect: false },
      { answerText: 'Knightro', isCorrect: true },
      { answerText: 'Sir Knight', isCorrect: false },
      { answerText: 'Gator', isCorrect: false },
    ],
  },
];

// ─── Step 1: User Info Form ───────────────────────────────────────────────────
function InfoStep({ onNext }) {
  const [form, setForm] = useState({ name: '', email: '', studentId: '', major: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = 'A valid email is required.';
    if (!form.studentId.trim()) newErrors.studentId = 'Student ID is required.';
    if (!form.major.trim()) newErrors.major = 'Major is required.';
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onNext(form);
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  return (
    <div className="step-container">
      <div className="step-badge">Step 1 of 2</div>
      <h1 className="step-title">Student Verification</h1>
      <p className="step-subtitle">Enter your information to unlock the UCF Fan Quiz</p>

      <div className="form-grid">
        <div className="form-field">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="e.g. Alex Knight"
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="error-msg">{errors.name}</span>}
        </div>

        <div className="form-field">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="e.g. alexknight@ucf.edu"
            value={form.email}
            onChange={e => handleChange('email', e.target.value)}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="error-msg">{errors.email}</span>}
        </div>

        <div className="form-field">
          <label>Student ID</label>
          <input
            type="text"
            placeholder="e.g. 5012345678"
            value={form.studentId}
            onChange={e => handleChange('studentId', e.target.value)}
            className={errors.studentId ? 'input-error' : ''}
          />
          {errors.studentId && <span className="error-msg">{errors.studentId}</span>}
        </div>

        <div className="form-field">
          <label>Major</label>
          <input
            type="text"
            placeholder="e.g. Digital Media"
            value={form.major}
            onChange={e => handleChange('major', e.target.value)}
            className={errors.major ? 'input-error' : ''}
          />
          {errors.major && <span className="error-msg">{errors.major}</span>}
        </div>
      </div>

      <button className="primary-btn" onClick={handleSubmit}>
        Continue to Quiz →
      </button>
    </div>
  );
}

// ─── Step 2: UCF Quiz ─────────────────────────────────────────────────────────
function QuizStep({ userInfo, onFinish }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  const handleAnswerClick = (index) => setSelectedAnswer(index);

  const handleNext = () => {
    const correctIndices = ucfQuestions[currentQuestion].answerOptions
      .map((opt, idx) => (opt.isCorrect ? idx : null))
      .filter(idx => idx !== null);
    const isCorrect = correctIndices.includes(selectedAnswer);
    if (isCorrect) setScore(prev => prev + 1);
    setUserAnswers(prev => [
      ...prev,
      {
        question: ucfQuestions[currentQuestion].questionText,
        options: ucfQuestions[currentQuestion].answerOptions,
        selected: selectedAnswer,
        correct: correctIndices,
      },
    ]);
    setSelectedAnswer(null);
    setCurrentQuestion(prev => prev + 1);
  };

  const handleSubmit = () => {
    // Compute the last answer inline before state updates settle
    const correctIndices = ucfQuestions[currentQuestion].answerOptions
      .map((opt, idx) => (opt.isCorrect ? idx : null))
      .filter(idx => idx !== null);
    const lastCorrect = correctIndices.includes(selectedAnswer) ? 1 : 0;
    const lastAnswer = {
      question: ucfQuestions[currentQuestion].questionText,
      options: ucfQuestions[currentQuestion].answerOptions,
      selected: selectedAnswer,
      correct: correctIndices,
    };
    const allAnswers = [...userAnswers, lastAnswer];
    const finalScore = allAnswers.reduce((acc, item) =>
      acc + (item.correct.includes(item.selected) ? 1 : 0), 0);
    setUserAnswers(allAnswers);
    setScore(finalScore);
    setShowSummary(true);
  };

  if (showSummary) {
    const totalScore = score;
    const percentage = Math.round((totalScore / ucfQuestions.length) * 100);
    const passed = totalScore >= 3;

    return (
      <div className="step-container">
        <div className={`result-badge ${passed ? 'pass' : 'fail'}`}>
          {passed ? '🏆 True Knight!' : '📚 Keep Studying!'}
        </div>
        <h1 className="step-title">Quiz Complete</h1>
        <p className="step-subtitle">
          Welcome, <strong>{userInfo.name}</strong>! Here's how you did:
        </p>

        <div className="score-display">
          <span className="score-num">{totalScore}</span>
          <span className="score-denom">/ {ucfQuestions.length}</span>
          <span className="score-pct">{percentage}%</span>
        </div>

        <div className="summary-list">
          {userAnswers.map((item, index) => (
            <div key={index} className="summary-question">
              <h3>Q{index + 1}: {item.question}</h3>
              <ul>
                {item.options.map((opt, i) => {
                  const isSelected = item.selected === i;
                  const isCorrect = item.correct.includes(i);
                  let className = 'summary-opt';
                  if (isCorrect) className += ' correct';
                  else if (isSelected && !isCorrect) className += ' wrong';
                  return (
                    <li key={i} className={className}>
                      {isCorrect ? '✓' : isSelected ? '✗' : '·'} {opt.answerText}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <button className="primary-btn" onClick={onFinish}>
          Restart from Beginning
        </button>
      </div>
    );
  }

  return (
    <div className="step-container">
      <div className="step-badge">Step 2 of 2 · UCF Fan Quiz</div>
      <div className="question-progress">
        <div className="progress-label">
          <span>Question {currentQuestion + 1} of {ucfQuestions.length}</span>
          <span>{score} correct so far</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentQuestion + 1) / ucfQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="question-text">{ucfQuestions[currentQuestion].questionText}</div>

      <div className="answer-section">
        {ucfQuestions[currentQuestion].answerOptions.map((option, index) => (
          <button
            key={index}
            className={`answer-button ${selectedAnswer === index ? 'selected' : ''}`}
            onClick={() => handleAnswerClick(index)}
          >
            <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
            {option.answerText}
          </button>
        ))}
      </div>

      <div className="controls">
        {currentQuestion < ucfQuestions.length - 1 ? (
          <button className="primary-btn" onClick={handleNext} disabled={selectedAnswer === null}>
            Next Question →
          </button>
        ) : (
          <button className="primary-btn submit" onClick={handleSubmit} disabled={selectedAnswer === null}>
            Submit Quiz ✓
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
function App() {
  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState(null);

  const handleInfoNext = (info) => {
    setUserInfo(info);
    setStep(2);
  };

  const handleFinish = () => {
    setStep(1);
    setUserInfo(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-logo">⚔️ UCF</div>
        <div className="header-steps">
          <div className={`header-step ${step >= 1 ? 'active' : ''}`}>1 · Info</div>
          <div className="header-divider" />
          <div className={`header-step ${step >= 2 ? 'active' : ''}`}>2 · Quiz</div>
        </div>
      </header>

      <main className="app-main">
        {step === 1 && <InfoStep onNext={handleInfoNext} />}
        {step === 2 && <QuizStep userInfo={userInfo} onFinish={handleFinish} />}
      </main>
    </div>
  );
}

export default App;