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

        initialize: function() {
            ComponentView.prototype.initialize.call(this);
            this.setUpViewData();
            this.setUpModelData();
            this.setUpEventListeners();
            this.checkIfResetOnRevisit();
        },

        setUpViewData: function() {
            this.popupView = null;
            this._isPopupOpen = false;
        },

        setUpModelData: function() {
            if (this.model.get('_canCycleThroughPagination') === undefined) {
                this.model.set('_canCycleThroughPagination', false);
            }
        },

        setUpEventListeners: function() {
            this.listenTo(Adapt, 'device:changed', this.reRender);

            this.listenTo(this.model.get('_children'), {
                'change:_isActive': this.onItemsActiveChange,
                'change:_isVisited': this.onItemsVisitedChange
            });
        },

        reRender: function() {
            if (Adapt.device.screenSize !== 'large') {
                this.replaceWithNarrative();
            }
        },

        replaceWithNarrative: function() {
            var NarrativeView = Adapt.getViewClass('narrative');

            var model = this.prepareNarrativeModel();
            var newNarrative = new NarrativeView({ model: model });
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
        },

        onItemsActiveChange: function(model, _isActive) {
            this.getItemElement(model).toggleClass('active', _isActive);
        },

        getItemElement: function(model) {
            var index = model.get('_index');
            return this.$('.hotgraphic-graphic-pin').filter('[data-index="' + index + '"]');
        },

        onItemsVisitedChange: function(model, _isVisited) {
            if (!_isVisited) return;
            var $pin = this.getItemElement(model);

            // Append the word 'visited.' to the pin's aria-label
            var visitedLabel = this.model.get('_globals')._accessibility._ariaLabels.visited + ".";
            $pin.attr('aria-label', function(index, val) {
                return val + " " + visitedLabel;
            });

            $pin.addClass('visited');
            $.a11y_alert("visited");
        },

        // Used to check if the hotgraphic should reset on revisit
        checkIfResetOnRevisit: function() {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);
            }
        },

        preRender: function() {
            if (Adapt.device.screenSize === 'large') {
                this.render();
            } else {
                this.reRender();
            }
        },

        postRender: function() {
            this.renderState();
            this.$('.hotgraphic-widget').imageready(_.bind(function() {
                this.setReadyStatus();
            }, this));

            this.setUpInviewListener();
        },

        setUpInviewListener: function() {
            if (this.model.get('_setCompletionOn') === 'inview') {
                this.$('.component-widget').on('inview', _.bind(this.inview, this));
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

        onPinClicked: function (event) {
            if(event) event.preventDefault();

            var item = this.model.getItem($(event.currentTarget).data('index'));
            item.toggleActive(true);
            item.toggleVisited(true);

            this.openPopup();
        },

        openPopup: function() {
            if (this._isPopupOpen) return;

            this._isPopupOpen = true;

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

            this.listenToOnce(Adapt, {
                'popup:closed': this.onPopupClosed
            });
        },

        onPopupClosed: function() {
            this.model.getActiveItem().toggleActive();
            this._isPopupOpen = false;
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
