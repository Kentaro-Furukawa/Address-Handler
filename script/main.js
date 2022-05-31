// Accordion

const accordion = document.querySelectorAll('.accordion-label');
const accordionArray = [...accordion];

accordionArray.forEach(element => {
    element.addEventListener('click', function () {
    element.classList.toggle('active')
    let panel = element.nextElementSibling;
    if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
        } else {panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  })
});


// Validation for input address list

let inputLineCount = 0;
let inputAtCount = 0;
const addressListSubmit = document.querySelector('#address-list-submit');
const inputSummary = document.querySelector('#input-summary');
const inputLineCountElm = document.querySelector('#input-line-count');
const inputAtCountElm = document.querySelector('#input-at-count');
const validationDetails = document.querySelector('#validation-details');

const inputAddressListValidation = () => {
    const inputAddressList = document.querySelector('#input-address-list').value;
    inputLineCount = inputAddressList.split(/\r\n|\r|\n/).length;
    inputLineCountElm.innerText = `Line Count : ${inputLineCount}`;
    inputAtCount = (inputAddressList.match(/@/g) || []).length;
    inputAtCountElm.innerText = `@ Count : ${inputAtCount}`;
    inputSummary.style.display = 'block';
    validationDetails.style.display = 'block';

}

addressListSubmit.addEventListener('click', e => {
    e.preventDefault();
    inputAddressListValidation();

})

