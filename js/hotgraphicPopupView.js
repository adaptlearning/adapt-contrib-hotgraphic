define([
  'core/js/adapt'
], function(Adapt) {
  'use strict';

  var HotgraphicPopupView = Backbone.View.extend({

    className: 'hotgraphic-popup',

    events: {
      'click .js-hotgraphic-popup-close': 'closePopup',
      'click .js-hotgraphic-controls-click': 'onControlClick'
    },

    initialize: function() {
      this.listenToOnce(Adapt, "notify:opened", this.onOpened);
      this.listenTo(this.model.get('_children'), {
        'change:_isActive': this.onItemsActiveChange,
        'change:_isVisited': this.onItemsVisitedChange
      });
      this.render();
    },

    onOpened: function() {
      this.applyNavigationClasses(this.model.getActiveItem().get('_index'));
      this.updatePageCount();
      this.handleTabs();
    },

    applyNavigationClasses: function (index) {
      var itemCount = this.model.get('_items').length;
      var canCycleThroughPagination = this.model.get('_canCycleThroughPagination');

      var shouldEnableBack = index > 0 || canCycleThroughPagination;
      var shouldEnableNext = index < itemCount - 1 || canCycleThroughPagination;
      var $controls = this.$('.hotgraphic-popup__controls');

      this.$('hotgraphic-popup__nav')
          .toggleClass('first', !shouldEnableBack)
          .toggleClass('last', !shouldEnableNext);

      $controls.filter('.back').a11y_cntrl_enabled(shouldEnableBack);
      $controls.filter('.next').a11y_cntrl_enabled(shouldEnableNext);
    },

    updatePageCount: function() {
      var template = Adapt.course.get("_globals")._components._hotgraphic.popupPagination;
      var labelText = Handlebars.compile(template)({
        itemNumber: this.model.getActiveItem().get('_index') + 1,
        totalItems: this.model.get("_items").length
      });
      this.$('.hotgraphic-popup__count').html(labelText);
    },

    handleTabs: function() {
      this.$('.hotgraphic-popup__inner').a11y_on(false);
      this.$('.hotgraphic-popup__inner .is-active').a11y_on(true);
    },

    onItemsActiveChange: function(item, _isActive) {
      if (!_isActive) return;

      var index = item.get('_index');
      this.updatePageCount();
      this.handleTabs();
      this.applyItemClasses(index);
      this.handleFocus(index);
    },

    applyItemClasses: function(index) {
      this.$('.hotgraphic-popup__item.is-active').removeClass('is-active');
      this.$('.hotgraphic-popup__item').filter('[data-index="' + index + '"]').addClass('is-active');
    },

    handleFocus: function(index) {
      this.$('.hotgraphic-popup__inner .is-active').a11y_focus();
      this.applyNavigationClasses(index);
    },

    onItemsVisitedChange: function(item, _isVisited) {
      if (!_isVisited) return;

      this.$('.hotgraphic-popup__item')
          .filter('[data-index="' + item.get('_index') + '"]')
          .addClass('is-visited');
    },

    render: function() {
      var data = this.model.toJSON();
      data.view = this;
      var template = Handlebars.templates['hotgraphicPopup'];
      this.$el.html(template(data));
    },

    closePopup: function(event) {
      Adapt.trigger('notify:close');
    },

    onControlClick: function(event) {
      event.preventDefault();

      var direction = $(event.currentTarget).hasClass('back') ? 'back' : 'next';
      var index = this.getNextIndex(direction);

      if (index !== -1) {
        this.setItemState(index);
      }
    },

    getNextIndex: function(direction) {
      var index = this.model.getActiveItem().get('_index');
      var lastIndex = this.model.get('_items').length - 1;

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
    },

    setItemState: function(index) {
      this.model.getActiveItem().toggleActive();

      var nextItem = this.model.getItem(index);
      nextItem.toggleActive();
      nextItem.toggleVisited(true);
    }

  });

  return HotgraphicPopupView;

});
