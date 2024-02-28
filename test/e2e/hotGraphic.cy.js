describe('Hot Graphic', function () {
  function loopThroughHotGraphic(hotGraphicComponent) {
    const itemsCount = Object.keys(hotGraphicComponent._items).length
    cy.get('.hotgraphic__pin-item').should('have.length', itemsCount)
    for (let i = 0; i < itemsCount; i++) {
      cy.get(`.hotgraphic__pin-item .item-${i}.is-visited`).should('not.exist')
      cy.get('.notify__popup.hotgraphic').should('not.exist')
      cy.get(`.hotgraphic__pin-item .item-${i}`).click()
      cy.get('.notify__popup.hotgraphic').should('be.visible')
      cy.testContainsOrNotExists('.hotgraphic-popup__item-title-inner', hotGraphicComponent._items[i].title)
      cy.testContainsOrNotExists('.hotgraphic-popup__item-body-inner', hotGraphicComponent._items[i].body)
      cy.get('button.hotgraphic-popup__close').click()
      cy.get(`.hotgraphic__pin-item .item-${i}.is-visited`).should('exist')
    }

    cy.get('.hotgraphic__pin-item .item-0').click()

    for (let i = 0; i < itemsCount-1; i++) {
      cy.testContainsOrNotExists('.hotgraphic-popup__item-title-inner', hotGraphicComponent._items[i].title)
      cy.testContainsOrNotExists('.hotgraphic-popup__item-body-inner', hotGraphicComponent._items[i].body)
      cy.get('.hotgraphic-popup__controls.next').click()
    }
    cy.get('.hotgraphic-popup__controls.next.is-disabled').should('exist')
    for (let i = itemsCount-1; i >= 0; i--) {
      cy.testContainsOrNotExists('.hotgraphic-popup__item-title-inner', hotGraphicComponent._items[i].title)
      cy.testContainsOrNotExists('.hotgraphic-popup__item-body-inner', hotGraphicComponent._items[i].body)
      cy.get('.hotgraphic-popup__controls.back').click()
    }
    cy.get('.hotgraphic-popup__controls.back.is-disabled').should('exist')
  }

  beforeEach(function () {
    cy.getData()
  });

  it('should display the hot graphic component', function () {
    const hotGraphicComponents = this.data.components.filter((component) => component._component === 'hotgraphic')
    hotGraphicComponents.forEach((hotGraphicComponent) => {
      cy.visit(`/#/preview/${hotGraphicComponent._id}`);
      const bodyWithoutHtml = hotGraphicComponent.body.replace(/<[^>]*>/g, '')

      cy.testContainsOrNotExists('.hotgraphic__title', hotGraphicComponent.displayTitle)
      cy.testContainsOrNotExists('.hotgraphic__body', bodyWithoutHtml)
      cy.testContainsOrNotExists('.hotgraphic__instruction', hotGraphicComponent.instruction)
      if (hotGraphicComponent._graphic.src) {
        cy.get('.hotgraphic__image').should('have.attr', 'src', hotGraphicComponent._graphic.src)
      }

      loopThroughHotGraphic(hotGraphicComponent)

      cy.wait(1000)
    })
  });
});
