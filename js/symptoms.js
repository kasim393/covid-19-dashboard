// variable
let currentQuestion = 0;
let score = [];
const totalQuestions = questions.length;

//element
const container = document.querySelector(".test-div");
const result_container = document.querySelector(".result-container");
const questionEl = document.querySelector(".question");
const option1 = document.querySelector(".option1");
const option2 = document.querySelector(".option2");
const option3 = document.querySelector(".option3");
const option4 = document.querySelector(".option4");
const nextButton = document.querySelector(".next");
const previousButton = document.querySelector(".previous");
const restartButton = document.querySelector(".restart");
const result = document.querySelector(".result");
const option_3 = document.querySelector(".option_3");
const option_4 = document.querySelector(".option_4");

//Function to generate question
function generateQuestions(index) {
  //Select each question by passing it a particular index
  const question = questions[index];
  const option1Total = questions[index].answer1Total;
  const option2Total = questions[index].answer2Total;
  const option3Total = questions[index].answer3Total;
  const option4Total = questions[index].answer4Total;

  questionEl.innerHTML = `${index + 1}. ${question.question}`;
  option1.setAttribute("data-total", `${option1Total}`);
  option2.setAttribute("data-total", `${option2Total}`);
  option3.setAttribute("data-total", `${option3Total}`);
  option4.setAttribute("data-total", `${option4Total}`);
  option1.innerHTML = `${question.answer1}`;
  option2.innerHTML = `${question.answer2}`;
  if (question.question == "Choose Gender") {
    option_3.classList.add("hide");
    option_4.classList.add("hide");
  } else {
    option_3.classList.remove("hide");
    option_4.classList.remove("hide");
  }
  option3.innerHTML = `${question.answer3}`;
  option4.innerHTML = `${question.answer4}`;
}

function loadNextQuestion() {
  var selectedOption = document.querySelector('input[type="radio"]:checked');

  //input check
  if (!selectedOption) {
    alert("Please select your answer!");
    return;
  }
  //Get value of selected radio
  const answerScore = Number(
    selectedOption.nextElementSibling.getAttribute("data-total")
  );
  //Add the answer score to the score array
  score.push(answerScore);
  const totalScore = score.reduce((total, currentNum) => total + currentNum);
  currentQuestion++;
  console.log("Total: " + totalScore);
  //clear checked
  selectedOption.checked = false;

  //If test is on the final question
  if (currentQuestion == totalQuestions - 1) {
    nextButton.textContent = "Finish";
  }
  //If the test is finished then show the results

  if (currentQuestion == totalQuestions) {
    container.style.display = "none";
    result_container.style.display = "block";

    if (totalScore > 15) {
      result.innerHTML = `<div class="summary">
            <h1>Summary</h1>
            <p style="color:red">Please get a COVID-19 test and self-isolate</p>
        </div>
        <button class="restart">Test Again</button>
         `;

      return;
    }

    if (totalScore <= 15 && totalScore >= 10) {
      result.innerHTML = `<div class="summary">
            <h1>Summary</h1>
            <p style="color:orange">get a COVID-19 test if symptoms more than 10 days</p>
        </div>
        <button class="restart">Test Again</button>
         `;

      return;
    }

    if (totalScore < 10 && totalScore >= 6) {
      result.innerHTML = `<div class="summary">
            <h1>Summary</h1>
            <p style="color:#ffeb3b">Contact family doctor and stay home until you feel better</p>
        </div>
        <button class="restart">Test Again</button>
         `;

      return;
    }

    if (totalScore <= 5) {
      result.innerHTML = `<div class="summary">
            <h1>Summary</h1>
            <p style="color:green">You do not appear to have symptoms that require COVID-19 testing</p>
        </div>
        <button class="restart">Test Again</button>
         `;

      return;
    }
  }
  generateQuestions(currentQuestion);
}

//Function to load previous question
function loadPreviousQuestion() {
  //Decrement quentions index
  currentQuestion--;
  //remove last array value;
  score.pop();
  //Generate the question
  generateQuestions(currentQuestion);
}

//Fuction to reset and restart the test;
function restartTest(e) {
  if (e.target.matches("button")) {
    //reset array index and score
    currentQuestion = 0;
    score = [];
    //Reload test to the start
    location.reload();
  }
}

generateQuestions(currentQuestion);
nextButton.addEventListener("click", loadNextQuestion);
previousButton.addEventListener("click", loadPreviousQuestion);
result.addEventListener("click", restartTest);
