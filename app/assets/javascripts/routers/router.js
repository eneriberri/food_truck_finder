FoodTruckFinder.Routers.Router = Backbone.Router.extend({
  initialize: function(options) {
    this.$rootEl = options['$rootEl'];
    this.allTrucks = options['allTrucks'];
    this.trucksInRange = options['trucksInRange'];
    this.infoWindow = options['infoWindow'];
  },
  
  routes: {
    "": "index"
  },
  
  index: function() {
    var indexView = new FoodTruckFinder.Views.Index(
                                              {collection: this.allTrucks,
                                              'trucksInRange': this.trucksInRange,
                                              'infoWindow': this.infoWindow,
                                              'container': this.$rootEl });
    this._swapView(indexView);
    indexView.searchArea(); //sets up search box
  },
  
  //removes old view and its event handlers 
  //and renders new view
  _swapView: function(newView) {
    if(this._prevView) this._prevView.remove();
    
    this._prevView = newView;
    this.$rootEl.html(newView.render().$el);
  }
})