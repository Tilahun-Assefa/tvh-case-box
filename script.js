import { Box, ItemPlacement } from './model.js';

const containerEl = document.querySelector(".container");
const btnEl = document.querySelector(".btn");
const popupContainerEl = document.querySelector(".popup-container");
const closeIconEl = document.querySelector(".close-icon");
const resContainer = document.querySelector(".res-container");
const resCloseIconEl = document.querySelector(".res-close-icon")
const resEl = document.getElementById("res");

const formEl = document.getElementById("formElem");
formEl.addEventListener("submit", submitForm);

btnEl.addEventListener("click", () => {
    containerEl.classList.add("active");
    popupContainerEl.classList.remove("active");
});

closeIconEl.addEventListener("click", () => {
    containerEl.classList.remove("active");
    popupContainerEl.classList.add("active");
});

resCloseIconEl.addEventListener("click", () => {
    resContainer.classList.add("active");
    containerEl.classList.remove("active");
    resEl.innerHTML = "";
});

function submitForm(e) {
    popupContainerEl.classList.add("active");
    resContainer.classList.remove("active");
    // press();
    e.preventDefault();
    const formData = new FormData(formEl);
    formData.forEach(el => {
        console.log(el);
    });
    let case_box = formData.get("case_box");
    let item_box = formData.get("item_box");
    let qty = +formData.get('qty');

    console.log("item Box: ", item_box, " Quantity: ", qty, " and Case Box: ", case_box);

    const itemBox = itemBoxesArr.find(el => el.boxName === item_box);
    // const caseBox = caseBoxesArr.find(el => el.boxName === case_box);

    const selectedPlacement = selectCaseBox(itemBox, qty);
    const selectedCaseBoxByVolume = selectCaseBoxByVolume(itemBox, qty);

    if (selectedPlacement != null || undefined) {
        resEl.innerHTML = ` By Orientiation Placement ID: ${selectedPlacement.name} <br>
        Box Type: ${selectedPlacement.caseBox.boxName}<br>
        Quantity: ${selectedPlacement.numOfItemBox} <br>
        Item box width along ${selectedPlacement.itemBox_width_dir}<br>
        Item box length along ${selectedPlacement.itemBox_length_dir}<br>
        Item box height along ${selectedPlacement.itemBox_height_dir} </br>
        By Volume CaseBox: ${selectedCaseBoxByVolume.boxName} <br>`;
    } else {
        resEl.innerHTML = `Best Set Up can not be determine! please try one by one.  <br> `;
    }
}

//function that return the selected case box with better item boxes arrangement
function selectCaseBox(itemBox, qty) {

    const arrPlacements = caseBoxesArr.map(cBox => {
        return selectBetterPlacement(cBox, itemBox)
    });
    console.log(arrPlacements.map(el => {
        return { name: el.caseBox.boxName, qty: el.numOfItemBox }
    }
    ));
    let qtyDiff = arrPlacements[0].numOfItemBox - qty;
    let minDiff = qtyDiff >= 0 ? qtyDiff : 999;
    let selectedPlacement = arrPlacements[0];

    for (let i = 0; i < arrPlacements.length; i++) {
        let num = arrPlacements[i].numOfItemBox;
        if (num === qty) {
            selectedPlacement = arrPlacements[i];
            break;
        }
        if (num > qty && num - qty < minDiff) {
            minDiff = num - qty;
            selectedPlacement = arrPlacements[i];
        }
    }
    return selectedPlacement;
}

//function that take casebox and itembox, 
// then return the quantity of itemboxes in the casebox
function calculateNumItemBox(caseBox, itemBox) {
    const numOfBoxes = selectBetterPlacement(caseBox, itemBox).numOfItemBox;
    console.log(`Case box: ${caseBox.boxName} can hold ${numOfBoxes} of ${itemBox.boxName}`);
    console.log("Max number of boxes in CaseBox", caseBox.boxName, "=", numBox, "of", itemBox.boxName, ", Extra space", caseBox.volume - numItemBox * itemBox.volume);
    console.log("Case Box Width:", caseBox.width_x, "Case Box Length:", caseBox.length_y, "Case Box Height:", caseBox.height_z, "Box Volume:", caseBox.volume);
    console.log("Item Box Width:", itemBox.width_x, "Item Box Length:", itemBox.length_y, "Item Box Height:", itemBox.height_z, "Item Box Volume:", itemBox.volume);
    return numOfBoxes;
}

//function that take the casebox and the itembox, 
// then return best placement(arrangement of itemboxes in that casebox)
function selectBetterPlacement(caseBox, itemBox) {
    let maxNumBox = 0;
    let placementArr = [];
    let selectedPlacement;
    //x-axis: width, y-axis: length, z-axis: height
    let numItemBox_case_height;
    let numItemBox_case_width;
    let numItemBox_case_length;

    //CaseBox Height as Reference
    //1. itembox_height direction along case_box_height
    numItemBox_case_height = Math.floor(caseBox.height_z / itemBox.height_z);

    //itemBox_width along caseBox_width and itemBox_length along caseBox_length
    numItemBox_case_width = Math.floor(caseBox.width_x / itemBox.width_x);
    numItemBox_case_length = Math.floor(caseBox.length_y / itemBox.length_y);
    const itemPlacement1 = new ItemPlacement("placement-1", caseBox, itemBox, numItemBox_case_width, numItemBox_case_length, numItemBox_case_height, "caseBox_width", "caseBox_length", "caseBox_height");
    placementArr.push(itemPlacement1);

    //itemBox_length along caseBox_width and itemBox_width along caseBox_length
    numItemBox_case_width = Math.floor(caseBox.width_x / itemBox.length_y);
    numItemBox_case_length = Math.floor(caseBox.length_y / itemBox.width_x);
    const itemPlacement2 = new ItemPlacement("placement-2", caseBox, itemBox, numItemBox_case_width, numItemBox_case_length, numItemBox_case_height, "caseBox_length", "caseBox_width", "caseBox_height");
    placementArr.push(itemPlacement2);

    //2. itembox_width direction along case_box_height
    numItemBox_case_height = Math.floor(caseBox.height_z / itemBox.width_x);

    //itemBox_length along caseBox_width and itemBox_height along caseBox_length
    numItemBox_case_width = Math.floor(caseBox.width_x / itemBox.length_y);
    numItemBox_case_length = Math.floor(caseBox.length_y / itemBox.height_z);
    const itemPlacement3 = new ItemPlacement("placement-3", caseBox, itemBox, numItemBox_case_width, numItemBox_case_length, numItemBox_case_height, "caseBox_height", "caseBox_width", "caseBox_length");
    placementArr.push(itemPlacement3);

    //itemBox_height along caseBox_width and itemBox_length along caseBox_length
    numItemBox_case_width = Math.floor(caseBox.width_x / itemBox.height_z);
    numItemBox_case_length = Math.floor(caseBox.length_y / itemBox.length_y);
    const itemPlacement4 = new ItemPlacement("placement-4", caseBox, itemBox, numItemBox_case_width, numItemBox_case_length, numItemBox_case_height, "caseBox_height", "caseBox_length", "caseBox_width");
    placementArr.push(itemPlacement4);

    //3. itembox_length direction along case_box_height
    numItemBox_case_height = Math.floor(caseBox.height_z / itemBox.length_y);

    //itemBox_width along caseBox_width and itemBox_height along caseBox_length
    numItemBox_case_width = Math.floor(caseBox.width_x / itemBox.width_x);
    numItemBox_case_length = Math.floor(caseBox.length_y / itemBox.height_z);
    const itemPlacement5 = new ItemPlacement("placement-5", caseBox, itemBox, numItemBox_case_width, numItemBox_case_length, numItemBox_case_height, "caseBox_width", "caseBox_height", "caseBox_length");
    placementArr.push(itemPlacement5);

    //itemBox_height along caseBox_width and itemBox_width along caseBox_length
    numItemBox_case_width = Math.floor(caseBox.width_x / itemBox.height_z);
    numItemBox_case_length = Math.floor(caseBox.length_y / itemBox.width_x);
    const itemPlacement6 = new ItemPlacement("placement-6", caseBox, itemBox, numItemBox_case_width, numItemBox_case_length, numItemBox_case_height, "caseBox_length", "caseBox_height", "caseBox_width");
    placementArr.push(itemPlacement6);

    maxNumBox = Math.max(...(placementArr.map(p => p.numOfItemBox)));
    selectedPlacement = placementArr.find((pl) => pl.numOfItemBox === maxNumBox);
    return selectedPlacement;
}

//function that take itembox and itembox quantity
//  and return caseBox that has least volume difference(small extra space)
function selectCaseBoxByVolume(itemBox, numItemBox) {
    let selectedCaseBox = caseBoxesArr[0];
    let diff = selectedCaseBox.volume - numItemBox * itemBox.volume;
    let minDiff = diff >= 0 ? diff : 9999;

    for (let i = 0; i < caseBoxesArr.length; i++) {
        diff = caseBoxesArr[i].volume - numItemBox * itemBox.volume;
        if (diff === 0) {
            selectedCaseBox = caseBoxesArr[i];
            break;
        }
        if (diff > 0 && diff < minDiff) {
            minDiff = diff;
            selectedCaseBox = caseBoxesArr[i];
        }
    }
    console.log("Number of boxes in CaseBox", selectedCaseBox.boxName, "=", numItemBox, "of", itemBox.boxName, ", Extra space =", selectedCaseBox.volume - numItemBox * itemBox.volume);
    console.log("Case Box Width:", selectedCaseBox.width_x, "Case Box Length:", selectedCaseBox.length_y, "Case Box Height:", selectedCaseBox.height_z, "Box Volume:", selectedCaseBox.volume);
    console.log("Item Box Width:", itemBox.width_x, "Item Box Length:", itemBox.length_y, "Item Box Height:", itemBox.height_z, "Item Box Volume:", itemBox.volume);
    return selectedCaseBox;
}
//small item boxes
const cp002 = new Box("CP002", 1.25, 1.25, 2);
const cp004 = new Box("CP004", 2, 1.875, 2.625);
const cp005 = new Box("CP005", 2.25, 1.0625, 3.4375);
const cp008 = new Box("CP008", 3, 2, 3);
const cp009 = new Box("CP009", 3.626, 3.127, 4.3125);
const cp013 = new Box("CP013", 3.125, 2.375, 8.025); // modified size 
const cp014 = new Box("CP014", 5.25, 2, 5.3); //modified size(measured)
const cp016 = new Box("CP016", 5, 2.5, 5);
const cp017 = new Box("CP017", 3, 5, 0.5625, 4); //Belt sleeve
const cp018 = new Box("CP018", 3.5, 1.0625, 4); //Belt sleeve
const cp020 = new Box("CP020", 2.375, 1.825, 3.0625);

const itemBoxesArr = [cp002, cp004, cp005, cp008, cp009, cp013, cp014, cp016, cp020];

//Case boxes outside sizes but we need the internal sizes (x-0.125(1/8))
const bx007 = new Box("BX007", 8, 8, 8);
const bx007M = new Box("BX007M", 7.875, 7.875, 7.875); //modified size
const bx009 = new Box("BX009", 9, 9, 5);
const bx009M = new Box("BX009M", 8.875, 8.875, 4.875);
const bx011 = new Box("BX011", 11.5, 5.5, 5);
const bx011M = new Box("BX011M", 11.375, 5.375, 4.875);
const bx015 = new Box("BX015", 18, 12, 12);
const bx015M = new Box("BX015M", 17.875, 11.875, 11.875);
const bx22d = new Box("BX22D", 5.25, 4.25, 3.125);
const bx22dM = new Box("BX22DM", 5.125, 4.125, 3.0);
const bx030 = new Box("BX030", 13, 13, 4.625);
const bx030M = new Box("BX030M", 12.875, 12.875, 4.5);
const bx032 = new Box("BX032", 21.75, 13.375, 7.5);
const bx032M = new Box("BX032M", 21.625, 13.25, 7.375);
const bx510 = new Box("BX510", 6, 6, 4);
const bx510M = new Box("BX510M", 5.875, 5.875, 3.875);

const bx515 = new Box("BX515", 7, 7, 5);
const bx515M = new Box("BX515M", 6.875, 6.875, 4.875);

const bx520 = new Box("BX520", 12, 8, 8);
const bx520M = new Box("BX520M", 11.875, 7.875, 7.875);

const bx525 = new Box("BX525", 15, 15, 8);
const bx525M = new Box("BX525M", 14.875, 14.875, 7.875);

const bx555 = new Box("BX555", 9, 5, 4);
const bx555M = new Box("BX555M", 8.875, 4.875, 3.875);

const bx560 = new Box("BX560", 12, 6, 3);
const bx560M = new Box("BX560M", 11.875, 5.875, 2.875);

const bx565 = new Box("BX565", 15, 9, 4);
const bx565M = new Box("BX565M", 14.875, 8.875, 3.875);

const caseBoxesArr = [bx007M, bx009M, bx011M, bx015M, bx22dM, bx030M, bx032M, bx510M, bx515M, bx520M, bx525M, bx555M, bx560M, bx565M];


function press() {
    const text = "TVH box selection";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 3;
    window.speechSynthesis.speak(text);
}
