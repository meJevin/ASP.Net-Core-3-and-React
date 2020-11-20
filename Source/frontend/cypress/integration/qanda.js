describe('Ask a question', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it("When signed in and ask a valid question, the question should successfuly save", () => {
        cy.contains('Q & A');

        cy.contains("Unanswered questions");

        cy.contains("Sign In").click();

        cy.url().should('include', 'auth0');

        cy.findByLabelText('Email')
            .type("mejevin@gmail.com")
            .should('have.value', 'mejevin@gmail.com');

        cy.findByLabelText('Password')
            .type('superPassword123!')
            .should('have.value', 'superPassword123!');

        cy.get('form').submit();

        cy.contains('Unanswered questions');

        cy.contains('Ask a question').click();

        cy.contains('Ask Page');

        var title = 'title test';
        var content = 'Lots and lots and lots and lots and lots of content test';
        cy.findByLabelText('Title')
            .type(title)
            .should('have.value', title);
        cy.findByLabelText('Content')
            .type(content)
            .should('have.value', content);

        cy.contains('Submit Your Question').click();
        cy.contains('Your question was successfully submitted');

        cy.contains('Sign Out').click();
        cy.contains('Succesfully signed out!');
    });
});