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

}
