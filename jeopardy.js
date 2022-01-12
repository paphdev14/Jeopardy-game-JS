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

let categories = [];


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    const response = await axios.get('http://jservice.io/api/random?count=6');
    categories.push(response.data.map(category =>({
    id: category.category.id
    })));
    return categories;
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

function getCategory(catId) {
    for(let ids of categories){
        for(let catId of ids){
            // console.log(catId.id);
            async function clueFunc() {
                const res = await axios.get(`http://jservice.io/api/category?id=${catId.id}`);
                let cl = res.data;
                // console.log(cl);
                let showData = cl.clues.map(clueObj =>{
                    // console.log(clueObj);
                    return
                        [
                            {
                                title: cl.title,
                                clues: [
                                    {
                                        question: clueObj.question,
                                        answer: clueObj.answer,
                                        showing: null
                                    }
                                ]
                            }
                        ]
                });
                return showData;
            }
            clueFunc()
        }
    }
    getCategoryIds();
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
    getCategory(categories);
    console.log(categories);
    // Create table tags and variables
    const HEIGHT = 5;
    const WIDTH = 6;
    const table = document.createElement('table');
    const tHead = document.createElement('thead');
    const tBody = document.createElement('tbody');
    let tRowHead = document.createElement('tr');
    $(table).attr("id", "jeopardy")
    .append(tHead)
    .append(tBody);
    $('body').append(table);
    
    // For table head
    for(let i=0; i<WIDTH; i++){
        $(tHead).append(tRowHead);
        let tHeading = document.createElement('th'); 
        tHeading.innerText = 'category'
        tRowHead.append(tHeading);
    }
    // for table data
    for(let k=0; k<HEIGHT; k++){
        let tRowData = document.createElement('tr');
        tBody.append(tRowData);
     for(let j=0; j<WIDTH; j++){
            let tData = document.createElement('td'); 
            tData.innerText = '?';
            tRowData.append(tData);
            // Set table data IDs
            tData.setAttribute('id', `${j}-${k}`);
        }
    }

    const response = await axios.get('http://jservice.io/api/category?id=15511');
    let dataResponse = response.data;
    console.log(dataResponse);
    // return dataResponse;
    // getCategoryIds();
}

fillTable();

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
//     const body = document.querySelector('body');
//     const table = document.createElement('table');
//     table.setAttribute('id', 'jeopardy')
//     body.appendChild(table);
     
//     const response = await axios.get('https://jservice.io/api/clues');
//     console.log(response.data);
//     response.data.map(category => {
//         if(category.category_id === 2)
//         console.log(category.category_id);

//     });
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO

// setupAndStart() 