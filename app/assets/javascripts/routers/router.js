FoodTruckFinder.Routers.Router = Backbone.Router.extend({
  initialize: function(options) {
    this.$rootEl = options['$rootEl'];
  },
  
  routes: {
    "": "index"
  },
  
  index: function() {
    var indexView = new FoodTruckFinder.Views.Index();
    this._swapView(indexView);
  },
  
  //removes old view and its event handlers 
  //and renders new view
  _swapView: function(newView) {
    if(this._prevView) this._prevView.remove();
    
    this._prevView = newView;
    this.$rootEl.html(newView.render().$el);
  }
})