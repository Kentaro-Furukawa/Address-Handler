// Accordion ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const accordion = document.querySelectorAll('.accordion-label');
const accordionArray = [...accordion];

accordionArray.forEach(element => {
    element.addEventListener('click', function () {
        element.classList.toggle('active')
        let panel = element.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + 'px';
        }
    })
});


// Validation for input address list ::::::::::::::::::::::::::::::::::::::

let inputLineCount = 0;
let inputAtCount = 0;
let inputLineArray = [];
let inputItemArray = [];
let invalidLineArray = [];
let inputAddressArray = [];
let validAddresses = {};
let duplicateAddresses = [];
let validAddressesArray = [];
let chunksArray = [];
const addressListSubmit = document.querySelector('#address-list-submit');
const inputSectionMessage = document.querySelector('#input-section-message');
const inputSummary = document.querySelector('#input-summary');
const inputLineCountElm = document.querySelector('#input-line-count');
const inputAtCountElm = document.querySelector('#input-at-count');
const validationDetails = document.querySelector('#validation-details');
const invalidSection = document.querySelector('#invalid');
const invalidListContainer = document.querySelector('#invalid-list');
const duplicateSection = document.querySelector('#duplicate');
const duplicateListContainer = document.querySelector('#duplicate-list');
const resultSection = document.querySelector('#result');
const resultArrayLenght = document.querySelector('#result-array-lenght');
const copyWholeResult = document.querySelector('#copy-whole-result');
const copyWholeResultTooltip = document.querySelector('#copy-whole-result > .tooltip')
const resultListContainer = document.querySelector('#result-list');
const splitterSection = document.querySelector('#splitter');
const splitterProcessButton = document.querySelector('#splitter-process');
const chunkSection = document.querySelector('#chunks');
const chunkCardsSection = document.querySelector('#chunk-cards');

window.addEventListener('load', (event) => {
    copyWholeResultTooltip.innerText = 'Copy';
});

// const INVALID_STATES = Object.freeze({
//     NO_VALID_ITEM: 'No valid email address in the line',
//     INVALID_FORM_ITEM: 'Invalid form email address'
// })

const inputAddressListValidation = () => {
    const inputAddressList = document.querySelector('#input-address-list').value.trim();
    const inputRegex = document.querySelector('#email-regex').value;
    const emailRegex = new RegExp(inputRegex, 'gi');
    inputAddressArray = [];
    validAddresses = {};
    inputSectionMessage.innerText = '';
    inputSectionMessage.style.display = 'none';
    validationDetails.style.display = 'none';
    invalidSection.style.display = 'none';
    duplicateSection.style.display = 'none';
    resultArrayLenght.innerText = '';
    resultSection.style.display = 'none';
    splitterSection.style.display = 'none';
    chunkSection.style.display = 'none';
    inputLineCount = inputAddressList.split(/\r\n|\r|\n/).length;
    inputLineCountElm.innerText = `Line Count : ${inputLineCount}`;
    inputAtCount = (inputAddressList.match(/@/g) || []).length;
    inputAtCountElm.innerText = `@ Count : ${inputAtCount}`;
    inputLineArray = inputAddressList.split(/\r\n|\r|\n/);

    while (invalidListContainer.firstChild) {
        invalidListContainer.removeChild(invalidListContainer.firstChild);
    }
    while (duplicateListContainer.firstChild) {
        duplicateListContainer.removeChild(duplicateListContainer.firstChild);
    }
    while (resultListContainer.firstChild) {
        resultListContainer.removeChild(resultListContainer.firstChild);
    }

    if (!(inputAddressList)) {
        inputSectionMessage.innerText = 'Textarea is empty, input something.'
        inputSectionMessage.style.display = 'block';
        return
    }

    inputLineArray.forEach((element, index) => {
        const lineNo = index + 1;
        element.split(/,|;|\s/).forEach((item) => {
            const targetAddress = item.match(emailRegex);
            if (!(targetAddress)) {
                const invalidListItem = document.createElement('li');
                invalidListItem.innerText = `${lineNo} : ${item}`;
                invalidListContainer.append(invalidListItem);
                invalidSection.style.display = 'block';
            } else {
                // if aleady target address exists in validAddresses, push the lineNo, if not add new key pair.
                validAddresses[targetAddress[0]] ? validAddresses[targetAddress[0]].push(lineNo) : validAddresses[targetAddress[0]] = [lineNo];
            }
        })
    })

    inputSummary.style.display = 'block';

    duplicateAddresses = Object.entries(validAddresses);
    if (duplicateAddresses.length > 0) {
        duplicateAddresses = duplicateAddresses.filter((element) => element[1].length > 1);
        for (duplicateAddress of duplicateAddresses) {
            const duplicateListItem = document.createElement('li');
            duplicateListItem.innerText = `${duplicateAddress[1].toString().replaceAll(',', ', ')} : ${duplicateAddress[0]}`;
            duplicateListContainer.append(duplicateListItem);
        }
        //        duplicateSection.style.display = 'block';   somehow this line doesn't work as I meant be 🤔
    }

    if (duplicateListContainer.hasChildNodes()) {  //    I put these lines instead.
        duplicateSection.style.display = 'block';
    }

    if (invalidListContainer.hasChildNodes() || duplicateListContainer.hasChildNodes()) {
        validationDetails.style.display = 'block';
    }

    if (validAddresses) {
        validAddressesArray = Object.keys(validAddresses);
        resultArrayLenght.innerText = `Result array length: ${validAddressesArray.length}`;

        for (validAddress of validAddressesArray) {
            const resultListItem = document.createElement('li');
            resultListItem.innerText = `${validAddress}`;
            resultListContainer.append(resultListItem);
        }
        resultSection.style.display = 'block';

        if (validAddressesArray.length > 1) {
            splitterSection.style.display = 'block';
        }
    }
}

addressListSubmit.addEventListener('click', e => {
    e.preventDefault();
    inputAddressListValidation();
})

copyWholeResult.addEventListener('click', e => {
    navigator.clipboard.writeText(validAddressesArray.toString().replaceAll(',', ';'));
    copyWholeResultTooltip.innerText = 'Copied!';
})

copyWholeResult.addEventListener('mouseout', e => {
    copyWholeResultTooltip.innerText = 'Copy';
})


// Splitter :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const unevenlySliceIntoChunks = (arr, maxChunkSize) => {
    const res = [];
    for (let i = 0; i < arr.length; i += maxChunkSize) {
        const chunk = arr.slice(i, i + maxChunkSize);
        res.push(chunk);
    }
    return res;
}

const evenlySliceIntoChunks = (arr, maxChunkSize) => {
    const res = [];
    const chunkSize = Math.ceil(arr.length / (Math.ceil(arr.length / maxChunkSize)));
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

const createChunkElements = (chunksArray) => {
    console.log('chunksArray --->>', chunksArray);


    document.querySelector('#chunks > h2:first-child').innerText = `You have ${chunksArray.length} chunks 👐`;

    chunksArray.forEach((element, index) => {
        const chunkSummaryListItem = document.createElement('li');
        chunkSummaryListItem.innerText = `Chunk ${index + 1}: ${element.length}`;
        document.querySelector('#chunk-summary > ol').append(chunkSummaryListItem);
    })
}

splitterProcessButton.addEventListener('click', e => {
    chunksArray = [];
    const maxChunkSize = parseInt(document.querySelector('#maximum-number').value);
    if (document.querySelector('#split-evenly').checked === true) {
        chunksArray = evenlySliceIntoChunks(validAddressesArray, maxChunkSize)
    } else {
        chunksArray = unevenlySliceIntoChunks(validAddressesArray, maxChunkSize)
    }

    if (chunksArray.length > 0) {
        createChunkElements(chunksArray);
    }

    chunkSection.style.display = 'block';
})



