import ItemsComponentModel from 'core/js/models/itemsComponentModel';
import tooltips from 'core/js/tooltips';

export default class HotgraphicModel extends ItemsComponentModel {

  defaults() {
    return ItemsComponentModel.resultExtend('defaults', {
      _canCycleThroughPagination: false
    });
  }

  setUpItems() {
    super.setUpItems();
    const id = this.get('_id');
    const hasStaticTooltips = this.get('_hasStaticTooltips') ?? false;
    this.getChildren().forEach((child, index) => {

      // Set _pin for the item if undefined
      if (!child.get('_pin')) child.set('_pin', false);

      const tooltip = child.get('_tooltip');
      if (!tooltip?._isEnabled) return;
      tooltip._id = `hotgraphic-pin-${id}-${index}`;
      const tooltipConfig = {
        _isStatic: hasStaticTooltips,
        ...child.toJSON(),
        _classes: [ 'hotgraphic__pin-tooltip' ],
        ...tooltip
      };
      tooltipConfig._position = tooltipConfig._position || 'outside bottom middle middle';
      const tooltipModel = tooltips.register(tooltipConfig);
      child.on('change', () => {
        tooltipModel.set({
          ...child.toJSON(),
          _classes: [ 'hotgraphic__pin-tooltip' ],
          ...tooltip
        });
      });

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
