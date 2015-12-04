define(function(require) {

    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');

    var HotGraphic = ComponentView.extend({

        initialize: function() {
            this.listenTo(Adapt, 'remove', this.remove);
            this.listenTo(this.model, 'change:_isVisible', this.toggleVisibility);
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
                'click .hotgraphic-graphic-pin': 'openHotGraphic',
                'click .hotgraphic-popup-done': 'closeHotGraphic',
                'click .hotgraphic-popup-nav .back': 'previousHotGraphic',
                'click .hotgraphic-popup-nav .next': 'nextHotGraphic'
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

        applyNavigationClasses: function (index) {
            var $nav = this.$('.hotgraphic-popup-nav'),
                itemCount = this.$('.hotgraphic-item').length;

            $nav.removeClass('first').removeClass('last');
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
            var classes = this.model.get("_items")[index]._classes 
                ? this.model.get("_items")[index]._classes
                : '';  // _classes has not been defined
      
            this.$('.hotgraphic-popup').attr('class', 'hotgraphic-popup ' + 'item-' + index + ' ' + classes);

        },

        openHotGraphic: function (event) {
            event.preventDefault();
            this.$('.hotgraphic-popup-inner').a11y_on(false);
            var currentHotSpot = $(event.currentTarget).data('id');
            this.$('.hotgraphic-item').hide().removeClass('active');
            this.$('.'+currentHotSpot).show().addClass('active');
            var currentIndex = this.$('.hotgraphic-item.active').index();
            this.setVisited(currentIndex);
            this.$('.hotgraphic-popup-count .current').html(currentIndex+1);
            this.$('.hotgraphic-popup-count .total').html(this.$('.hotgraphic-item').length);
            this.$('.hotgraphic-popup').attr('class', 'hotgraphic-popup ' + 'item-' + currentIndex);
            this.$('.hotgraphic-popup').show();
            this.$('.hotgraphic-popup-inner .active').a11y_on(true);
              
            Adapt.trigger('popup:opened',  this.$('.hotgraphic-popup-inner'));

            this.$('.hotgraphic-popup-inner .active').a11y_focus();
            this.applyNavigationClasses(currentIndex);
        },

        closeHotGraphic: function(event) {
            event.preventDefault();
            var currentIndex = this.$('.hotgraphic-item.active').index();
            this.$('.hotgraphic-popup').hide();
            Adapt.trigger('popup:closed',  this.$('.hotgraphic-popup-inner'));
        },

        previousHotGraphic: function (event) {
            event.preventDefault();
            var currentIndex = this.$('.hotgraphic-item.active').index();

            if (currentIndex === 0 && !this.model.get('_canCycleThroughPagination')) {
                return;
            } else if (currentIndex === 0 && this.model.get('_canCycleThroughPagination')) {
                currentIndex = this.model.get('_items').length;
            }

            this.$('.hotgraphic-item.active').hide().removeClass('active');
            this.$('.hotgraphic-item').eq(currentIndex-1).show().addClass('active');
            this.setVisited(currentIndex-1);
            this.$('.hotgraphic-popup-count .current').html(currentIndex);
            this.$('.hotgraphic-popup-inner').a11y_on(false);

            this.applyNavigationClasses(currentIndex-1);
            this.$('.hotgraphic-popup-inner .active').a11y_on(true);
            this.$('.hotgraphic-popup-inner .active').a11y_focus();
        },

        nextHotGraphic: function (event) {
            event.preventDefault();
            var currentIndex = this.$('.hotgraphic-item.active').index();
            if (currentIndex === (this.model.get('_items').length-1) && !this.model.get('_canCycleThroughPagination')) {
                return;
            } else if (currentIndex === (this.model.get('_items').length-1) && this.model.get('_canCycleThroughPagination')) {
                currentIndex = -1;
            }
            this.$('.hotgraphic-item.active').hide().removeClass('active');
            this.$('.hotgraphic-item').eq(currentIndex+1).show().addClass('active');
            this.setVisited(currentIndex+1);
            this.$('.hotgraphic-popup-count .current').html(currentIndex+2);
            this.$('.hotgraphic-popup-inner').a11y_on(false);

            this.applyNavigationClasses(currentIndex+1);
            this.$('.hotgraphic-popup-inner .active').a11y_on(true);
            this.$('.hotgraphic-popup-inner .active').a11y_focus();
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
            if (!this.model.get('_isComplete')) {
                if (this.getVisitedItems().length == this.model.get('_items').length) {
                    this.trigger('allItems');
                }
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
