define([
    'core/js/adapt',
    'core/js/views/componentView',
    './hotgraphicPopupView'
], function(Adapt, ComponentView, HotgraphicPopupView) {
    'use strict';

    var HotGraphicView = ComponentView.extend({

        events: {
            'click .hotgraphic-graphic-pin': 'onPinClicked'
        },

        preRender: function() {
            this.model.set('_isPopupOpen', false);
            if (this.model.get('_canCycleThroughPagination') === undefined) {
                this.model.set('_canCycleThroughPagination', false);
            }

            if (Adapt.device.screenSize == 'large') {
                this.render();
            } else {
                this.reRender();
            }

            this.listenTo(Adapt, 'device:changed', this.reRender);
            this.listenTo(this.model, {
                'change:_isPopupOpen': this.openPopup
            });
            this.listenTo(this.model.get('_items'), {
                'change:_isActive': this.onItemsActiveChange,
                'change:_isVisited': this.onItemsVisitedChange
            });

            this.checkIfResetOnRevisit();
            this.popupView = null;
            this.selectedPin = null; // used to restore focus when popup is closed 
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
            }
        },

        reRender: function() {
            if (Adapt.device.screenSize != 'large') {
                this.replaceWithNarrative();
            }
        },

        inview: function(event, visible, visiblePartX, visiblePartY) {
            if (!visible) return;
            
            if (visiblePartY === 'top') {
                this._isVisibleTop = true;
            } else if (visiblePartY === 'bottom') {
                this._isVisibleBottom = true;
            } else {
                this._isVisibleTop = true;
                this._isVisibleBottom = true;
            }

            var wasAllInview = (this._isVisibleTop && this._isVisibleBottom);
            if (!wasAllInview) return;

            this.$('.component-widget').off('inview');
            this.setCompletionStatus();
        },

        replaceWithNarrative: function() {
            if (!Adapt.componentStore.narrative) throw "Narrative not included in build";
            var NarrativeView = Adapt.componentStore.narrative.view;

            var model = this.prepareNarrativeModel();
            var newNarrative = new NarrativeView({ model: model });
            var $container = $(".component-container", $("." + this.model.get("_parentId")));

            this.model.set('_isPopupOpen', false); // close popup 

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
            model.set({
                '_component': 'narrative',
                '_wasHotgraphic': true,
                'originalBody': model.get('body'),
                'originalInstruction': model.get('instruction')
            });

            // check if active item exists, default to 0
            var active = model.getActiveItem();
            if (!active) {
                model.getItem(0).toggleActive(true);
            }
            
            if (model.get('mobileBody')) {
                model.set('body', model.get('mobileBody'));
            }
            if (model.get('mobileInstruction')) {
                model.set('instruction', model.get('mobileInstruction'));
            }
            return model;
        },

        onItemsActiveChange: function(model, _isActive) {
            var selector = 'item-'+model.get('_index');
            this.$('.hotgraphic-graphic-pin.'+selector).toggleClass('active', _isActive);
        },

        onItemsVisitedChange: function(model, _isVisited) {
            if (_isVisited) {
                var selector = 'item-'+model.get('_index');
                this.$('.hotgraphic-graphic-pin.'+selector).addClass('visited');
            }
        },

        onPinClicked: function (event) {
            if(event) {
                event.preventDefault();
            }
            this.selectedPin = event.currentTarget;
            var $currentHotSpot = $(this.selectedPin);
            $currentHotSpot.show().addClass('active');
            this.setVisited($currentHotSpot.data('index'));
            this.model.set('_isPopupOpen', true);
        },

        openPopup: function(model, _isPopupOpen) {
            if (!_isPopupOpen) {
                Adapt.trigger('notify:close');
                return;
            }

            this.popupView = new HotgraphicPopupView({
                model: this.model
            });

            Adapt.trigger("notify:popup", {
                _view: this.popupView,
                _isCancellable: true,
                _showCloseButton: false,
                _closeOnBackdrop: true,
                _classes: ' hotgraphic'
            });

            this.listenTo(this.popupView, {
                'popup:closed': this.onPopupClosed
            });

            this.$('.hotgraphic-popup-inner .active').a11y_focus();
        },

        onPopupClosed: function() {
            this.model.getActiveItem().set('_isActive', false);
            this.removePopupEvents();
            this.model.set('_isPopupOpen', false);
            $(this.selectedPin).a11y_focus();
        },

        removePopupEvents: function() {
            this.stopListening(this.popupView, {
                'popup:closed': this.onPopupClosed
            });
        },

        setVisited: function(index) {
            var item = this.model.getItem(index);
            item.toggleActive(true);
            item.toggleVisited(true);

            var $pin = this.$('.hotgraphic-graphic-pin').eq(index);
            // append the word 'visited.' to the pin's aria-label
            var visitedLabel = this.model.get('_globals')._accessibility._ariaLabels.visited + ".";
            $pin.attr('aria-label', function(index, val) {
                return val + " " + visitedLabel;
            });

            $.a11y_alert("visited");
        },

        setupEventListeners: function() {
            if (this.model.get('_setCompletionOn') === 'inview') {
                this.$('.component-widget').on('inview', _.bind(this.inview, this));
            }
        },

        remove: function() {
            if (this.model.get('_setCompletionOn') === 'inview') {
                this.$('.component-widget').off('inview');
            }
            ComponentView.prototype.remove.apply(this, arguments);
        }

    });

    return HotGraphicView;

});