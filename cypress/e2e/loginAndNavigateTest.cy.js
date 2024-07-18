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

  it('navigates to advanced controls page', () => {
    // Click the 'Advanced Controls' link
    
    cy.contains('Advanced Controls').click();
    cy.url().should('include', '/advanced-controls');

    // Verify the URL
    // cy.url().should('include', '/advanced-controls');
    cy.get('[data-testid="advanced-controls-page"]').should('be.visible');

  });
  it('navigates to year over year page', () => {
    // Click the 'Advanced Controls' link
    
    cy.contains('Year Over Year').click();
    cy.url().should('include', '/yearoveryear');
    cy.contains('Selected Site').should('be.visible');
    cy.contains('Results').should('be.visible');
  });
  it('navigates to phases page', () => {
    // Click the 'Advanced Controls' link
    
    cy.contains('Infrastructure Phases').click();
    cy.url().should('include', '/phases');
    cy.contains('Add Infrastructure Project').should('be.visible');
    cy.contains('Installation Cost').should('exist');
  });
  it('navigates to fleet editor page', () => {
    // Click the 'Advanced Controls' link
    
    cy.contains('Fleet Editor').click();
    cy.url().should('include', '/fleet-editor');
    cy.contains('Export Fleet').should('be.visible');
    cy.contains('Reset to default').should('be.visible');
  });
  it('navigates back to dashboard', () => {
    // Navigate back to Dashboard
    cy.contains('Dashboard').click();
    
    // Verify the URL
    cy.url().should('include', '/');

    // Click the 'Log Out' button
    cy.contains('Log Out').click();
    cy.get('[data-testid="logOutButton"]').click();

    cy.url().should('include', '/login');
    // Verify that the user is logged out and redirected to the login page
  });
});
