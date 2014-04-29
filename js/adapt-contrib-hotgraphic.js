/*
* adapt-contrib-hotgraphic
* License - http://github.com/adaptlearning/adapt_framework/LICENSE
* Maintainers - Kevin Corry <kevinc@learningpool.com>, Daryl Hedley <darylhedley@hotmail.com>
*/
define(function(require) {
  var ComponentView = require('coreViews/componentView');
  var Adapt = require('coreJS/adapt');

  var HotGraphic = ComponentView.extend({

    initialize: function() {
      this.listenTo(Adapt, 'remove', this.remove);
      this.listenTo(this.model, 'change:_isVisible', this.toggleVisibility);
      this.preRender();
      if (Adapt.device.screenSize=='large') {
        this.render();
      } else {
        this.reRender();
      }
    },

    events: function () {
      return {
        'click .hotgraphic-graphic-pin':'openHotGraphic',
        'click .hotgraphic-popup-done':'closeHotGraphic',
        'click .hotgraphic-popup-nav .back':'previousHotGraphic',
        'click .hotgraphic-popup-nav .next':'nextHotGraphic'
      }
    },

    preRender: function () {
      this.listenTo(Adapt, 'device:changed', this.reRender, this);
    },

    postRender: function() {
      this.$('.hotgraphic-widget').imageready(_.bind(function() {
        this.setReadyStatus();
      }, this));
    },

    reRender: function() {
      if (Adapt.device.screenSize != 'large') {
        this.replaceWithNarrative();
      }
    },

    replaceWithNarrative: function() {
      var Narrative = require('components/adapt-contrib-narrative/js/adapt-contrib-narrative');
      var model = this.prepareNarrativeModel();
      var newNarrative = new Narrative({model:model, $parent: this.options.$parent});
      newNarrative.reRender();
      newNarrative.setupNarrative();
      this.options.$parent.append(newNarrative.$el);
      Adapt.trigger('device:resize');
      this.remove();
    },

    prepareNarrativeModel: function() {
      var model = this.model;
      model.set('_component', 'narrative');
      model.set('_wasHotgraphic', true);
      model.set('originalBody', model.get('body'));
      if (model.get('mobileBody')) {
        model.set('body', model.get('mobileBody'));
      }
      return model;
    },

    applyNavigationClasses: function (index) {
      var $nav = this.$('.hotgraphic-popup-nav'),
          itemCount = this.$('.hotgraphic-item').length;

      $nav.removeClass('first').removeClass('last');
      if(index === 0) {
        this.$('.hotgraphic-popup-nav').addClass('first');
      } else if (index >= itemCount-1) {
        this.$('.hotgraphic-popup-nav').addClass('last');
      }
    },

    openHotGraphic: function (event) {
      event.preventDefault();
      var currentHotSpot = $(event.currentTarget).data('id');
      this.$('.hotgraphic-item').hide().removeClass('active');
      this.$('.'+currentHotSpot).show().addClass('active');
      var currentIndex = this.$('.hotgraphic-item.active').index();
      this.setVisited(currentIndex);
      this.$('.hotgraphic-popup-count .current').html(currentIndex+1);
      this.$('.hotgraphic-popup-count .total').html(this.$('.hotgraphic-item').length);
      this.$('.hotgraphic-popup').show();
      this.$('.hotgraphic-popup a.next').focus();
      this.applyNavigationClasses(currentIndex);
    },

    closeHotGraphic: function (event) {
      event.preventDefault();
      var currentIndex = this.$('.hotgraphic-item.active').index();
      this.$('.hotgraphic-popup').hide();
      this.$('.hotgraphic-item').eq(currentIndex).focus();
    },

    previousHotGraphic: function (event) {
      event.preventDefault();
      var currentIndex = this.$('.hotgraphic-item.active').index();
      if (currentIndex > 0) {
        this.$('.hotgraphic-item.active').hide().removeClass('active');
        this.$('.hotgraphic-item').eq(currentIndex-1).show().addClass('active');
        this.setVisited(currentIndex-1);
        this.$('.hotgraphic-popup-count .current').html(currentIndex);
      }
      this.applyNavigationClasses(currentIndex-1);
    },

    nextHotGraphic: function (event) {
      event.preventDefault();
      var currentIndex = this.$('.hotgraphic-item.active').index();
      if (currentIndex < (this.$('.hotgraphic-item').length-1)) {
        this.$('.hotgraphic-item.active').hide().removeClass('active');
        this.$('.hotgraphic-item').eq(currentIndex+1).show().addClass('active');
        this.setVisited(currentIndex+1);
        this.$('.hotgraphic-popup-count .current').html(currentIndex+2);
      }
      this.applyNavigationClasses(currentIndex+1);
    },

    setVisited: function(index) {
      var item = this.model.get('_items')[index];
      item._isVisited = true;
      this.$('.hotgraphic-graphic-pin').eq(index).addClass('visited');
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
          this.setCompletionStatus();
        }
      }
    }

  });

  Adapt.register("hotgraphic", HotGraphic);

  return HotGraphic;

});
