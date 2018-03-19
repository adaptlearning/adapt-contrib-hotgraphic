define([
    'core/js/adapt'
], function(Adapt) {
    'use strict';

    var HotgraphicPopupView = Backbone.View.extend({

        className: 'hotgraphic-popup',

        attributes: function() {
            return {
                'role': 'dialog',
                'aria-label': Adapt.course.get('_globals')._components._hotgraphic.ariaPopupLabel
            };
        },

        events: {
            'click .hotgraphic-popup-done': 'closePopup',
            'click .hotgraphic-popup-nav .back': 'onBackClick',
            'click .hotgraphic-popup-nav .next': 'onNextClick'
        },

        initialize: function() {
            _.bindAll(this, 'onKeyUp');
            this.listenToOnce(Adapt, "notify:opened", this.onOpened);
            this.render();
        },

        onOpened: function(notifyView) {
            this.$currentLabel = this.$('.hotgraphic-popup-count .current');
            this.setupEscapeKey();
            this.trigger('popup:open');

            var currentIndex = this.model.getActiveItem().get('_index');

            this.$('.hotgraphic-popup-inner').a11y_on(false);
            this.$('.hotgraphic-item').hide().removeClass('active');

            this.$('.hotgraphic-item.active').hide().removeClass('active');
            this.$('.hotgraphic-item').eq(currentIndex).show().addClass('active');

            this.$currentLabel.html(currentIndex + 1);
            
            this.applyNavigationClasses(currentIndex);

            this.$('.hotgraphic-popup').addClass('hotgraphic-popup item-' + currentIndex).show();
            this.handleFocus(false);
        },
        
        render: function() {
            var data = this.model.toJSON();
            var template = Handlebars.templates['hotgraphicPopup'];
            this.$el.html(template(data));
        },
        
        remove: function() {
            this.trigger('popup:closed');
            this.removeEscapeKey();
            Backbone.View.prototype.remove.apply(this, arguments);
        },
        
        closePopup: function(event) {
            Adapt.trigger('notify:close');
        },

        onBackClick: function(event) {
            event && event.preventDefault();
            this.trigger('popup:previous'); // allow parentView to hook into this action
            this.previousHotGraphic();
        },

        onNextClick: function(event) {
            event && event.preventDefault();
            this.trigger('popup:next'); // allow parentView to hook into this action
            this.nextHotGraphic();
        },

        setupEscapeKey: function() {
            var hasAccessibility = Adapt.config.has('_accessibility') && Adapt.config.get('_accessibility')._isActive;

            if (!hasAccessibility) {
                $(window).on("keyup", this.onKeyUp);
            }
        },

        removeEscapeKey: function() {
            $(window).off("keyup", this.onKeyUp);
        },

        onKeyUp: function(event) {
            if (event.which != 27) return;
            event.preventDefault();
            this.closePopup();
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

            this.setItemState(currentIndex-1);

            this.$('.hotgraphic-item.active').hide().removeClass('active');
            this.$('.hotgraphic-item').eq(currentIndex-1).show().addClass('active');
            this.$currentLabel.html(currentIndex);
            this.$('.hotgraphic-popup-inner').a11y_on(false);

            this.applyNavigationClasses(currentIndex-1);
            this.handleFocus(true);
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

            this.setItemState(currentIndex+1);

            this.$('.hotgraphic-item.active').hide().removeClass('active');
            this.$('.hotgraphic-item').eq(currentIndex+1).show().addClass('active');
            this.$currentLabel.html(currentIndex+2);
            this.$('.hotgraphic-popup-inner').a11y_on(false);

            this.applyNavigationClasses(currentIndex+1);
            this.handleFocus(true);
        },

        setItemState: function(index) {
            this.model.getActiveItem().set('_isActive', false);
            var nextItem = this.model.getItem(index);
            nextItem.set({
                '_isActive': true,
                '_isVisited': true
            });
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