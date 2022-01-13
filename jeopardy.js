// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//       clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]
const HEIGHT = 5;
const WIDTH = 6;
let categories = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
  let catIds = [];
  const response = await axios.get("http://jservice.io/api/random?count=6");
  response.data.forEach((category) => catIds.push(category.category.id));
  return catIds;
}

// console.log(categories);

// getCategoryIds()
/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */
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


// getCategory(categories);
// console.log(categories);

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
  // Create table tags and variables
  const table = document.createElement("table");
  const tHead = document.createElement("thead");
  const tBody = document.createElement("tbody");
  let tRowHead = document.createElement("tr");
  $(table).attr("id", "jeopardy").append(tHead).append(tBody);
  $("body").append(table);

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
        let showClue = categories[k].clues[j].showing;
        tData.innerText = `${showClue}`;
        

      tRowData.append(tData);
      // Set table data IDs
      tData.setAttribute("id", `${k}-${j}`);
    }
  }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
  fillTable(categories)
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
   const tBody =document.querySelector('tbody');
   tBody.addEventListener('click', handleClick);
    // const restart = document.getElementById('restart');
    // restart.addEventListener('click', handleClick);
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
  // fillTable(categories).hide();
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
  const catIds = await getCategoryIds();
  categories = await getCategories(catIds);
  $(categories).hide();
  fillTable();
  hideLoadingView();
  showLoadingView();
  console.log(categories);
  
  
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO

setupAndStart();
