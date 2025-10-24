// Quiz Application JavaScript

class QuizApp {
    constructor() {
        // Quiz questions database
        this.questions = [
            {
                question: "Out of all the 2-digit integers between 1 and 100, a 2-digit number has to be selected at random. What is the probability that the selected number is not divisible by 7?",
                options: [
                    "13/90",
                    "12/90",
                    "78/90",
                    "77/90"
                ],
                correctAnswer: 3
            },
            {
                question: "Were you a bird, you ______________ in the sky.",
                options: [
                    "would fly",
                    "shall fly",
                    "should fly",
                    "shall have flown"
                ],
                correctAnswer: 0
            },
            {
                question: "A deck of 5 cards (each carrying a distinct number from 1 to 5) is shuffled thoroughly. Two cards are then removed one at time from the deck. What is the probability that the two cards are selected with the number on the first card being one higher than the number on the second card?",
                options: [
                    "1/5",
                    "4/25",
                    "1/4",
                    "2/5"
                ],
                correctAnswer: 0
            },
            {
                question: "Choose the most appropriate word from the options given below to complete the following sentence. If you are trying to make a strong impression on your audience, you cannot do so by being understated, tentative or_____________.",
                options: [
                    "Hyperbolic",
                    "Restrained",
                    "Argumentative",
                    "Indifferent"
                ],
                correctAnswer: 1
            },
            {
                question: "If the difference between expectation of the square of a random variable (E[X²]) and the square of the expectation of the random variable (E[X])² is denoted by R, then?",
                options: [
                    "R = 0",
                    "R < 0",
                    "R >= 0",
                    "R > 0"
                ],
                correctAnswer: 2
            }
        ];

        // Quiz state
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.selectedAnswer = null;
        this.isAnswered = false;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;

        // DOM elements
        this.startScreen = document.getElementById('start-screen');
        this.quizScreen = document.getElementById('quiz-screen');
        this.resultsScreen = document.getElementById('results-screen');
        
        this.startBtn = document.getElementById('start-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.restartBtn = document.getElementById('restart-btn');
        
        this.questionText = document.getElementById('question-text');
        this.optionsContainer = document.getElementById('options-container');
        this.currentQuestionSpan = document.getElementById('current-question');
        this.scoreSpan = document.getElementById('score');
        this.progressFill = document.getElementById('progress-fill');
        
        this.finalScore = document.getElementById('final-score');
        this.totalQuestions = document.getElementById('total-questions');
        this.performanceMessage = document.getElementById('performance-message');
        this.pointsEarned = document.getElementById('points-earned');
        this.correctCount = document.getElementById('correct-count');
        this.wrongCount = document.getElementById('wrong-count');
        this.accuracy = document.getElementById('accuracy');

        // Initialize the app
        this.init();
        
        // Hide score container initially
        this.hideScoreContainer();
    }

    init() {
        // Event listeners
        this.startBtn.addEventListener('click', () => this.startQuiz());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.restartBtn.addEventListener('click', () => this.restartQuiz());
        
        // Initialize UI
        this.totalQuestions.textContent = this.questions.length;
        this.updateScore();
    }

    startQuiz() {
        this.showScreen('quiz');
        this.showScoreContainer();
        this.loadQuestion();
        this.updateProgress();
    }

    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show selected screen
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }

    loadQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        
        // Update question text
        this.questionText.textContent = question.question;
        
        // Update question counter
        this.currentQuestionSpan.textContent = `Question ${this.currentQuestionIndex + 1}`;
        
        // Clear previous options
        this.optionsContainer.innerHTML = '';
        
        // Create option buttons
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.addEventListener('click', () => this.selectAnswer(index, button));
            this.optionsContainer.appendChild(button);
        });

        // Reset state
        this.selectedAnswer = null;
        this.isAnswered = false;
        this.nextBtn.disabled = true;
        this.updateProgress();
        this.updateNextButtonText();
    }

    updateNextButtonText() {
        // Check if this is the last question
        const isLastQuestion = this.currentQuestionIndex === this.questions.length - 1;
        this.nextBtn.textContent = isLastQuestion ? 'View Results' : 'Next Question';
    }

    selectAnswer(answerIndex, buttonElement) {
        if (this.isAnswered) return;

        this.selectedAnswer = answerIndex;
        this.isAnswered = true;
        
        // Disable all options
        const allOptions = document.querySelectorAll('.option-btn');
        allOptions.forEach(btn => btn.classList.add('disabled'));

        // Check if answer is correct
        const correctIndex = this.questions[this.currentQuestionIndex].correctAnswer;
        const isCorrect = answerIndex === correctIndex;

        if (isCorrect) {
            buttonElement.classList.add('correct');
            this.score += 10;
            this.correctAnswers++;
            this.updateScore();
            this.showFeedback(true);
        } else {
            buttonElement.classList.add('incorrect');
            // Also highlight the correct answer
            allOptions[correctIndex].classList.add('correct');
            this.wrongAnswers++;
            this.showFeedback(false);
        }

        // Enable next button after a short delay
        setTimeout(() => {
            this.nextBtn.disabled = false;
            // Update button text in case this is the last question
            this.updateNextButtonText();
        }, 1500);
    }

    showFeedback(isCorrect) {
        // You can add sound effects or additional feedback here
        if (isCorrect) {
            console.log("Correct! +10 points");
        } else {
            console.log("Incorrect! Better luck next time.");
        }
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.questions.length) {
            this.loadQuestion();
        } else {
            this.showResults();
        }
    }

    updateScore() {
        this.scoreSpan.textContent = `Score: ${this.score}`;
    }

    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.progressFill.style.width = `${progress}%`;
    }

    showResults() {
        this.showScreen('results');
        
        // Calculate results
        const totalQuestions = this.questions.length;
        const accuracyPercentage = Math.round((this.correctAnswers / totalQuestions) * 100);
        
        // Update results display
        this.finalScore.textContent = this.correctAnswers;
        this.pointsEarned.textContent = this.score;
        this.correctCount.textContent = this.correctAnswers;
        this.wrongCount.textContent = this.wrongAnswers;
        this.accuracy.textContent = `${accuracyPercentage}%`;
        
        // Set achievement badge and message
        this.setAchievementBadge(accuracyPercentage);
        
        // Performance message based on score
        let message = this.getPerformanceMessage(accuracyPercentage);        
        this.performanceMessage.textContent = message;
        
        // Animate results with delays
        setTimeout(() => this.animateScore(), 500);
        setTimeout(() => this.animateCircularProgress(accuracyPercentage), 800);
        setTimeout(() => this.animatePerformanceBar(accuracyPercentage), 1200);
        
        // Add confetti for good scores
        if (accuracyPercentage >= 70) {
            setTimeout(() => this.showConfetti(), 1000);
        }
    }

    animateScore() {
        let currentScore = 0;
        const targetScore = this.correctAnswers;
        const increment = 1; // Count up by 1 for correct answers
        
        const scoreAnimation = setInterval(() => {
            currentScore += increment;
            if (currentScore >= targetScore) {
                currentScore = targetScore;
                clearInterval(scoreAnimation);
            }
            this.finalScore.textContent = currentScore;
        }, 200); // Slower animation for counting questions
    }

    restartQuiz() {
        // Reset all state
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.selectedAnswer = null;
        this.isAnswered = false;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        
        // Update UI
        this.updateScore();
        this.progressFill.style.width = '0%';
        
        // Reset button text
        this.nextBtn.textContent = 'Next Question';
        
        // Hide score container and show start screen
        this.hideScoreContainer();
        this.showScreen('start');
    }
    
    showScoreContainer() {
        const scoreContainer = document.querySelector('.score-container');
        if (scoreContainer) {
            scoreContainer.style.display = 'flex';
        }
    }
    
    hideScoreContainer() {
        const scoreContainer = document.querySelector('.score-container');
        if (scoreContainer) {
            scoreContainer.style.display = 'none';
        }
    }
    
    setAchievementBadge(accuracy) {
        const achievementIcon = document.getElementById('achievement-icon');
        const achievementTitle = document.getElementById('achievement-title');
        
        if (accuracy >= 100) {
            achievementIcon.textContent = '🏆';
            achievementTitle.textContent = 'Perfect Score!';
        } else if (accuracy >= 90) {
            achievementIcon.textContent = '🥇';
            achievementTitle.textContent = 'Quiz Master!';
        } else if (accuracy >= 80) {
            achievementIcon.textContent = '🥈';
            achievementTitle.textContent = 'Excellent!';
        } else if (accuracy >= 70) {
            achievementIcon.textContent = '🥉';
            achievementTitle.textContent = 'Great Job!';
        } else if (accuracy >= 60) {
            achievementIcon.textContent = '🎖️';
            achievementTitle.textContent = 'Good Effort!';
        } else if (accuracy >= 40) {
            achievementIcon.textContent = '📚';
            achievementTitle.textContent = 'Keep Learning!';
        } else {
            achievementIcon.textContent = '💪';
            achievementTitle.textContent = 'Try Again!';
        }
    }
    
    getPerformanceMessage(accuracy) {
        const messages = {
            100: [
                "🎯 Absolutely PERFECT! You're a true genius! 🧠✨",
                "🚀 Flawless victory! Nothing can stop you now! 🏆",
                "⭐ Perfect score achieved! You're unstoppable! 🌟"
            ],
            90: [
                "🔥 Outstanding performance! You're on fire! 🎊",
                "⚡ Incredible! Your knowledge is impressive! 🧠",
                "🎯 Exceptional work! You're a quiz champion! 🏆"
            ],
            80: [
                "🌟 Excellent job! Your hard work is paying off! 📈",
                "💪 Impressive! You really know your stuff! 🎓",
                "🎊 Great performance! Keep up the momentum! 🚀"
            ],
            70: [
                "👏 Good work! You're on the right track! 🛤️",
                "📚 Nice job! Your knowledge is growing! 🌱",
                "🎯 Well done! Practice makes perfect! ⭐"
            ],
            60: [
                "💪 Decent effort! There's room to grow! 🌱",
                "📖 Not bad! Keep studying and improving! 📈",
                "🎯 Good attempt! Practice more to excel! 🏃‍♂️"
            ],
            40: [
                "🔍 Keep exploring and learning! Knowledge awaits! 🗝️",  
                "💡 Every expert was once a beginner! Keep going! 🚶‍♂️",
                "📚 Don't give up! Each attempt makes you stronger! 💪"
            ],
            0: [
                "🌟 Every journey starts with a single step! 👣",
                "💪 Challenge accepted! Time to level up! 🎮",
                "🚀 Ready for round two? You've got this! 🎯"
            ]
        };
        
        let messageArray;
        if (accuracy >= 100) messageArray = messages[100];
        else if (accuracy >= 90) messageArray = messages[90];
        else if (accuracy >= 80) messageArray = messages[80];
        else if (accuracy >= 70) messageArray = messages[70];
        else if (accuracy >= 60) messageArray = messages[60];
        else if (accuracy >= 40) messageArray = messages[40];
        else messageArray = messages[0];
        
        return messageArray[Math.floor(Math.random() * messageArray.length)];
    }
    
    animateCircularProgress(accuracy) {
        const progressCircle = document.getElementById('score-ring-progress');
        // Get current radius based on screen size to match CSS
        const radius = window.innerWidth <= 480 ? 32 : (window.innerWidth <= 768 ? 50 : 80);
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (accuracy / 100) * circumference;
        
        progressCircle.style.strokeDasharray = circumference;
        progressCircle.style.strokeDashoffset = offset;
    }
    
    animatePerformanceBar(accuracy) {
        const performanceBar = document.getElementById('performance-bar');
        if (performanceBar) {
            performanceBar.style.width = `${accuracy}%`;
        }
    }
    
    showConfetti() {
        const confettiContainer = document.getElementById('confetti-container');
        confettiContainer.innerHTML = ''; // Clear existing confetti
        
        const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
        const confettiCount = window.innerWidth <= 480 ? 25 : 50; // Less confetti on mobile
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confettiContainer.appendChild(confetti);
        }
        
        // Remove confetti after animation
        setTimeout(() => {
            confettiContainer.innerHTML = '';
        }, 5000);
    }

    // Utility method to shuffle questions (bonus feature)
    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }

    // Method to add new questions dynamically
    addQuestion(questionObj) {
        this.questions.push(questionObj);
    }

    // Method to get quiz statistics
    getStats() {
        return {
            totalQuestions: this.questions.length,
            currentQuestion: this.currentQuestionIndex + 1,
            score: this.score,
            correctAnswers: this.correctAnswers,
            wrongAnswers: this.wrongAnswers,
            accuracy: Math.round((this.correctAnswers / (this.correctAnswers + this.wrongAnswers)) * 100) || 0
        };
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const quiz = new QuizApp();
    
    // Optional: Add keyboard support
    document.addEventListener('keydown', (e) => {
        // Press 1-4 to select answers
        if (e.key >= '1' && e.key <= '4') {
            const optionIndex = parseInt(e.key) - 1;
            const optionButtons = document.querySelectorAll('.option-btn');
            if (optionButtons[optionIndex] && !quiz.isAnswered) {
                optionButtons[optionIndex].click();
            }
        }
        
        // Press Enter or Space to go to next question
        if ((e.key === 'Enter' || e.key === ' ') && !quiz.nextBtn.disabled) {
            e.preventDefault();
            quiz.nextBtn.click();
        }
        
        // Press 'R' to restart
        if (e.key.toLowerCase() === 'r' && quiz.restartBtn.style.display !== 'none') {
            quiz.restartQuiz();
        }
    });
    
    // Make quiz globally accessible for debugging
    window.quiz = quiz;
});
