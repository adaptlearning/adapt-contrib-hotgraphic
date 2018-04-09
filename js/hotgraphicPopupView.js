define([
    'core/js/adapt'
], function(Adapt) {
    'use strict';

    var HotgraphicPopupView = Backbone.View.extend({

        className: 'hotgraphic-popup',

        events: {
            'click .hotgraphic-popup-done': 'closePopup',
            'click .hotgraphic-popup-controls': 'onControlClick'
        },

        initialize: function() {
            this.listenToOnce(Adapt, "notify:opened", this.onOpened);
            this.listenTo(this.model.get('_items'), {
                'change:_isActive': this.onItemsActiveChange,
                'change:_isVisited': this.onItemsVisitedChange
            });
            this.render();
        },

        onOpened: function() {
            var currentIndex = this.model.getActiveItem().get('_index');

            this.$('.hotgraphic-popup-inner').a11y_on(false);

            this.$('.hotgraphic-item').filter('[data-index="' + currentIndex + '"]').addClass('active');

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

        onItemsActiveChange: function(item) {
            if (item.get('_isActive')) this.applyItemClasses(item.get('_index'));
        },

        onItemsVisitedChange: function(item, _isVisited) {
            if (_isVisited) {
                var selector = 'item-'+item.get('_index');
                this.$('.hotgraphic-item').filter('[data-index="' + selector + '"]').addClass('visited');
            }
        },

        applyItemClasses: function(index) {
            this.$('.hotgraphic-item.active').removeClass('active');
            this.$('.hotgraphic-item').filter('[data-index="' + index + '"]').addClass('active');
            this.$('.hotgraphic-popup-inner').a11y_on(false);

            this.applyNavigationClasses(index);
            this.handleFocus(true);
            this.updatePageCount();
        },

        setItemState: function(index) {
            this.model.getActiveItem().toggleActive();

            var nextItem = this.model.getItem(index);
            nextItem.toggleActive();
            nextItem.toggleVisited(true);
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
            var itemCount = this.model.get('_items').length;
            var canCycleThroughPagination = this.model.get('_canCycleThroughPagination');

            var shouldEnableBack = index > 0 || canCycleThroughPagination;
            var shouldEnableNext = index < itemCount - 1 || canCycleThroughPagination;
            var $controls = this.$('.hotgraphic-popup-controls');

            this.$('hotgraphic-popup-nav')
                .toggleClass('first', !shouldEnableBack)
                .toggleClass('last', !shouldEnableNext);

            $controls.filter('.back').a11y_cntrl_enabled(shouldEnableBack);
            $controls.filter('.next').a11y_cntrl_enabled(shouldEnableNext);
        }

    });

    return HotgraphicPopupView;

});
