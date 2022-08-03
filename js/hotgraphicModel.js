import ItemsComponentModel from 'core/js/models/itemsComponentModel';
import tooltips from 'core/js/tooltips';

export default class HotgraphicModel extends ItemsComponentModel {

  setUpItems() {
    super.setUpItems();
    this.getChildren().forEach(child => {
      if (!child.get('_tooltip')) return;

      tooltips.register(child.get('_tooltip'));
    })
  }

}
