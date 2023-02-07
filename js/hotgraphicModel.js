import ItemsComponentModel from 'core/js/models/itemsComponentModel';

export default class HotgraphicModel extends ItemsComponentModel {

  setUpItems() {
    super.setUpItems();
    this.getChildren().forEach((child, index) => {
      // Set _pin for the item if undefined
      const pin = child.get('_pin');
      if (!pin) {
        child.set('_pin', false);
      }
    });
  }

}
