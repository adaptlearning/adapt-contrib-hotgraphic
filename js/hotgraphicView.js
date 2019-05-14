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
            this.listenTo(Adapt, 'device:resize', this.setupTooltips);

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
            _.defer(this.remove.bind(this));
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
        },

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
            this.$('.hotgraphic-widget').imageready(function() {
                this.setReadyStatus();
                this.setupTooltips();
            }.bind(this));

            if (this.model.get('_setCompletionOn') === 'inview') {
                this.setupInviewCompletion('.component-widget');
            }
        },

        setupTooltips: function() {
            var tooltipConfig = this.model.get('_tooltips');
            if (!tooltipConfig || !tooltipConfig._isEnabled) return;

            this.model.get('_items').forEach(function(item) {
                var config = {
                    tooltipConfig: tooltipConfig,
                    tooltipElement: $(this.$('.hotgraphic-tooltip').filter('[data-index="' + item._index + '"]')[0]),
                    pinElement: $(this.$('.hotgraphic-graphic-pin').filter('[data-index="' + item._index + '"]')[0]),
                    item: item
                };
                this.setTooltipPosition(config);
                this.setTooltipEventListener(config);
            }, this);
        },

        setTooltipPosition: function(config) {
            var directionOpposites = {
                left: 'right',
                top: 'bottom',
                right: 'left',
                bottom: 'top'
            };
            var alignedPosition = this.getTooltipAlignedPosition(config);

            if (!this.checkTooltipWithinBounds(config, alignedPosition)) {
                var newAlignment = directionOpposites[config.tooltipConfig._alignment];
                alignedPosition = this.getTooltipAlignedPosition(config, newAlignment);
            }

            config.tooltipElement.css(alignedPosition);
        },

        getTooltipAlignedPosition: function(config, newAlignment) {
            var alignment = newAlignment || config.tooltipConfig._alignment || 'top';
            var centrePosition = this.getTooltipCentrePosition(config);
            var margin = config.tooltipConfig._margin || 0;
            var xTooltip = config.tooltipElement.width() / 2;
            var yTooltip = config.tooltipElement.height() / 2;
            var xPin = config.pinElement.width() / 2;
            var yPin = config.pinElement.height() / 2;
            var alignedPosition = Object.assign({}, centrePosition);

            switch(alignment) {
                case 'left':
                    alignedPosition.left = centrePosition.left - xTooltip - xPin - margin;
                    break;
                case 'top':
                    alignedPosition.top = centrePosition.top - yTooltip - yPin - margin;
                    break;
                case 'right':
                    alignedPosition.left = centrePosition.left + xTooltip + xPin + margin;
                    break;
                case 'bottom':
                    alignedPosition.top = centrePosition.top + yTooltip + yPin + margin;
                    break;
            }

            return alignedPosition;
        },

        getTooltipCentrePosition: function(config) {
            var yCentre = config.pinElement.position().top + (config.pinElement.height() / 2);
            var xCentre = config.pinElement.position().left + (config.pinElement.width() / 2);

            return {
                top: yCentre - (config.tooltipElement.height() / 2),
                left: xCentre - (config.tooltipElement.width() / 2)
            };
        },

        checkTooltipWithinBounds: function(config, alignedPosition) {
            var parentElement = $('.hotgraphic-graphic');

            return [
                alignedPosition.left > 0,
                alignedPosition.top > 0,
                alignedPosition.left + config.tooltipElement.width() < parentElement.width(),
                alignedPosition.top + config.tooltipElement.height() < parentElement.height()
            ].every(Boolean);
        },

        setTooltipEventListener: function(config) {
            var alwaysShow = !config.tooltipConfig._showOnlyOnHover || Adapt.device.touch;
            if (alwaysShow) {
                config.tooltipElement.css('visibility', 'visible');
                return;
            }

            config.pinElement.hover(function() {
                config.tooltipElement.css('visibility', 'visible');
            }, function() {
                config.tooltipElement.css('visibility', 'hidden');
            });
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
        }

    });

    return HotGraphicView;

});
