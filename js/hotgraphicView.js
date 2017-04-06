define([
    'core/js/adapt',
    'core/js/views/componentView'
], function(Adapt, ComponentView) {

    var HotGraphicView = ComponentView.extend({

        initialize: function() {
            this.listenTo(Adapt, 'remove', this.remove);
            this.listenTo(this.model, 'change:_isVisible', this.toggleVisibility);
            this.listenTo(Adapt, 'accessibility:toggle', this.onAccessibilityToggle);
            
            this.model.set('_globals', Adapt.course.get('_globals'));
            
            _.bindAll(this, 'onKeyUp');
            
            this.preRender();
            
            if (this.model.get('_canCycleThroughPagination') === undefined) {
                this.model.set('_canCycleThroughPagination', false);
            }
            if (Adapt.device.screenSize == 'large') {
                this.render();
            } else {
                this.reRender();
            }
        },

        events: {
            'click .hotgraphic-graphic-pin': 'onPinClicked',
            'click .hotgraphic-popup-done': 'onClosePopupClicked',
            'click .hotgraphic-popup-nav .back': 'previousHotGraphic',
            'click .hotgraphic-popup-nav .next': 'nextHotGraphic'
        },

        preRender: function() {
            this.listenTo(Adapt, 'device:changed', this.reRender, this);
            this.listenTo(this.model, 'change:_items:_isActive', this.onActiveItemChanged);
            this.listenTo(this.model, 'change:_isPopupOpen', this.onPopupOpenChanged);

            // Checks to see if the hotgraphic should be reset on revisit
            this.checkIfResetOnRevisit();
        },

        postRender: function() {
            this.renderState();
            this.$('.hotgraphic-widget').imageready(_.bind(function() {
                this.setReadyStatus();
            }, this));

            this.setupEventListeners();
        },

        // Used to check if the hotgraphic should reset on revisit
        checkIfResetOnRevisit: function() {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');
            // If reset is enabled set defaults
            if (isResetOnRevisit) this.model.reset(isResetOnRevisit);
        },

        reRender: function() {
            if (Adapt.device.screenSize != 'large') {
                this.replaceWithNarrative();
            }
        },

        inview: function(event, visible, visiblePartX, visiblePartY) {
            if (visible) {
                if (visiblePartY === 'top') {
                    this._isVisibleTop = true;
                } else if (visiblePartY === 'bottom') {
                    this._isVisibleBottom = true;
                } else {
                    this._isVisibleTop = true;
                    this._isVisibleBottom = true;
                }

                if (this._isVisibleTop && this._isVisibleBottom) {
                    this.$('.component-inner').off('inview');
                    this.model.setCompletionStatus();
                }
            }
        },

        replaceWithNarrative: function() {
            if (!Adapt.componentStore.narrative) throw "Narrative not included in build";

            var narrativeModel = Adapt.componentStore.narrative.model.prototype.prepareNarrativeModel.call(this.model);
            var narrativeView = new Adapt.componentStore.narrative.view({
                model: narrativeModel
            });

            var $container = $(".component-container", $("." + this.model.get("_parentId")));

            narrativeView.reRender();
            narrativeView.setupNarrative();
            $container.append(narrativeView.$el);
            Adapt.trigger('device:resize');
            _.defer(_.bind(function () {
                this.remove();
            }, this));
        },

        applyNavigationClasses: function (index) {
            var $nav = this.$('.hotgraphic-popup-nav');
            var itemCount = this.model.getItemCount();

            $nav.removeClass('first last');
            this.$('.hotgraphic-popup-done').a11y_cntrl_enabled(true);
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
            var classes = this.model.getItemAtIndex(index)._classes 
                ? this.model.getItemAtIndex(index)._classes
                : '';  // _classes has not been defined
      
            this.$('.hotgraphic-popup').attr('class', 'hotgraphic-popup ' + 'item-' + index + ' ' + classes);

        },

        onPinClicked: function (event) {
            if(event) event.preventDefault();            
            // var currentIndex = this.$('.hotgraphic-item.active').index();
            var currentIndex = parseInt($(event.currentTarget).data('id').split('item-')[1]);

            this.setVisited(currentIndex);
            this.model.setItemAtIndexAsActive(currentIndex, true);
            this.applyNavigationClasses(currentIndex);
        },
        
        onClosePopupClicked: function(event) {
            if(event) event.preventDefault();
            this.closePopup();
        },

        openPopup: function(currentIndex) {
            this.$('.hotgraphic-popup-inner').a11y_on(false);
            this.$('.hotgraphic-item').hide().removeClass('active');

            var $currentHotSpot = this.$('.item-' + currentIndex);
            $currentHotSpot.show().addClass('active');

            this.setVisited(currentIndex);
            this.setPopupCount(currentIndex+1);
            this.$('.hotgraphic-popup').attr('class', 'hotgraphic-popup item-' + currentIndex).show();
            this.$('.hotgraphic-popup-inner .active').a11y_on(true);
            this.model.set('_isPopupOpen', true);
            Adapt.trigger('popup:opened',  this.$('.hotgraphic-popup-inner'));
            this.$('.hotgraphic-popup-inner .active').a11y_focus();                
            this.setupEscapeKey();
        },

        closePopup: function() {
            this.model.set('_isPopupOpen', false);
            this.model.resetActiveItems(false);
            this.$('.hotgraphic-popup').hide();
            Adapt.trigger('popup:closed',  this.$('.hotgraphic-popup-inner'));
        },

        onActiveItemChanged: function(model, items, options) {
            var activeItem = this.model.getActiveItemsIndexes();
            
            if (activeItem.length <= 0) {
                this.closePopup();
            } else if (activeItem[0] < this.model.getItemCount()) {
                this.openPopup(activeItem[0]);
            }
        },

        previousHotGraphic: function (event) {
            event.preventDefault();
            var currentIndex = this.$('.hotgraphic-item.active').index();

            if (currentIndex === 0 && !this.model.get('_canCycleThroughPagination')) {
                return;
            } else if (currentIndex === 0 && this.model.get('_canCycleThroughPagination')) {
                currentIndex = this.model.getItemCount();
            }

            this.model.setItemAtIndexAsInactive(currentIndex, false);
            this.model.setItemAtIndexAsActive(currentIndex-1, true);
            this.setActiveClasses(currentIndex-1);
            this.setVisited(currentIndex-1);
            this.setPopupCount(currentIndex);
            this.$('.hotgraphic-popup-inner').a11y_on(false);

            this.applyNavigationClasses(currentIndex-1);
            this.setFocus();
        },

        nextHotGraphic: function (event) {
            event.preventDefault();
            var currentIndex = this.$('.hotgraphic-item.active').index();
            
            if (currentIndex === (this.model.getItemCount()-1) && !this.model.get('_canCycleThroughPagination')) {
                return;
            } else if (currentIndex === (this.model.getItemCount()-1) && this.model.get('_canCycleThroughPagination')) {
                currentIndex = -1;
            }
            
            this.model.setItemAtIndexAsInactive(currentIndex, false);
            this.model.setItemAtIndexAsActive(currentIndex+1, true);
            this.setActiveClasses(currentIndex+1);
            this.setVisited(currentIndex+1);
            this.setPopupCount(currentIndex+2);
            this.$('.hotgraphic-popup-inner').a11y_on(false);

            this.applyNavigationClasses(currentIndex+1);
            this.setFocus();
        },

        setPopupCount: function(count) {
            this.$('.hotgraphic-popup-count .current').html(count);
        },

        setVisited: function(index) {
            this.model.setItemAtIndexAsVisited(index);

            var $pin = this.$('.hotgraphic-graphic-pin').eq(index);
            $pin.addClass('visited');
            // append the word 'visited.' to the pin's aria-label
            var visitedLabel = this.model.get('_globals')._accessibility._ariaLabels.visited + ".";
            $pin.attr('aria-label', function(index, val) {return val + " " + visitedLabel});

            $.a11y_alert("visited");

            this.model.checkCompletionStatus();
        },

        setActiveClasses: function(index) {
            this.$('.hotgraphic-item.active').hide().removeClass('active');
            this.$('.hotgraphic-item').eq(index).show().addClass('active');
        },

        setFocus: function() {
            this.$('.hotgraphic-popup-inner .active').a11y_on(true);
            this.$('.hotgraphic-popup-inner .active').a11y_focus();
        },

        onCompletion: function() {
            this.model.setCompletionStatus();
            if (this.completionEvent && this.completionEvent != 'inview') {
                this.model.off(this.completionEvent, this);
            }
        },

        setupEventListeners: function() {
            this.completionEvent = (!this.model.get('_setCompletionOn')) ? 'allItems' : this.model.get('_setCompletionOn');
            if (this.completionEvent !== 'inview') {
                this.model.on(this.completionEvent, _.bind(this.onCompletion, this));
            } else {
                this.$('.component-widget').on('inview', _.bind(this.inview, this));
            }
        },
        
        setupEscapeKey: function() {
            var hasAccessibility = Adapt.config.has('_accessibility') && Adapt.config.get('_accessibility')._isActive;

            if (!hasAccessibility && this.model.get('_isPopupOpen')) {
                $(window).on("keyup", this.onKeyUp);
            } else {
                $(window).off("keyup", this.onKeyUp);
            }
        },

        onAccessibilityToggle: function() {
            this.setupEscapeKey();
        },

        onKeyUp: function(event) {
            if (event.which != 27) return;
            
            event.preventDefault();

            this.model.set('_isPopupOpen', false);
        },

        preRemove: function() {
            if (!this.completionEvent) return;
            
            if (this.completionEvent !== 'inview') {
                this.model.off(this.completionEvent);
            } else {
                this.$('.component-widget').off('inview');
            }
        }

    });

    return HotGraphicView;

});
