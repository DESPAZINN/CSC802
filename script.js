const questions = [
  {
    text: "What does HTML stand for?",
    options: { a: "Hyper Text Markup Language", b: "High Text Machine Language", c: "Home Tool Markup Language", d: "Hyperlink Text Management Links" },
    correct: "a"
  },
  {
    text: "Which language is used exclusively for adding visual styles to a webpage?",
    options: { a: "HTML", b: "CSS", c: "Python", d: "SQL" },
    correct: "b"
  },
  {
    text: "Which JavaScript keyword is used to declare a variable that cannot be reassigned?",
    options: { a: "let", b: "var", c: "const", d: "define" },
    correct: "c"
  },
  {
    text: "What is the correct HTML element for inserting a line break?",
    options: { a: "<break>", b: "<lb>", c: "<br>", d: "<hr>" },
    correct: "c"
  },
  {
    text: "Which HTML attribute is used to define inline styling configurations?",
    options: { a: "class", b: "font", c: "styles", d: "style" },
    correct: "d"
  }
];

let timeLeft = 120;
let timer;
let currentIdx = 0;
let userAnswers = {};

function startExam() {
  const name = document.getElementById("studentName").value.trim();
  if (name === "") {
    alert("Please enter your candidate name before signing in.");
    return;
  }
  document.getElementById("display-name").innerText = name;
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("exam-screen").style.display = "flex";
  buildMatrix();
  showQuestion(0);
  timer = setInterval(updateTimer, 1000);
}

function showQuestion(index) {
  currentIdx = index;
  const q = questions[index];
  const container = document.getElementById("question-container");
  let optionsHTML = "";
  for (let key in q.options) {
    const isChecked = userAnswers[index] === key ? "checked" : "";
    optionsHTML += `
      <label class="option-label">
        <input type="radio" name="cbt-option" value="${key}" ${isChecked} onchange="recordAnswer('${key}')">
        <strong>${key.toUpperCase()}.</strong> ${q.options[key]}
      </label>
    `;
  }
  container.innerHTML = `
    <p>Question ${index + 1} of ${questions.length}</p>
    <p>${q.text}</p>
    <div class="options-group">${optionsHTML}</div>
  `;
  document.getElementById("prev-btn").disabled = (index === 0);
  document.getElementById("next-btn").innerText = (index === questions.length - 1) ? "Finish" : "Next";
  updateMatrixHighlight();
}

function changeQuestion(direction) {
  let targetIndex = currentIdx + direction;
  if (targetIndex >= 0 && targetIndex < questions.length) {
    showQuestion(targetIndex);
  } else if (targetIndex === questions.length) {
    if (confirm("Are you sure you want to finish and submit your exam?")) {
      submitExam();
    }
  }
}

function recordAnswer(selectedKey) {
  userAnswers[currentIdx] = selectedKey;
  const cell = document.getElementById(`cell-${currentIdx}`);
  if (cell) cell.classList.add("answered");
}

function buildMatrix() {
  const grid = document.getElementById("matrix-grid");
  grid.innerHTML = "";
  questions.forEach((_, idx) => {
    const cell = document.createElement("div");
    cell.className = "matrix-cell";
    cell.id = `cell-${idx}`;
    cell.innerText = idx + 1;
    cell.onclick = () => showQuestion(idx);
    grid.appendChild(cell);
  });
}

function updateMatrixHighlight() {
  document.querySelectorAll(".matrix-cell").forEach((cell, idx) => {
    if (idx === currentIdx) {
      cell.classList.add("active");
    } else {
      cell.classList.remove("active");
    }
  });
}

function updateTimer() {
  timeLeft--;
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  document.getElementById("timer").innerText = `Time Left: ${minutes}:${seconds}`;
  if (timeLeft <= 0) {
    alert("Time is up! Your examination is being submitted automatically.");
    submitExam();
  }
}

function submitExam() {
  clearInterval(timer);
  let score = 0;
  questions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correct) {
      score++;
    }
  });
  document.getElementById("exam-screen").style.display = "none";
  const resultDiv = document.getElementById("result");
  resultDiv.style.display = "block";
  resultDiv.innerHTML = `
    <h2>Examination Completed</h2>
    <p>Thank you for participating.</p>
    <div class="score-badge">${score} / ${questions.length}</div>
    <p>Percentage Score: <strong>${(score / questions.length) * 100}%</strong></p>
  `;
}