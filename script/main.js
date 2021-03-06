const defaultEmailRegex = '[A-z,0-9,.,_,%,+,-]{1,}\@[A-z,0-9,.,_,%,+,-]{1,}';
let emailRegex;

window.addEventListener('load', (event) => {
    copyWholeResultTooltip.innerText = 'Copy';
    document.querySelector('#current-year').innerText = new Date().getFullYear();
    document.querySelector('#email-regex').value = defaultEmailRegex;
});


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
const chunkSummaryList = document.querySelector('#chunk-summary > ol');
const chunkCardsSection = document.querySelector('#chunk-cards');

const inputAddressListValidation = () => {
    const inputAddressList = document.querySelector('#input-address-list').value.trim();
    const inputRegex = document.querySelector('#email-regex').value;
    emailRegex = new RegExp(inputRegex, 'gi');
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

    inputSummary.style.display = 'block';

    inputLineArray.forEach((element, index) => {
        const lineNo = index + 1;
        element.split(/,|;|\s/).forEach((item) => {
            const targetAddress = item.match(emailRegex);
            if (!(targetAddress) && item.length > 0) {
                const invalidListItem = document.createElement('li');
                invalidListItem.innerText = `${lineNo} : ${item}`;
                invalidListContainer.append(invalidListItem);
            } else if (targetAddress) {
                // if aleady target address exists in validAddresses, push the lineNo, if not add new key pair.
                validAddresses[targetAddress[0]] ? validAddresses[targetAddress[0]].push(lineNo) : validAddresses[targetAddress[0]] = [lineNo];
            }
        })
    })

    if (invalidListContainer.hasChildNodes()) {
        invalidSection.style.display = 'block';
    }



    duplicateAddresses = Object.entries(validAddresses);
    if (duplicateAddresses.length > 0) {
        duplicateAddresses = duplicateAddresses.filter((element) => element[1].length > 1);
        for (duplicateAddress of duplicateAddresses) {
            const duplicateListItem = document.createElement('li');
            duplicateListItem.innerText = `${duplicateAddress[1].toString().replaceAll(',', ', ')} : ${duplicateAddress[0]}`;
            duplicateListContainer.append(duplicateListItem);
        }
        //        duplicateSection.style.display = 'block';   somehow this line doesn't work as I meant be ????
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

        if (validAddressesArray.length > 0) {
            resultSection.style.display = 'block';
        }
        if (validAddressesArray.length > 1) {
            splitterSection.style.display = 'block';
        }
    }

    window.scroll({
        top: addressListSubmit.offsetTop - 20,
        behavior: 'smooth'
    });

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

    document.querySelector('#chunks > h2:first-child').innerText = `You have ${chunksArray.length} chunks.`;

    chunksArray.forEach((element, index) => {   // create elements for chunk summary part
        const chunkSummaryListItem = document.createElement('li');
        chunkSummaryListItem.innerText = `Chunk ${index + 1}: ${element.length}`;
        chunkSummaryList.append(chunkSummaryListItem);
    })

    chunksArray.forEach((element, index) => {   // create elements for chunk cards section

        const chunkCardContainer = document.createElement('section');
        chunkCardContainer.classList.add('chunk-card');

        const chunkCardHeader = document.createElement('h4');
        chunkCardHeader.classList.add('chunk-card-header');
        chunkCardHeader.innerText = `Chunk ${index + 1}`;

        const chunkCardCount = document.createElement('p');
        chunkCardCount.classList.add('chunk-card-count');
        chunkCardCount.innerText = `Count: ${element.length}`;

        const chunkCardFirstItem = document.createElement('p');
        chunkCardFirstItem.classList.add('chunk-card-first-item');
        chunkCardFirstItem.innerText = `First: ${element[0]}`;

        const chunkCardLastItem = document.createElement('p');
        chunkCardLastItem.classList.add('chunk-card-last-item');
        chunkCardLastItem.innerText = `Last: ${element[element.length - 1]}`;

        const copyButtonContainer = document.createElement('div');
        copyButtonContainer.classList.add('copy-button-container');

        const copyButton = document.createElement('button');
        copyButton.setAttribute('id', `copy-result-chunk-${index + 1}`);
        copyButton.classList.add('copy-chunk-result', 'group')

        const tooltipSpan = document.createElement('span');
        tooltipSpan.classList.add('tooltip', 'group-hover:scale-100');
        tooltipSpan.innerText = 'Copy';

        const copyIconSpan = document.createElement('span');
        copyIconSpan.classList.add('copy-icon');
        copyIconSpan.innerText = '????';

        copyButtonContainer.append(copyButton);
        copyButton.append(tooltipSpan, copyIconSpan)

        const chunkList = document.createElement('ol');

        element.forEach((item) => {
            const chunkListItem = document.createElement('li');
            chunkListItem.innerText = `${item}`;
            chunkList.append(chunkListItem);
        })

        chunkCardsSection.append(chunkCardContainer);
        chunkCardContainer.append(chunkCardHeader, chunkCardCount, chunkCardFirstItem, chunkCardLastItem, copyButtonContainer, chunkList);


        copyButton.addEventListener('click', e => {
            navigator.clipboard.writeText(element.toString().replaceAll(',', ';'));
            tooltipSpan.innerText = 'Copied!';
            copyIconSpan.innerText = '????';
        })
        copyButton.addEventListener('mouseout', e => {
            tooltipSpan.innerText = 'Copy';
        })
    })
}

splitterProcessButton.addEventListener('click', e => {
    chunksArray = [];

    while (chunkSummaryList.firstChild) {
        chunkSummaryList.removeChild(chunkSummaryList.firstChild);
    }

    while (chunkCardsSection.firstChild) {
        chunkCardsSection.removeChild(chunkCardsSection.firstChild);
    }

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

    window.scroll({
        top: splitterProcessButton.offsetTop - 20,
        behavior: 'smooth'
    });

})


// Reload :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const reloadModal = document.querySelector('#reload-modal');
const reloadModalClose = document.querySelector('#reload-modal-close');
const reloadConfirmButton = document.querySelector('#reload-confirm-button');
const reloadCancelButton = document.querySelector('#reload-cancel-button');

document.querySelector('#reload-button').addEventListener('click', e => {

    if (!(document.querySelector('#input-address-list').value.trim()) && document.querySelector('#email-regex').value === defaultEmailRegex) {
        location.reload()
        return
    }
    reloadModal.style.display = 'block';
});


reloadConfirmButton.addEventListener('click', e => {
    location.reload()
});

reloadModalClose.addEventListener('click', e => {
    reloadModal.style.display = 'none';
});

reloadCancelButton.addEventListener('click', e => {
    reloadModal.style.display = 'none';
});

window.addEventListener('click', e => {
    if (e.target === reloadModal) {
        reloadModal.style.display = 'none';
    }
});
