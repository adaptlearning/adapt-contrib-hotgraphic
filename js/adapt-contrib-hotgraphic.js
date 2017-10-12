define(function(require) {

    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');

    var HotGraphic = ComponentView.extend({

        currentIndex: 0,
        
        initialize: function() {
            this.listenTo(Adapt, 'remove', this.remove);
            this.listenTo(this.model, 'change:_isVisible', this.toggleVisibility);
            this.listenTo(Adapt, 'accessibility:toggle', this.onAccessibilityToggle);
            
            this.model.set('_globals', Adapt.course.get('_globals'));
            
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

        events: function() {
            return {
                'click .hotgraphic-graphic-pin': 'onPinClicked'
            }
        },

        preRender: function() {
            this.listenTo(Adapt, 'device:changed', this.reRender, this);

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
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);

                _.each(this.model.get('_items'), function(item) {
                    item._isVisited = false;
                });
            }
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
                    this.setCompletionStatus();
                }
            }
        },

        replaceWithNarrative: function() {
            if (!Adapt.componentStore.narrative) throw "Narrative not included in build";
            var Narrative = Adapt.componentStore.narrative;

            var model = this.prepareNarrativeModel();
            var newNarrative = new Narrative({ model: model });
            var $container = $(".component-container", $("." + this.model.get("_parentId")));

            newNarrative.reRender();
            newNarrative.setupNarrative();
            $container.append(newNarrative.$el);
            Adapt.trigger('device:resize');
            _.defer(_.bind(function () {
                this.remove();
            }, this));
        },

        prepareNarrativeModel: function() {
            var model = this.model;
            model.set('_component', 'narrative');
            model.set('_wasHotgraphic', true);
            model.set('originalBody', model.get('body'));
            model.set('originalInstruction', model.get('instruction'));
            if (model.get('mobileBody')) {
                model.set('body', model.get('mobileBody'));
            }
            if (model.get('mobileInstruction')) {
                model.set('instruction', model.get('mobileInstruction'));
            }

            return model;
        },

        updateNavigation: function (index) {
            var $nav = this.$notifyPopup.find('.hotgraphic-popup-nav'),
                itemCount = this.model.get('_items').length;

            $nav.removeClass('first').removeClass('last');

            if(index <= 0 && !this.model.get('_canCycleThroughPagination')) {
                this.$notifyPopup.find('.hotgraphic-popup-nav').addClass('first');
                this.$notifyPopup.find('.hotgraphic-popup-controls.back').a11y_cntrl_enabled(false);
                this.$notifyPopup.find('.hotgraphic-popup-controls.next').a11y_cntrl_enabled(true);
            } else if (index >= itemCount-1 && !this.model.get('_canCycleThroughPagination')) {
                this.$notifyPopup.find('.hotgraphic-popup-nav').addClass('last');
                this.$notifyPopup.find('.hotgraphic-popup-controls.back').a11y_cntrl_enabled(true);
                this.$notifyPopup.find('.hotgraphic-popup-controls.next').a11y_cntrl_enabled(false);
            } else {
                this.$notifyPopup.find('.hotgraphic-popup-controls.back').a11y_cntrl_enabled(true);
                this.$notifyPopup.find('.hotgraphic-popup-controls.next').a11y_cntrl_enabled(true);
            }
            
        },

        removeItemClasses:function() {
            if (!this.$notifyPopup) return;

            var classes = this.model.get("_items")[this.currentIndex]._classes 
                ? this.model.get("_items")[this.currentIndex]._classes
                : '';  // _classes has not been defined
      
            this.$notifyPopup.removeClass('item-' + this.currentIndex + ' ' + classes);
        },

        addItemClasses:function() {
            var classes = this.model.get("_items")[this.currentIndex]._classes 
                ? this.model.get("_items")[this.currentIndex]._classes
                : '';  // _classes has not been defined
      
            this.$notifyPopup.addClass('item-' + this.currentIndex + ' ' + classes);
        },

        onPinClicked: function (event) {
            if(event) event.preventDefault();

            this.removeItemClasses();
            
            var $currentHotSpot = $(event.currentTarget);

            this.currentIndex = this.$('.hotgraphic-graphic-pin').index($currentHotSpot);
            
            this.setVisited(this.currentIndex);
            
            this.openPopup();
        },
        
        openPopup: function() {
            this.listenToOnce(Adapt, 'popup:opened', this.onPopupOpened);
            this.listenToOnce(Adapt, 'popup:closed', this.onPopupClosed);
            Adapt.trigger('notify:popup', {template:Handlebars.templates['hotgraphicPopup'], data:this.model.toJSON()});
        },

        onPopupOpened:function($notifyPopup) {
            this.$notifyPopup = $notifyPopup;

            $notifyPopup.find('.hotgraphic-item').hide().removeClass('active');
            $notifyPopup.find('.hotgraphic-item').eq(this.currentIndex).show().addClass('active');
            $notifyPopup.find('.hotgraphic-popup-count .current').html(this.currentIndex + 1);
            $notifyPopup.find('.hotgraphic-popup-count .total').html($notifyPopup.find('.hotgraphic-item').length);
            $notifyPopup.find('.hotgraphic-popup').attr('class', 'hotgraphic-popup item-' + this.currentIndex);

            this.$('.hotgraphic-popup-inner .active').a11y_focus();

            this.addItemClasses();
            this.addNavListeners();

            this.updateNavigation(this.currentIndex);
        },

        onPopupClosed:function() {
            this.removeNavListeners();
        },

        addNavListeners:function() {
            this.$notifyPopup.find('.hotgraphic-popup-nav .back').on('click', _.bind(this.previousHotGraphic, this));
            this.$notifyPopup.find('.hotgraphic-popup-nav .next').on('click', _.bind(this.nextHotGraphic, this));
        },

        removeNavListeners:function() {
            this.$notifyPopup.find('.hotgraphic-popup-nav .back').off();
            this.$notifyPopup.find('.hotgraphic-popup-nav .next').off();
        },

        previousHotGraphic: function (event) {
            event.preventDefault();
            var newIndex;

            if (this.currentIndex === 0 && !this.model.get('_canCycleThroughPagination')) {
                return;
            } else if (this.currentIndex === 0 && this.model.get('_canCycleThroughPagination')) {
                newIndex = this.model.get('_items').length;
            } else {
                newIndex = this.currentIndex - 1;
            }

            this.removeItemClasses();

            this.currentIndex = newIndex;

            this.$notifyPopup.find('.hotgraphic-item.active').hide().removeClass('active');
            this.$notifyPopup.find('.hotgraphic-item').eq(this.currentIndex).show().addClass('active');
            this.setVisited(this.currentIndex);
            this.$notifyPopup.find('.hotgraphic-popup-count .current').html(this.currentIndex + 1);

            this.addItemClasses();
            this.updateNavigation(this.currentIndex);

            this.$notifyPopup.find('.hotgraphic-popup-inner .active').a11y_focus();
        },

        nextHotGraphic: function (event) {
            event.preventDefault();
            var newIndex;

            if (this.currentIndex === (this.model.get('_items').length-1) && !this.model.get('_canCycleThroughPagination')) {
                return;
            } else if (this.currentIndex === (this.model.get('_items').length-1) && this.model.get('_canCycleThroughPagination')) {
                newIndex = 0;
            } else {
                newIndex = this.currentIndex + 1;
            }

            this.removeItemClasses();

            this.currentIndex = newIndex;

            this.$notifyPopup.find('.hotgraphic-item.active').hide().removeClass('active');
            this.$notifyPopup.find('.hotgraphic-item').eq(this.currentIndex).show().addClass('active');
            this.setVisited(this.currentIndex);
            this.$notifyPopup.find('.hotgraphic-popup-count .current').html(this.currentIndex + 1);

            this.addItemClasses();
            this.updateNavigation(this.currentIndex);

            this.$notifyPopup.find('.hotgraphic-popup-inner .active').a11y_focus();
        },

        setVisited: function(index) {
            var item = this.model.get('_items')[index];
            item._isVisited = true;

            var $pin = this.$('.hotgraphic-graphic-pin').eq(index);
            $pin.addClass('visited');
            // append the word 'visited.' to the pin's aria-label
            var visitedLabel = this.model.get('_globals')._accessibility._ariaLabels.visited + ".";
            $pin.attr('aria-label', function(index, val) {return val + " " + visitedLabel});

            $.a11y_alert("visited");

            this.checkCompletionStatus();
        },

        getVisitedItems: function() {
            return _.filter(this.model.get('_items'), function(item) {
                return item._isVisited;
            });
        },

        checkCompletionStatus: function() {
            if (this.getVisitedItems().length == this.model.get('_items').length) {
                this.trigger('allItems');
            }
        },

        onCompletion: function() {
            this.setCompletionStatus();
            if (this.completionEvent && this.completionEvent != 'inview') {
                this.off(this.completionEvent, this);
            }
        },

        setupEventListeners: function() {
            this.completionEvent = (!this.model.get('_setCompletionOn')) ? 'allItems' : this.model.get('_setCompletionOn');
            if (this.completionEvent !== 'inview') {
                this.on(this.completionEvent, _.bind(this.onCompletion, this));
            } else {
                this.$('.component-widget').on('inview', _.bind(this.inview, this));
            }
        }
    });

    Adapt.register('hotgraphic', HotGraphic);

    return HotGraphic;

});