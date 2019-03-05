context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

it('can type name', () => {
  cy.get('#name-input')
  .type('Kane').should('have.id', 'name-input');
})

it('focuses on the input box', () => {
  cy.focused().should('have')
})

it('redirects when name submitted', () => {
  cy.get('#name-input')
  .type('Kane')

  cy.get('#name-submit-link').click();

  cy.contains()
})

})
