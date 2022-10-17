import ItemsComponentModel from 'core/js/models/itemsComponentModel';
import tooltips from 'core/js/tooltips';

export default class HotgraphicModel extends ItemsComponentModel {

  setUpItems() {
    super.setUpItems();
    const id = this.get('_id');
    this.getChildren().forEach((child, index) => {
      const tooltip = child.get('_tooltip');
      if (!tooltip?._isEnabled) return;
      tooltip._id = `hotgraphic-pin-${id}-${index}`;
      tooltips.register({
        _classes: [ 'hotgraphic__pin-tooltip' ],
        ...tooltip
      });
    });
  }

}
