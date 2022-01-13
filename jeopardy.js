//DECLARE GLOBALS
const HEIGHT = 5;
const WIDTH = 6;
let categories = [];
const table = document.createElement("table");
const tHead = document.createElement("thead");
const tBody = document.createElement("tbody");

//FUNCTIONS
function initTable() {
  $(table).attr("id", "jeopardy").append(tHead).append(tBody);
  $("body").append(table);
}

async function getCategoryIds() {
  let catIds = [];
  const response = await axios.get("http://jservice.io/api/random?count=6");
  response.data.forEach((category) => catIds.push(category.category.id));
  return catIds;
}

function shuffleAndPick(nbPick, array) {
  // Shuffle array
  const shuffled = array.sort(() => 0.5 - Math.random());

  // Get sub-array of first n elements after shuffled
  return shuffled.slice(0, nbPick);
}

async function getCategories(categories) {
  let allCategories = [];
  for (let id of categories) {
    // console.log(catId.id);
    const res = await axios.get(`http://jservice.io/api/category?id=${id}`);
    let data = res.data;
    let clues = shuffleAndPick(HEIGHT, data.clues);
    data.clues = clues;
    allCategories.push(data);
  }
  return allCategories.map((c) => {
    return {
      title: c.title,
      clues: c.clues.map((clue) => {
        return {
          question: clue.question,
          answer: clue.answer,
          showing: null,
        };
      }),
    };
  });
}

async function createTable() {
  // Create table tags and variables]
  tBody.innerHTML = "";
  tHead.innerHTML = "";
  let tRowHead = document.createElement("tr");
  // For table head
  for (let i = 0; i < categories.length; i++) {
    $(tHead).append(tRowHead);
    let tHeading = document.createElement("th");
    let title = categories[i].title;
    tHeading.innerText = `${title}`;
    tRowHead.append(tHeading);
  }
  // for table data
  //Table row
  for (let j = 0; j < HEIGHT; j++) {
    let tRowData = document.createElement("tr");
    tBody.append(tRowData);

    // Table data
    for (let k = 0; k < WIDTH; k++) {
      let tData = document.createElement("td");
      tData.innerText = `?`;

      tRowData.append(tData);
      // Set table data IDs
      tData.setAttribute("id", `${k}-${j}`);
    }
  }
}

function handleClick(e) {
  console.log(e.target);
  const [row, col] = e.target.id.split("-");
  const clue = categories[row].clues[col];
  console.log(clue);
  console.log(clue.showing);
  if (clue.showing == null) {
    e.target.innerText = clue.question;
    clue.showing = "question";
  } else if (clue.showing == "question") {
    e.target.innerText = clue.answer;
    clue.showing = "answer";
  } else {
    return;
  }
}

function showLoadingView() {
  table.show();
}

function hideLoadingView() {
  table.hide();
}

async function setupAndStart() {
  const catIds = await getCategoryIds();
  categories = await getCategories(catIds);
  createTable();
  hideLoadingView();
  showLoadingView();
}

//RUN INITIAL FUNCTIONS
initTable();
setupAndStart();

//ADD EVENT LISTENERS
$("#restart").on("click", async () => {
  await setupAndStart();
});

$("#jeopardy").on("click", "td", handleClick);
