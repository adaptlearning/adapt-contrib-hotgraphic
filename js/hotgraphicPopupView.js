import Adapt from 'core/js/adapt';
import a11y from 'core/js/a11y';

class HotgraphicPopupView extends Backbone.View {

  className() {
    return 'hotgraphic-popup';
  }

  events() {
    return {
      'click .js-hotgraphic-popup-close': 'closePopup',
      'click .js-hotgraphic-controls-click': 'onControlClick'
    };
  }

  initialize(...args) {
    super.initialize(...args);
    // Debounce required as a second (bad) click event is dispatched on iOS causing a jump of two items.
    this.onControlClick = _.debounce(this.onControlClick.bind(this), 100);
    this.listenToOnce(Adapt, 'notify:opened', this.onOpened);
    this.listenTo(this.model.getChildren(), {
      'change:_isActive': this.onItemsActiveChange,
      'change:_isVisited': this.onItemsVisitedChange
    });
    this.render();
  }

  onOpened() {
    const index = this.model.getActiveItem().get('_index');
    this.applyNavigationClasses(index);
    this.updatePageCount();
    this.handleTabs();
    this.evaluateNavigation(index);
  }

  applyNavigationClasses (index) {
    const itemCount = this.model.get('_items').length;
    const canCycleThroughPagination = this.model.get('_canCycleThroughPagination');

    const shouldEnableBack = index > 0 || canCycleThroughPagination;
    const shouldEnableNext = index < itemCount - 1 || canCycleThroughPagination;
    const $controls = this.$('.hotgraphic-popup__controls');

    this.$('hotgraphic-popup__nav')
      .toggleClass('first', !shouldEnableBack)
      .toggleClass('last', !shouldEnableNext);

    a11y.toggleEnabled($controls.filter('.back'), shouldEnableBack);
    a11y.toggleEnabled($controls.filter('.next'), shouldEnableNext);
  }

  updatePageCount() {
    const template = Adapt.course.get('_globals')._components._hotgraphic.popupPagination || '{{itemNumber}} / {{totalItems}}';
    const labelText = Handlebars.compile(template)({
      itemNumber: this.model.getActiveItem().get('_index') + 1,
      totalItems: this.model.get('_items').length
    });
    this.$('.hotgraphic-popup__count').html(labelText);
  }

  handleTabs() {
    a11y.toggleHidden(this.$('.hotgraphic-popup__item:not(.is-active)'), true);
    a11y.toggleHidden(this.$('.hotgraphic-popup__item.is-active'), false);
  }

  onItemsActiveChange(item, _isActive) {
    if (!_isActive) return;
    const index = item.get('_index');
    this.updatePageCount();
    this.applyItemClasses(index);
    this.handleTabs();
    this.handleFocus(index);
  }

  applyItemClasses(index) {
    this.$(`.hotgraphic-popup__item[data-index="${index}"]`).addClass('is-active').removeAttr('aria-hidden');
    this.$(`.hotgraphic-popup__item[data-index="${index}"] .hotgraphic-popup__item-title`).attr('id', 'notify-heading');
    this.$(`.hotgraphic-popup__item:not([data-index="${index}"])`).removeClass('is-active').attr('aria-hidden', 'true');
    this.$(`.hotgraphic-popup__item:not([data-index="${index}"]) .hotgraphic-popup__item-title`).removeAttr('id');
  }

  handleFocus(index) {
    a11y.focusFirst(this.$('.hotgraphic-popup__inner .is-active'));
    this.applyNavigationClasses(index);
  }

  onItemsVisitedChange(item, _isVisited) {
    if (!_isVisited) return;

    this.$('.hotgraphic-popup__item')
      .filter(`[data-index="${item.get('_index')}"]`)
      .addClass('is-visited');
  }

  render() {
    const data = this.model.toJSON();
    data.view = this;
    const template = Handlebars.templates[this.constructor.template];
    this.$el.html(template(data));
  }

  closePopup() {
    Adapt.trigger('notify:close');
  }

  onControlClick(event) {
    const direction = $(event.currentTarget).data('direction');
    const index = this.getNextIndex(direction);
    if (index === -1) return;

    this.setItemState(index);
  }

  getNextIndex(direction) {
    let index = this.model.getActiveItem().get('_index');
    const lastIndex = this.model.get('_items').length - 1;

    switch (direction) {
      case 'back':
        if (index > 0) return --index;
        if (this.model.get('_canCycleThroughPagination')) return lastIndex;
        break;
      case 'next':
        if (index < lastIndex) return ++index;
        if (this.model.get('_canCycleThroughPagination')) return 0;
    }
    return -1;
  }

  setItemState(index) {
    this.model.getActiveItem().toggleActive();

    const nextItem = this.model.getItem(index);
    this.evaluateNavigation(index);
    nextItem.toggleActive();
    nextItem.toggleVisited(true);
  }

  evaluateNavigation(index) {
    const active = index || 0;
    const itemCount = this.model.getChildren().length;

    const isAtStart = active === 0;
    const isAtEnd = active === itemCount - 1;

    const $left = this.$('.hotgraphic-popup__controls.back');
    const $right = this.$('.hotgraphic-popup__controls.next');

    const globals = Adapt.course.get('_globals');

    const ariaLabelsGlobals = globals._accessibility._ariaLabels;
    const hotGraphicGlobals = globals._components._hotgraphic;

    const ariaLabelPrevious = hotGraphicGlobals.previous || ariaLabelsGlobals.previous;
    const ariaLabelNext = hotGraphicGlobals.next || ariaLabelsGlobals.next;

    const prevTitle = isAtStart ? '' : this.model.getItem(active - 1).get('title');
    const nextTitle = isAtEnd ? '' : this.model.getItem(active + 1).get('title');

    $left.attr('aria-label', Handlebars.helpers.compile_a11y_normalize(ariaLabelPrevious, {
      title: prevTitle,
      _globals: globals,
      itemNumber: isAtStart ? null : active,
      totalItems: itemCount
    }));
    $right.attr('aria-label', Handlebars.helpers.compile_a11y_normalize(ariaLabelNext, {
      title: nextTitle,
      _globals: globals,
      itemNumber: isAtEnd ? null : active + 2,
      totalItems: itemCount
    }));

  };

};

HotgraphicPopupView.template = 'hotgraphicPopup';

export default HotgraphicPopupView;
