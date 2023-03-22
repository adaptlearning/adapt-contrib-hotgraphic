import ItemsComponentModel from 'core/js/models/itemsComponentModel';

export default class HotgraphicModel extends ItemsComponentModel {

  defaults() {
    return ItemsComponentModel.resultExtend('defaults', {
      _canCycleThroughPagination: false
    });
  }

  setUpItems() {
    super.setUpItems();

    this.getChildren().forEach((child) => {
      // Set _pin for the item if undefined
      if (!child.get('_pin')) child.set('_pin', false);
    });
  }

  prepareNarrativeModel() {
    this.set({
      _component: 'narrative',
      _wasHotgraphic: true,
      originalBody: this.get('body'),
      originalInstruction: this.get('instruction')
    });

    // Check if active item exists, default to 0
    const activeItem = this.getActiveItem();
    if (!activeItem) {
      this.getItem(0).toggleActive(true);
    }

    // Swap mobile body and instructions for desktop variants.
    if (this.get('mobileBody')) {
      this.set('body', this.get('mobileBody'));
    }
    if (this.get('mobileInstruction') && this.get('_isNarrativeOnMobile') && !this.get('_isMobileTextBelowImage')) {
      this.set('instruction', this.get('mobileInstruction'));
    }

    return this;
  }

}
