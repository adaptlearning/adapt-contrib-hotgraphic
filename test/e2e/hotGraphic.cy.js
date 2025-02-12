describe('Hot Graphic', function () {
  const stripHtml = cy.helpers.stripHtml;

  function loopThroughHotGraphic(hotGraphicComponent) {
    const { _items, _canCycleThroughPagination } = hotGraphicComponent;
    cy.get('.hotgraphic__pin-item').should('have.length', _items.length);
    // Check each pin works correctly
    _items.forEach((item, index) => {
      cy.get(`.hotgraphic__pin-item .item-${index}.is-visited`).should('not.exist');
      cy.get('.notify__popup.hotgraphic').should('not.exist');
      cy.get(`.hotgraphic__pin-item .item-${index}`).click();
      cy.get('.notify__popup.hotgraphic').should('be.visible');
      cy.testContainsOrNotExists('.hotgraphic-popup__item-title-inner', stripHtml(item.title));
      cy.testContainsOrNotExists('.hotgraphic-popup__item-body-inner', stripHtml(item.body));
      cy.get('button.hotgraphic-popup__close').click();
      cy.get(`.hotgraphic__pin-item .item-${index}.is-visited`).should('exist');
    });

    // Check pin popup navigation works as expected
    cy.get('.hotgraphic__pin-item .item-0').click();
    _items.forEach(item => {
      cy.testContainsOrNotExists('.hotgraphic-popup__item-title-inner', stripHtml(item.title));
      cy.testContainsOrNotExists('.hotgraphic-popup__item-body-inner', stripHtml(item.body));
      cy.get('.hotgraphic-popup__controls.next').click();
    });

    if (!_canCycleThroughPagination) {
      cy.get('.hotgraphic-popup__controls.next.is-disabled').should('exist');
    } else {
      cy.get('.hotgraphic-popup__controls.next')
        .should('exist')
        .and('not.have.class', 'is-disabled')
    }

    _items.forEach(item => {
      cy.testContainsOrNotExists('.hotgraphic-popup__item-title-inner', stripHtml(item.title));
      cy.testContainsOrNotExists('.hotgraphic-popup__item-body-inner', stripHtml(item.body));
      cy.get('.hotgraphic-popup__controls.back').click();
    });

    if (!_canCycleThroughPagination) {
      cy.get('.hotgraphic-popup__controls.back.is-disabled').should('exist');
    } else {
      cy.get('.hotgraphic-popup__controls.back')
        .should('exist')
        .and('not.have.class', 'is-disabled')
    }
  };

  beforeEach(function () {
    cy.getData();
  });

  it('should display the hot graphic component', function () {
    const hotGraphicComponents = this.data.components.filter(component => component._component === 'hotgraphic');
    hotGraphicComponents.forEach(hotGraphicComponent => {
      cy.visit(`/#/preview/${hotGraphicComponent._id}`);

      cy.testContainsOrNotExists('.hotgraphic__body', stripHtml(hotGraphicComponent.body));
      cy.testContainsOrNotExists('.hotgraphic__title', stripHtml(hotGraphicComponent.displayTitle));
      cy.testContainsOrNotExists('.hotgraphic__instruction', stripHtml(hotGraphicComponent.instruction));

      if (hotGraphicComponent._graphic.src) {
        cy.get('.hotgraphic__image').should('have.attr', 'src', hotGraphicComponent._graphic.src);
      };

      // Test hot graphic items
      loopThroughHotGraphic(hotGraphicComponent);

      // Allow the component to load and run external custom tests
      cy.wait(1000);
    });
  });
});
