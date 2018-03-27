define([
    'core/js/adapt'
], function(Adapt) {
    'use strict';

    var HotgraphicPopupView = Backbone.View.extend({

        className: 'hotgraphic-popup',

        events: {
            'click .hotgraphic-popup-done': 'closePopup',
            'click .hotgraphic-popup-nav .back': 'onBackClick',
            'click .hotgraphic-popup-nav .next': 'onNextClick'
        },

        initialize: function() {
            this.listenToOnce(Adapt, "notify:opened", this.onOpened);
            this.render();
        },

        onOpened: function() {
            var currentIndex = this.model.getActiveItem().get('_index');

            this.$('.hotgraphic-popup-inner').a11y_on(false);
            this.$('.hotgraphic-item').hide();
            this.$('.hotgraphic-item').eq(currentIndex).show().addClass('active');

            this.applyNavigationClasses(currentIndex);

            this.$('.hotgraphic-popup').addClass('hotgraphic-popup item-' + currentIndex).show();
            this.handleFocus(false);
            this.updatePageCount();
        },

        render: function() {
            var data = this.model.toJSON();
            data.view = this;
            var template = Handlebars.templates['hotgraphicPopup'];
            this.$el.html(template(data));
        },

        remove: function() {
            this.trigger('popup:closed');
            Backbone.View.prototype.remove.apply(this, arguments);
        },

        closePopup: function(event) {
            Adapt.trigger('notify:close');
        },

        onBackClick: function(event) {
            if (event) event.preventDefault();
            this.previousHotGraphic();
        },

        onNextClick: function(event) {
            if (event) event.preventDefault();
            this.nextHotGraphic();
        },

        previousHotGraphic: function () {
            var currentIndex = this.model.getActiveItem().get('_index');
            var canCycleThroughPagination = this.model.get('_canCycleThroughPagination');
            var itemLength = this.model.get('_items').length;

            if (currentIndex === 0 && !canCycleThroughPagination) {
                return;
            } else if (currentIndex === 0 && canCycleThroughPagination) {
                currentIndex = itemLength;
            }

            this.applyItemClasses(currentIndex-1);
        },
        
        nextHotGraphic: function () {
            var currentIndex = this.model.getActiveItem().get('_index');
            var canCycleThroughPagination = this.model.get('_canCycleThroughPagination');
            var itemLength = this.model.get('_items').length;

            if (currentIndex === (itemLength-1) && !canCycleThroughPagination) {
                return;
            } else if (currentIndex === (itemLength-1) && canCycleThroughPagination) {
                currentIndex = -1;
            }

            this.applyItemClasses(currentIndex+1);
        },

        applyItemClasses: function(index) {
            this.setItemState(index);

            this.$('.hotgraphic-item.active').hide().removeClass('active');
            this.$('.hotgraphic-item').eq(index).show().addClass('active');
            this.$('.hotgraphic-popup-inner').a11y_on(false);

            this.applyNavigationClasses(index);
            this.handleFocus(true);
            this.updatePageCount();
        },

        setItemState: function(index) {
            this.model.getActiveItem().set('_isActive', false);
            var nextItem = this.model.getItem(index);
            nextItem.set({
                '_isActive': true,
                '_isVisited': true
            });
        },

        updatePageCount: function() {
            var template = Adapt.course.get("_globals")._components._hotgraphic.popupPagination;
            var labelText = Handlebars.compile(template)({
                itemNumber: this.model.getActiveItem().get('_index')+1,
                totalItems: this.model.get("_items").length
            });
            this.$('.hotgraphic-popup-count').html(labelText);
        },

        handleFocus: function(setFocus) {
            this.$('.hotgraphic-popup-inner .active').a11y_on(true);
            if (setFocus) {
                this.$('.hotgraphic-popup-inner .active').a11y_focus();
            }
        },

        applyNavigationClasses: function (index) {
            var $nav = this.$('.hotgraphic-popup-nav');
            var itemCount = this.model.get('_items').length;
            var canCycleThroughPagination = this.model.get('_canCycleThroughPagination');

            $nav.removeClass('first').removeClass('last');
            this.$('.hotgraphic-popup-done').a11y_cntrl_enabled(true);

            if (index <= 0 && !canCycleThroughPagination) {
                this.$('.hotgraphic-popup-nav').addClass('first');
                this.$('.hotgraphic-popup-controls.back').a11y_cntrl_enabled(false);
                this.$('.hotgraphic-popup-controls.next').a11y_cntrl_enabled(true);
            } else if (index >= itemCount-1 && !canCycleThroughPagination) {
                this.$('.hotgraphic-popup-nav').addClass('last');
                this.$('.hotgraphic-popup-controls.back').a11y_cntrl_enabled(true);
                this.$('.hotgraphic-popup-controls.next').a11y_cntrl_enabled(false);
            } else {
                this.$('.hotgraphic-popup-controls.back').a11y_cntrl_enabled(true);
                this.$('.hotgraphic-popup-controls.next').a11y_cntrl_enabled(true);
            }

            var item = this.model.getItem(index);
            var classString = 'hotgraphic-popup ' + 'item-' + index + ' ' + item.get('_classes');
            this.$('.hotgraphic-popup').attr('class', classString);
        },

    });

    return HotgraphicPopupView;

});