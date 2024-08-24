import React, { useState, useEffect } from 'react';
import './App.css';

const quizData = {
  indianCinema: [
    {
      question: "In 'Sahoo', what is the name of the fictional city where much of the action takes place?",
      choices: ["Waaji", "Mahishmati", "Narkasura", "Bhallaladeva"],
      correctAnswer: 0,
      type: "single"
    },
    {
      question: "Who plays the lead role in the movie 'Sahoo'?",
      choices: ["Prabhas", "Rana Daggubati", "Vijay Deverakonda", "Allu Arjun"],
      correctAnswer: 0,
      type: "single"
    },
    {
      question: "Which of the following statements about 'Salaar' are true?",
      choices: [
        "It stars Prabhas in the lead role",
        "It is directed by Prashanth Neel",
        "It is produced by Hombale Films",
        "It is set to release in 2023"
      ],
      correctAnswer: [0, 1, 2, 3],
      type: "multiple"
    },
    {
      question: "What does 'Salaar' mean?",
      choices: ["Warrior", "King", "Commander", "Rebel"],
      correctAnswer: 2,
      type: "single"
    },
    {
      question: "'Salaar' is Prashanth Neel's first collaboration with Prabhas.",
      choices: ["True", "False"],
      correctAnswer: 0,
      type: "boolean"
    },
    {
      question: "Which of these actors is NOT part of the main cast of 'Salaar'?",
      choices: ["Prabhas", "Prithviraj Sukumaran", "Shruti Haasan", "Yash"],
      correctAnswer: 3,
      type: "single"
    },
    // Questions related to Kalki 2989D
    {
      question: "Who is the director of 'Kalki 2989D'?",
      choices: ["Nag Ashwin", "Rajamouli", "Prashanth Neel", "S. S. Rajamouli"],
      correctAnswer: 0,
      type: "single"
    },
    {
      question: "Which actor plays the lead role in 'Kalki 2989D'?",
      choices: ["Prabhas", "Ranbir Kapoor", "Mahesh Babu", "Hrithik Roshan"],
      correctAnswer: 0,
      type: "single"
    },
    {
      question: "What is the genre of 'Kalki 2989D'?",
      choices: ["Historical", "Fantasy", "Sci-fi", "Romantic"],
      correctAnswer: 2,
      type: "single"
    },
    {
      question: "Which of the following actors are part of the cast of 'Kalki 2989D'?",
      choices: ["Prabhas", "Amitabh Bachchan", "Deepika Padukone", "All of the above"],
      correctAnswer: 3,
      type: "multiple"
    },
    {
      question: "'Kalki 2989D' is set in which year?",
      choices: ["2023", "2050", "2989", "3000"],
      correctAnswer: 2,
      type: "single"
    },
    {
      question: "'Kalki 2989D' is based on Indian mythology.",
      choices: ["True", "False"],
      correctAnswer: 1,
      type: "boolean"
    }
  ],
};


function App() {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [result, setResult] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    document.body.className = darkTheme ? 'dark-theme' : '';
  }, [darkTheme]);

  const startQuiz = (event) => {
    const selectedQuiz = event.target.value;
    if (selectedQuiz) {
      setCurrentQuiz(quizData[selectedQuiz]);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowSummary(false);
    }
  };

  const selectChoice = (index) => {
    const question = currentQuiz[currentQuestionIndex];
    if (question.type === "single" || question.type === "boolean") {
      setSelectedChoices([index]);
    } else if (question.type === "multiple") {
      setSelectedChoices(prev => 
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    }
  };

  const submitAnswer = () => {
    const question = currentQuiz[currentQuestionIndex];
    
    if (selectedChoices.length === 0) {
      setResult("Please select an answer.");
      return;
    }

    let isCorrect = false;
    if (question.type === "single" || question.type === "boolean") {
      isCorrect = selectedChoices[0] === question.correctAnswer;
    } else if (question.type === "multiple") {
      isCorrect = arraysEqual(selectedChoices.sort(), question.correctAnswer.sort());
    }

    if (isCorrect) {
      setScore(prev => prev + 1);
      setResult("Correct!");
    } else {
      setResult(`Incorrect. The correct answer was: ${
        question.type === "multiple" 
          ? question.correctAnswer.map(index => question.choices[index]).join(", ")
          : question.choices[question.correctAnswer]
      }`);
    }

    setTimeout(() => {
      if (currentQuestionIndex < currentQuiz.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedChoices([]);
        setResult('');
      } else {
        setShowSummary(true);
      }
    }, 2000);
  };

  const restartQuiz = () => {
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedChoices([]);
    setResult('');
    setShowSummary(false);
  };

  const toggleTheme = () => {
    setDarkTheme(prev => !prev);
  };

  const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  };

  
  const renderQuiz = () => {
    if (!currentQuiz) return null;
    
    const question = currentQuiz[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;

    return (
      <div className="quiz-container">
        <div className="progress-bar">
          <div className="progress" style={{width: `${progress}%`}}></div>
        </div>
        <h2 className="question">{question.question}</h2>
        <div className="choices">
          {question.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => selectChoice(index)}
              className={`choice ${selectedChoices.includes(index) ? 'selected' : ''}`}
            >
              {choice}
            </button>
          ))}
        </div>
        <button className="submit-btn" onClick={submitAnswer}>Submit</button>
        <div className="result">{result}</div>
      </div>
    );
  };

  return (
    <div className={`App ${darkTheme ? 'dark-theme' : ''}`}>
      <div className="container">
        <h1 className="title">Quiz App</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkTheme ? '☀️' : '🌙'}
        </button>
        {!currentQuiz && !showSummary && (
          <div className="quiz-selection">
            <h2>Select a Quiz</h2>
            <select onChange={startQuiz}>
              <option value="">Choose a Quiz</option>
              <option value="indianCinema">PraBOSS Cult Fans Test</option>
            </select>
          </div>
        )}
        {currentQuiz && !showSummary && renderQuiz()}
        {showSummary && (
          <div className="summary">
            <h2>Quiz Summary</h2>
            <p>Your final score: <span className="score">{score}</span> out of {currentQuiz.length}</p>
            <button className="restart-btn" onClick={restartQuiz}>Restart Quiz</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;