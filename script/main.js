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

const inputAddressListValidation = () => {
    const inputAddressList = document.querySelector('#input-address-list').value;
    const inputLineLength = inputAddressList.split(/\r\n|\r|\n/).length;
    console.log(inputLineLength)
}

addressListSubmit.addEventListener('click', e => {
    e.preventDefault();
    inputAddressListValidation();
})

