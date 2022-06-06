// Accordion

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


// Validation for input address list

let inputLineCount = 0;
let inputAtCount = 0;
let inputLineArray = [];
let inputItemArray = [];
let invalidLineArray = [];
let inputAddressArray = [];
let addressLineNo = {};
let duplicateAddresses = [];
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

const INVALID_STATES = Object.freeze({
    NO_VALID_ITEM: 'No valid email address in the line',
    INVALID_FORM_ITEM: 'Invalid form email address'
})

const inputAddressListValidation = () => {
    const inputAddressList = document.querySelector('#input-address-list').value.trim();
    const inputRegex = document.querySelector('#email-regex').value;
    const emailRegex = new RegExp(inputRegex, 'gi');
    inputAddressArray = [];
    addressLineNo = {};
    inputSectionMessage.innerText = ''
    inputSectionMessage.style.display = 'none';
    inputLineCount = inputAddressList.split(/\r\n|\r|\n/).length;
    inputLineCountElm.innerText = `Line Count : ${inputLineCount}`;
    inputAtCount = (inputAddressList.match(/@/g) || []).length;
    inputAtCountElm.innerText = `@ Count : ${inputAtCount}`;
    inputLineArray = inputAddressList.split(/\r\n|\r|\n/);

    while (invalidListContainer.firstChild) {
        invalidListContainer.removeChild(invalidListContainer.firstChild);
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
            } else {
                // if aleady target address exists in addressLineNo, push the lineNo, if not add new key pair.
                addressLineNo[targetAddress[0]] ? addressLineNo[targetAddress[0]].push(lineNo) : addressLineNo[targetAddress[0]] = [lineNo];
            }
        })  //  Loop for .split(/,|;|\s/)
    })   //  Loop for .split(/\r\n|\r|\n/) 

    console.log(addressLineNo)

    duplicateAddresses = Object.entries(addressLineNo);

    if (duplicateAddresses) {
        duplicateAddresses = duplicateAddresses.filter((element) => element[1].length > 1);
        for (duplicateAddress of duplicateAddresses) {
            const duplicateListItem = document.createElement('li');
            duplicateListItem.innerText = `${duplicateAddress[1].toString().replace(',', ', ')} : ${duplicateAddress[0]}`;
            duplicateListContainer.append(duplicateListItem);
        }
        validationDetails.style.display = 'block';
        duplicateSection.style.display = 'block';
    }




    inputSummary.style.display = 'block';

    if (invalidListContainer.hasChildNodes()) {
        validationDetails.style.display = 'block';
        invalidSection.style.display = 'block';
    }

}


addressListSubmit.addEventListener('click', e => {
    e.preventDefault();
    inputAddressListValidation();
    // console.log('inputAddressArray : ', inputAddressArray);
})