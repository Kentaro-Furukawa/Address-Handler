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
const addressListSubmit = document.querySelector('#address-list-submit');
const inputSummary = document.querySelector('#input-summary');
const inputLineCountElm = document.querySelector('#input-line-count');
const inputAtCountElm = document.querySelector('#input-at-count');
const validationDetails = document.querySelector('#validation-details');

const INVALID_STATES = Object.freeze({
    NO_VALID_ITEM: 'No valid email address in the line',
    INVALID_FORM_ITEM: 'Invalid form email address'
})

const inputAddressListValidation = () => {
    const inputAddressList = document.querySelector('#input-address-list').value.trim();
    const inputRegex = document.querySelector('#email-regex').value;
    const emailRegex = new RegExp(inputRegex, 'gi');
    inputLineCount = inputAddressList.split(/\r\n|\r|\n/).length;
    inputLineCountElm.innerText = `Line Count : ${inputLineCount}`;
    inputAtCount = (inputAddressList.match(/@/g) || []).length;
    inputAtCountElm.innerText = `@ Count : ${inputAtCount}`;
    inputLineArray = inputAddressList.split(/\r\n|\r|\n/);

    inputLineArray.forEach((element, index) => {
        const lineNo = index + 1;
        element.split(/,|;|\s/).forEach((item) => {
            let address = item.match(emailRegex);
            console.log('Address item:', address)
            if (address) {
                inputAddressArray = [...inputAddressArray, ...address];
            } else {
                console.log(`${lineNo} : Invalid ${item}`);
                let invalidListItem = document.createElement('li');
                invalidListItem.innerText = `${lineNo} : ${item}`;
                document.querySelector('#invalid-list').append(invalidListItem);
            }
        })
        inputSummary.style.display = 'block';

        validationDetails.style.display = 'block';
    })
}



addressListSubmit.addEventListener('click', e => {
    e.preventDefault();
    inputAddressListValidation();
    console.log('inputAddressArray : ', inputAddressArray);
})