import Adapt from 'core/js/adapt';
import components from 'core/js/components';
import data from 'core/js/data';
import device from 'core/js/device';
import notify from 'core/js/notify';
import ComponentView from 'core/js/views/componentView';
import HotgraphicPopupView from './hotgraphicPopupView';

class HotGraphicView extends ComponentView {

  initialize(...args) {
    super.initialize(...args);

    this.onPinClicked = this.onPinClicked.bind(this);

    this.setUpViewData();
    this.setUpEventListeners();
  }

  setUpViewData() {
    this.popupView = null;
    this._isPopupOpen = false;
  }

  setUpEventListeners() {
    this.listenTo(Adapt, 'device:changed', this.reRender);
  }

  reRender() {
    if (device.isScreenSizeMin('medium') || this.model.get('_isNarrativeOnMobile') === false) return;

    _.defer(() => {
      this.replaceWithNarrative();
    });
  }

  replaceWithNarrative() {
    const NarrativeView = components.getViewClass('narrative');
    if (!NarrativeView) return;

    const model = this.model.prepareNarrativeModel();
    const newNarrative = new NarrativeView({ model });

    const parentView = data.findViewByModelId(model.get('_parentId'));
    const $container = parentView.$el.find('.component__container');
    $container.append(newNarrative.$el);

    const parentChildViews = parentView.getChildViews();
    const currentIndex = parentChildViews?.findIndex(view => view === this) ?? 0;
    parentChildViews[currentIndex] = newNarrative;
    parentView.setChildViews(parentChildViews);

    this.remove();
    _.defer(() => {
      Adapt.trigger('device:resize');
    });
  }

  onItemsActiveChange(model, _isActive) {
    this.getItemElement(model).toggleClass('is-active', _isActive);
  }

  getItemElement(model) {
    const index = model.get('_index');
    return this.$('.js-hotgraphic-item-click').filter(`[data-index="${index}"]`);
  }

  onItemsVisitedChange(model, _isVisited) {
    if (!_isVisited) return;

    const $pin = this.getItemElement(model);
    // Append the word 'visited.' to the pin's aria-label
    const visitedLabel = ` ${this.model.get('_globals')._accessibility._ariaLabels.visited}. `;
    $pin.find('.aria-label').each((index, el) => {
      el.innerHTML = visitedLabel + el.innerHTML;
    });
  }

  preRender() {
    this.reRender();
  }

  postRender() {
    this.$('.hotgraphic__widget').imageready(this.setReadyStatus.bind(this));

    if (this.model.get('_setCompletionOn') !== 'inview') return;

    this.setupInviewCompletion('.hotgraphic__widget');
  }

  onPinClicked (e) {
    const item = this.model.getItem($(e.currentTarget).data('index'));

    item.toggleActive(true);
    item.toggleVisited(true);
    this.openPopup();
  }

  openPopup() {
    if (this._isPopupOpen) return;

    this._isPopupOpen = true;

    this.popupView = new HotgraphicPopupView({
      model: this.model
    });

    notify.popup({
      _attributes: { 'data-adapt-id': this.model.get('_id') },
      _view: this.popupView,
      _isCancellable: true,
      _showCloseButton: false,
      _classes: 'hotgraphic is-component is-hotgraphic ' + this.model.get('_classes')
    });

    this.listenToOnce(Adapt, {
      'popup:closed': this.onPopupClosed
    });
  }

  onPopupClosed() {
    this.model.getActiveItem().toggleActive();
    this._isPopupOpen = false;
  }

}

HotGraphicView.template = 'hotgraphic.jsx';

export default HotGraphicView;
