describe('login,click around,logout', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });

    // Perform the login
    cy.visit('http://127.0.0.1:3000/');
    
    // Verify the title
    cy.get('[data-testid="title"]').should('exist')
      .should('have.text', 'Pro Forma');
    
    // Enter the username and password
    cy.get('input[name="username"]').type('newuser');
    cy.get('input[name="password"]').type('password');
    
    // Click the login button
    cy.get('button[type="submit"]').click();

    // Verify that the URL is correct after login
    cy.url().should('include', '/');
  });

  it('click on electrification scenario', () => {
    // Click the 'Advanced Controls' link
    

  });
});
