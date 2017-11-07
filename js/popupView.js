define([
    'core/js/adapt'
], function(Adapt) {

    const PopupView = Backbone.View.extend({

        currentIndex: 0,
        isOpen:false,

        events: {
            'click .back': 'previousHotGraphic',
            'click .next': 'nextHotGraphic'
        },

        initialize:function(options) {
            this.currentIndex = options.index || 0;
            this.isOpen = false;
            this.render();

            this.listenToOnce(Adapt, 'popup:opened', this.onPopupOpened);
            this.listenToOnce(Adapt, 'popup:closed', this.onPopupClosed);
        },

        render:function() {
            const template = Handlebars.templates['hotgraphicPopup'];
            const data = this.model.toJSON();

            this.setElement(template(data));

            this.updateNavigation();
        },

        open:function() {
            if (this.isOpen) return;

            this.isOpen = true;

            Adapt.trigger('notify:triggerCustomView', this);
        },

        addItemClasses:function() {
            const classes = this.model.get("_items")[this.currentIndex]._classes 
                ? this.model.get("_items")[this.currentIndex]._classes
                : '';  // _classes has not been defined
      
            this.$el.filter('.notify-popup').addClass('item-' + this.currentIndex + ' ' + classes);
        },

        removeItemClasses:function() {
            const classes = this.model.get("_items")[this.currentIndex]._classes 
                ? this.model.get("_items")[this.currentIndex]._classes
                : '';  // _classes has not been defined
      
            this.$el.filter('.notify-popup').removeClass('item-' + this.currentIndex + ' ' + classes);
        },

        updateNavigation: function (index) {
            const $nav = this.$('.hotgraphic-popup-nav'),
                itemCount = this.model.get('_items').length;

            $nav.removeClass('first').removeClass('last');

            if(index <= 0 && !this.model.get('_canCycleThroughPagination')) {
                this.$('.hotgraphic-popup-nav').addClass('first');
                this.$('.hotgraphic-popup-controls.back').a11y_cntrl_enabled(false);
                this.$('.hotgraphic-popup-controls.next').a11y_cntrl_enabled(true);
            } else if (index >= itemCount-1 && !this.model.get('_canCycleThroughPagination')) {
                this.$('.hotgraphic-popup-nav').addClass('last');
                this.$('.hotgraphic-popup-controls.back').a11y_cntrl_enabled(true);
                this.$('.hotgraphic-popup-controls.next').a11y_cntrl_enabled(false);
            } else {
                this.$('.hotgraphic-popup-controls.back').a11y_cntrl_enabled(true);
                this.$('.hotgraphic-popup-controls.next').a11y_cntrl_enabled(true);
            }
            
        },

        onPopupOpened:function() {
            this.$('.hotgraphic-item').hide().removeClass('active');
            this.$('.hotgraphic-item').eq(this.currentIndex).show().addClass('active');
            this.$('.hotgraphic-popup-count .current').html(this.currentIndex + 1);
            this.$('.hotgraphic-popup-count .total').html(this.$('.hotgraphic-item').length);
            this.$('.hotgraphic-popup').attr('class', 'hotgraphic-popup item-' + this.currentIndex);

            this.$('.hotgraphic-popup-inner .active').a11y_focus();

            this.addItemClasses();

            this.updateNavigation(this.currentIndex);

            this.trigger('hotGraphicPopup:opened');
        },

        onPopupClosed:function() {
            this.remove();
            this.trigger('hotGraphicPopup:closed');
        },

        previousHotGraphic:function(event) {
            let targetIndex;

            if (event) event.preventDefault();

            if (this.currentIndex === 0 && !this.model.get('_canCycleThroughPagination')) return;

            if (this.currentIndex === 0) {
                targetIndex = this.model.get('_items').length - 1;
            } else {
                targetIndex = this.currentIndex - 1;
            }

            this.openHotspot(targetIndex);
        },

        nextHotGraphic:function(event) {
            let targetIndex;

            if (event) event.preventDefault();

            if (this.currentIndex === this.model.get('_items').length - 1 && !this.model.get('_canCycleThroughPagination')) return;

            targetIndex = (this.currentIndex + 1) % this.model.get('_items').length;

            this.openHotspot(targetIndex);
        },

        openHotspot: function (index) {
            this.removeItemClasses();

            this.currentIndex = index;

            this.$('.hotgraphic-item.active').hide().removeClass('active');
            this.$('.hotgraphic-item').eq(this.currentIndex).show().addClass('active');
            this.trigger('hotGraphicPopup:visited', this.currentIndex);
            this.$('.hotgraphic-popup-count .current').html(this.currentIndex + 1);

            this.addItemClasses();
            this.updateNavigation(this.currentIndex);

            this.$('.hotgraphic-popup-inner .active').a11y_focus();
        }
    });

    return PopupView;
});