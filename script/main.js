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

const addressListSubmit = document.querySelector('#address-list-submit');
let inputLineCount = 0;
let inputAtCount = 0;

const inputAddressListValidation = () => {
    const inputAddressList = document.querySelector('#input-address-list').value;
    inputLineCount = inputAddressList.split(/\r\n|\r|\n/).length;
    inputAtCount = (inputAddressList.match(/@/g) || []).length;
}

addressListSubmit.addEventListener('click', e => {
    e.preventDefault();
    inputAddressListValidation();

})

