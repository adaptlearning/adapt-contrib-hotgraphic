define(function(require) {
  var ComponentView = require('coreViews/componentView');
  var Adapt = require('coreJS/adapt');

  var HotGraphic = ComponentView.extend({
    
    init: function () {
      this.listenTo(Adapt, 'device:changed', this.reRender, this);
      
      if (Adapt.device.touch==true) {
        this.model.set('touch',true);
      } else {
        this.model.set('touch',false);
      }
    },

    events: function () {
      return Adapt.device.touch==false ? {
        'click .hotgraphic-graphic-pin':'openHotGraphic',
        'click .hotgraphic-popup-done':'closeHotGraphic',
        'click .hotgraphic-popup-nav .back':'previousHotGraphic',
        'click .hotgraphic-popup-nav .next':'nextHotGraphic'
      }:{
        'click .hotgraphic-graphic-pin':'openHotGraphic',
        'click .hotgraphic-popup-done':'closeHotGraphic',
        'click .hotgraphic-popup-nav .back':'previousHotGraphic',
        'click .hotgraphic-popup-nav .next':'nextHotGraphic',
        'touchstart .hotgraphic-popup-inner':'swipeHotGraphic'
      }
    },

    postRender: function() {
      this.setReadyStatus();
    },
    
    reRender: function() {
      if (Adapt.device.screenWidth < 700) {
        new Adapt.narrative({model:this.model, $parent:this.$parent}).reRender();
        this.remove();
      }
    },

    setReadyStatus: function() {
      this.$('.hotgraphic-widget').imageready(_.bind(function() {
        this.model.set('_isReady', true);
      }, this));
    },

    openHotGraphic: function (event) {
      event.preventDefault();
      this.$currentItem = $(event.currentTarget);
      var currentHotSpot = $(event.currentTarget).addClass('visited').data('id');
      this.$('.hotgraphic-item').hide().removeClass('active');
      this.$('.'+currentHotSpot).show().addClass('active');
      var currentIndex = this.$('.hotgraphic-item.active').index();
      this.$('.hotgraphic-popup-count .current').html(currentIndex+1);
      this.$('.hotgraphic-popup-count .total').html(this.$('.hotgraphic-item').length);
      this.$('.hotgraphic-popup').show();
      this.$('.hotgraphic-popup a.next').focus();
      if (this.$('.visited').length == this.$('.hotgraphic-item').length) {
        this.model.set('_isComplete',true);
      }
    },

    closeHotGraphic: function (event) {
      event.preventDefault();
      var currentIndex = this.$('.hotgraphic-item.active').index();
      this.$('.hotgraphic-popup').hide();
      // return focus to active item hotspot
      this.$('.hotgraphic-item').eq(currentIndex).focus();
    },

    swipeHotGraphic:function(event){
      event.preventDefault();
      var $that = this,x = event.originalEvent.touches[0].pageX, X;
      this.$('.hotgraphic-popup-inner').one('touchmove', function (event) {
        event.preventDefault();
        X = event.originalEvent.touches[0].pageX;
        if (X < x) $that.nextHotGraphic();
        else $that.previousHotGraphic();
      });
    },

    previousHotGraphic: function (event) {
      event.preventDefault();
      var currentIndex = this.$('.hotgraphic-item.active').index();
      if (currentIndex > 0) {
        this.$('.hotgraphic-item.active').hide().removeClass('active');
        this.$('.hotgraphic-item').eq(currentIndex-1).show().addClass('active');
        this.$('.hotgraphic-graphic-pin').eq(currentIndex-1).addClass('visited');
        this.$('.hotgraphic-popup-count .current').html(currentIndex);
        if (this.$('.visited').length == this.$('.hotgraphic-item').length) {
          this.model.set('_isComplete',true);
        }
      }
    },

    nextHotGraphic: function (event) {
      event.preventDefault();
      var currentIndex = this.$('.hotgraphic-item.active').index();
      if (currentIndex < (this.$('.hotgraphic-item').length-1)) {
        this.$('.hotgraphic-item.active').hide().removeClass('active');
        this.$('.hotgraphic-item').eq(currentIndex+1).show().addClass('active');
        this.$('.hotgraphic-graphic-pin').eq(currentIndex+1).addClass('visited');
        this.$('.hotgraphic-popup-count .current').html(currentIndex+2);
        if (this.$('.visited').length == this.$('.hotgraphic-item').length) {
          this.model.set('_isComplete',true);
        }
      }
    }

  });

  Adapt.register("hotgraphic", HotGraphic);

});
