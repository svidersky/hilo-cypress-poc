import {getSubmitButton, submitPdiForm, submitPostalCodeForm, submitThermostatCount, submitHouseType, initiateRegistration, simulateServerErrorOnSubmit, invokePostalCode} from './registration.utils';

context('Registration tests', () => {
    beforeEach(() => {
        // Bypass cookie pop-up
        cy.setCookie('warning-cookies', 'true');
    });

    it('Should enroll a new user if all input data is correct', () => {
        cy.visit('');

        initiateRegistration();

        submitHouseType();

        submitThermostatCount();

        submitPostalCodeForm();

        submitPdiForm();
    });

    // Data-set for the data-driven test
    const postalCodes = [
        {
            label: 'Valid Postal Code',
            code: 'J6K5B3',
            validate: () => {
                getSubmitButton()
                    .should('be.visible')
                    .should('be.enabled');
            }
        },
        {
            label: 'Invalid Postal Code',
            code: '123456',
            validate: () => {
                getSubmitButton()
                    .should('not.be.visible')
            }
        }
    ];

    postalCodes.forEach(postalCode => {
        it(`Should manage valid and non-valid correctly, current code: ${postalCode.label}`, () => {
            // Bypass 2 previous steps by pre-setting "standalone house" and thermostat count = 3 in localstorage
            cy.window().then(win => win.sessionStorage.setItem('6f110a0f-b81d-41ce-a2ca-7eccf53b9bfe', '{"__field_1211":["maison-detachee"],"__FormSubmissionId":"457b9044-a7b6-4055-9c73-75a0a9c6057f","__field_1212":"3"}'));

            cy.visit('/register/eligibility-step-3/');

            // Invoke a Postal Code value
            invokePostalCode(postalCode.code)

            // Validate the portal manages the code accordingly
            postalCode.validate();
        });
    });

    it('Should show an error on error 500 of geocode request', () => {
        // Bypass 2 previous steps by pre-setting "standalone house" and thermostat count = 3 in localstorage
        cy.window().then(win => win.sessionStorage.setItem('6f110a0f-b81d-41ce-a2ca-7eccf53b9bfe', '{"__field_1211":["maison-detachee"],"__FormSubmissionId":"457b9044-a7b6-4055-9c73-75a0a9c6057f","__field_1212":"3"}'));

        // Go directly to the Postal Code step
        cy.visit('/register/eligibility-step-3/');

        // Enter a valid Postal Code
        invokePostalCode();

        // Prepare a server error simulation
        simulateServerErrorOnSubmit(500);

        // Submit the Postal Code
        getSubmitButton()
            .should('be.visible')
            .should('be.enabled')
            .click();

        // Wait for the stubbed response
        cy.wait('@Submit');

        // Error message should be shown
        cy.get('.Form__Status__Message')
            .should('be.visible')
            .contains('error 500');
    });
});