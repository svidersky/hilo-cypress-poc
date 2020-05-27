/// Selectors declaration

// Common selectors
export const getNextStepButton = () => cy.get('.btnNext');
export const getSubmitButton = () => cy.get('.Form__Element.FormExcludeDataRebind.FormSubmitButton');

// Initiate registration screens
export const getRegisterButton = () => cy.get('.btn--pilot--wrapper > .btn');
export const getStep1Button = () => cy.get('a.btn.btn--invert');

// House type screen
export const getStandaloneHouseButton = () => cy.get('#__field_1211-maison-detachee');

// Thermomstat count screeb
export const getThermostatCounntInput = () => cy.get('.FormRange__Input');

// Postal Code screen
export const getZipCodeField = () => cy.get('.Form__CustomInput.FormAddressElement__ZipCode');

// PDI screen
export const getFirstNameField = () => cy.get('#8cf3ee11-ce9d-4bf2-b8b9-db8b84726782');
export const getLastNameField = () => cy.get('#465c5b5c-45e7-4f51-8d8a-23973fac0011');
export const getEmailField = () => cy.get('#e365fe70-8706-43be-b884-ade5a8e32854');
export const getPhoneNumberField = () => cy.get('#a8621553-797d-4cf6-a0a7-7d7778ed4c9a');

export const getAcceptButton = () => cy.get('#0d938f09-12a4-4e61-8aa2-cb92321eccd5');

export const getConsentCheckbox = () => cy.get('#f249b915-4082-4d80-a43a-622603286b7a > fieldset > label');
export const getConsentCheckboxError = () => cy.get('#f249b915-4082-4d80-a43a-622603286b7a > fieldset > .Form__Element__ValidationError');

/// Util functions 

/**
* Function to stub status code of Submit response 
* @param {number} statusCode the status the response should return.
* @example
* simulateServerError(500);
*/
export const simulateServerErrorOnSubmit = (statusCode) => {
    cy.server();
    cy.route({
        method: 'POST',
        url: '**/Submit**',
        status: statusCode,
        response: []
    }).as('Submit');
};

/**
* Function to invoke a Postal Code into the Postal Code Field 
* @param {string} postalCode the desired Postal Code
* @example
* invokePostalCode('J6K5B3');
*/
export const invokePostalCode = (postalCode = 'J6K5B3') => {
    getZipCodeField()
        .should('be.visible')
        .invoke('val', postalCode)
        .trigger('change');
};

export const initiateRegistration = () => {
    getRegisterButton()
        .should('be.visible')
        .should('have.attr', 'href', '/en-ca/register/')
        .click();

    cy.url().should('include', '/en-ca/register/')

    getStep1Button()
        .should('be.visible')
        .should('have.attr', 'href', '/en-ca/register/eligibility-step1/')
        .click();
};

export const submitHouseType = () => {
    cy.url().should('include', '/en-ca/register/eligibility-step1/');

    getNextStepButton()
        .should('not.be.visible');

    getStandaloneHouseButton()
        .should('be.visible')
        .click({force: true});

    getNextStepButton()
        .should('be.visible')
        .should('be.enabled')
        .click();
};

export const submitThermostatCount = () => {
    cy.url().should('include', '/en-ca/register/eligibility-step-2/');

    getNextStepButton()
        .should('not.be.visible')

    getThermostatCounntInput()
        .invoke('val', 5)
        .trigger('change');

    getNextStepButton()
        .should('be.visible')
        .should('be.enabled')
        .click();
};

export const submitPostalCodeForm = () => {
    cy.url().should('include', '/en-ca/register/eligibility-step-3/');

    getSubmitButton()
        .should('not.be.visible')

    invokePostalCode();

    getSubmitButton()
        .should('be.visible')
        .should('be.enabled')
        .click();
};

export const submitPdiForm = () => {
    cy.url().should('include', '/en-ca/register/eligibility-results/');

    getFirstNameField()
        .should('be.visible')
        .type('Leonid');

    getLastNameField()
        .type('Sviderskii');

    getEmailField()
        .type('email@email.com');

    getPhoneNumberField()
        .type('5140000000')

    getAcceptButton()
        .should('be.enabled')
        .click();

    getConsentCheckboxError()
        .should('be.visible');

    getConsentCheckbox()
        .click();

    getAcceptButton()
        .should('be.enabled')
    // Disabled click to avoid spamming your DB
    // .click();
};