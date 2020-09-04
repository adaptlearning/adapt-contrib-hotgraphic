define([
    'core/js/adapt',
    'core/js/views/componentView',
    './hotgraphicPopupView'
  ], function(Adapt, ComponentView, HotgraphicPopupView) {
    'use strict';
  
    class HotGraphicView extends ComponentView {
  
      events() {
        return {
            'click .js-hotgraphic-item-click': 'onPinClicked'
        }
      }
  
      initialize() {
        ComponentView.prototype.initialize.call(this);
        this.setUpViewData();
        this.setUpModelData();
        this.setUpEventListeners();
        this.checkIfResetOnRevisit();
      }
  
      setUpViewData() {
        this.popupView = null;
        this._isPopupOpen = false;
      }
  
      setUpModelData() {
        if (this.model.get('_canCycleThroughPagination') === undefined) {
          this.model.set('_canCycleThroughPagination', false);
        }
      }
  
      setUpEventListeners() {
        this.listenTo(Adapt, 'device:changed', this.reRender);
  
        this.listenTo(this.model.get('_children'), {
          'change:_isActive': this.onItemsActiveChange,
          'change:_isVisited': this.onItemsVisitedChange
        });
      }
  
      reRender() {
        if (Adapt.device.screenSize !== 'large') {
          this.replaceWithNarrative();
        }
      }
  
      replaceWithNarrative() {
        var NarrativeView = Adapt.getViewClass('narrative');
  
        var model = this.prepareNarrativeModel();
        var newNarrative = new NarrativeView({ model: model });
        var $container = $(".component__container", $("." + this.model.get("_parentId")));
  
        newNarrative.reRender();
        newNarrative.setupNarrative();
        $container.append(newNarrative.$el);
        Adapt.trigger('device:resize');
        _.defer(this.remove.bind(this));
      }
  
      prepareNarrativeModel() {
        var model = this.model;
        model.set({
          '_component': 'narrative',
          '_wasHotgraphic': true,
          'originalBody': model.get('body'),
          'originalInstruction': model.get('instruction')
        });
  
        // Check if active item exists, default to 0
        var activeItem = model.getActiveItem();
        if (!activeItem) {
          model.getItem(0).toggleActive(true);
        }
  
        // Swap mobile body and instructions for desktop variants.
        if (model.get('mobileBody')) {
          model.set('body', model.get('mobileBody'));
        }
        if (model.get('mobileInstruction')) {
          model.set('instruction', model.get('mobileInstruction'));
        }
  
        return model;
      }
  
      onItemsActiveChange(model, _isActive) {
        this.getItemElement(model).toggleClass('is-active', _isActive);
      }
  
      getItemElement(model) {
        var index = model.get('_index');
        return this.$('.js-hotgraphic-item-click').filter('[data-index="' + index + '"]');
      }
  
      onItemsVisitedChange(model, _isVisited) {
        if (!_isVisited) return;
        var $pin = this.getItemElement(model);
  
        // Append the word 'visited.' to the pin's aria-label
        var visitedLabel = this.model.get('_globals')._accessibility._ariaLabels.visited + ".";
        $pin.find('.aria-label').each(function(index, el) {
          el.innerHTML += " " + visitedLabel;
        });
  
        $pin.addClass('is-visited');
      }
  
      checkIfResetOnRevisit() {
        var isResetOnRevisit = this.model.get('_isResetOnRevisit');
  
        // If reset is enabled set defaults
        if (isResetOnRevisit) {
          this.model.reset(isResetOnRevisit);
        }
      }
  
      preRender() {
        if (Adapt.device.screenSize === 'large') {
          this.render();
        } else {
          this.reRender();
        }
      }
  
      postRender() {
        this.$('.hotgraphic__widget').imageready(this.setReadyStatus.bind(this));
        if (this.model.get('_setCompletionOn') === 'inview') {
          this.setupInviewCompletion('.component__widget');
        }
      }
  
      onPinClicked(event) {
        if (event) event.preventDefault();
  
        var item = this.model.getItem($(event.currentTarget).data('index'));
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
  
        Adapt.trigger("notify:popup", {
          _view: this.popupView,
          _isCancellable: true,
          _showCloseButton: false,
          _classes: 'hotgraphic ' + this.model.get('_classes')
        });
  
        this.listenToOnce(Adapt, {
          'popup:closed': this.onPopupClosed
        });
      }
  
      onPopupClosed() {
        this.model.getActiveItem().toggleActive();
        this._isPopupOpen = false;
      }
  
    };
  
    return HotGraphicView;
  
  });
