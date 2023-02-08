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
    this.setUpModelData();
    this.setUpEventListeners();
  }

  setUpViewData() {
    this.popupView = null;
    this._isPopupOpen = false;
  }

  setUpModelData() {
    if (this.model.get('_canCycleThroughPagination') !== undefined) return;

    this.model.set('_canCycleThroughPagination', false);
  }

  setUpEventListeners() {
    this.listenTo(Adapt, 'device:changed', this.reRender);
  }

  reRender() {
    if (device.screenSize === 'large' || this.model.get('_isNarrativeOnMobile') === false) return;

    this.replaceWithNarrative();
  }

  replaceWithNarrative() {
    const NarrativeView = components.getViewClass('narrative');
    if (!NarrativeView) return;

    const model = this.prepareNarrativeModel();
    const newNarrative = new NarrativeView({ model });
    // NOTE: if this component is doing its inital render in 'narrative mode',
    // this.$el.parents() won't exist at this point - which is why the following is
    // written the way it is, instead of (what would appear to be) the more efficient
    // this.$el.parents('.component__container')
    const $container = data.findViewByModelId(model.get('_parentId')).$el.find('.component__container');
    $container.append(newNarrative.$el);

    this.remove();
    _.defer(() => {
      Adapt.trigger('device:resize');
    });
  }

  prepareNarrativeModel() {
    this.model.set({
      _component: 'narrative',
      _wasHotgraphic: true,
      originalBody: this.model.get('body'),
      originalInstruction: this.model.get('instruction')
    });

    // Check if active item exists, default to 0
    const activeItem = this.model.getActiveItem();
    if (!activeItem) {
      this.model.getItem(0).toggleActive(true);
    }

    // Swap mobile body and instructions for desktop variants.
    if (this.model.get('mobileBody')) {
      this.model.set('body', this.model.get('mobileBody'));
    }
    if (this.model.get('mobileInstruction')) {
      this.model.set('instruction', this.model.get('mobileInstruction'));
    }

    return this.model;
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
    e.preventDefault();

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
