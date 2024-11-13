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
    const caseBox = caseBoxesArr.find(el => el.boxName === case_box);

    const arrPlacements = caseBoxesArr.map(cBox => {
        return selectBetterPlacementOfBox(cBox, itemBox)
    });
    console.log(arrPlacements.map(el => {
        return { name: el.caseBox.boxName, qty: el.numOfItemBox }
    }
    ));

    let minDiff = arrPlacements[0].numOfItemBox - qty >= 0 ? arrPlacements[0].numOfItemBox : 999;
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

    const numOfBoxes = selectBetterPlacementOfBox(caseBox, itemBox).numOfItemBox;

    if (selectedPlacement != null || undefined) {
        resEl.innerHTML = `Placement ID: ${selectedPlacement.name} <br>
        Box Type: ${selectedPlacement.caseBox.boxName}<br>
        Quantity: ${selectedPlacement.numOfItemBox} <br>
        Item box width along ${selectedPlacement.itemBox_width_dir}<br>
        Item box length along ${selectedPlacement.itemBox_length_dir}<br>
        Item box height along ${selectedPlacement.itemBox_height_dir} </br>`;
    } else if (case_box != null || undefined) {
        resEl.innerHTML = `Best Set Up can not be determine! please try one by one.  <br>     
        Case box: ${caseBox.boxName} can hold ${numOfBoxes} of ${itemBox.boxName} `;
    }
}

function selectBetterPlacementOfBox(caseBox, itemBox) {
    let maxNumBox = 0;
    let placementArr = [];
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

    // console.log(placementArr);
    maxNumBox = Math.max(...(placementArr.map(p => p.numOfItemBox)));

    let selectedPlacement = placementArr.find((pl) => pl.numOfItemBox === maxNumBox);
    // console.log("Max number of boxes in CaseBox", caseBox.boxName, "=", numBox, "of", itemBox.boxName, ", Extra space", caseBox.volume - numBox * itemBox.volume);

    // console.log("Case Box Width:", caseBox.width_x, "Case Box Length:", caseBox.length_y, "Case Box Height:", caseBox.height_z, "Box Volume:", caseBox.volume);
    // console.log("Item Box Width:", itemBox.width_x, "Item Box Length:", itemBox.length_y, "Item Box Height:", itemBox.height_z, "Item Box Volume:", itemBox.volume);
    return selectedPlacement;
}

//small item boxes
const cp002 = new Box("CP002", 1.25, 1.25, 2);
const cp004 = new Box("CP004", 2, 1.875, 2.625);
const cp005 = new Box("CP005", 2.25, 1.0625, 3.4375);
const cp008 = new Box("CP008", 3, 2, 3);
const cp009 = new Box("CP009", 1.25, 1.25, 2);
const cp017 = new Box("CP017", 2, 1.875, 2.625);
const cp018 = new Box("CP018", 2.25, 1.0625, 3.4375);
const cp020 = new Box("CP020", 3, 2, 3);

const itemBoxesArr = [cp002, cp004, cp005, cp008, cp009, cp017, cp018, cp018, cp020];

//Case boxes
const bx007 = new Box("BX007", 8, 8, 8);
const bx009 = new Box("BX009", 9, 9, 5);
const bx011 = new Box("BX011", 11.5, 5.5, 5);
const bx015 = new Box("BX015", 18, 12, 12);
const bx22d = new Box("BX22D", 5.25, 4.25, 3.125);
const bx030 = new Box("BX030", 13, 13, 4.625);
const bx510 = new Box("BX510", 6, 6, 4);
const bx515 = new Box("BX515", 7, 7, 5);
const bx520 = new Box("BX520", 12, 8, 8);
const bx525 = new Box("BX525", 15, 15, 8);
const bx555 = new Box("BX555", 9, 5, 4);
const bx560 = new Box("BX560", 12, 6, 3);
const bx565 = new Box("BX565", 15, 9, 4);
const caseBoxesArr = [bx007, bx009, bx011, bx015, bx22d, bx030, bx510, bx515, bx520, bx525, bx555, bx560, bx565];

