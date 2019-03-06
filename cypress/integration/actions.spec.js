context('Actions', () => {

  describe('Home Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000')
      cy.wait(10)
    })

    it('can type name', () => {
      cy.get('#name-input')
      .type('Kane').should('have.id', 'name-input');
    })

    it('can\'t enter a null value on input box', () => {
      cy.get('#name-input').should('have.attr', 'required');
    })

    it('focuses on the input box onLoad', () => {
      cy.focused().should('have.id', 'name-input')
    })

    it('has a button with text \'Play\'', () => {
      cy.get('#name-submit-link')
      .invoke('text')
      .should('contain', 'Play')
    })

    it('renders GameView with username on submit', () => {
      cy.get('#name-input')
      .type('Kane')

      cy.get('#name-submit-link').click();

      cy.get('#username-header');
    })

    it('should add current player to game on login page', () => {
      cy.get('.currently-playing-container').then(($listItems) => {

        // submit new player
        cy.get('#name-input').type('Kane')
        cy.get('#name-submit-link').click();

        // check there is now one additional player on PlayerList
        cy.get('.currently-playing-container').children().should('have.length', $listItems.children().length + 1)
      });
    })
  })
})
