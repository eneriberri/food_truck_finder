FoodTruckFinder.Views.TruckView = Backbone.View.extend({
  tagName: 'li',
  template: JST['truckdetail'],
  
  
  render: function() {
    var renderedHTML = this.template({ model: this.model });
    this.$el.html(renderedHTML);
    return this;
  },
  
  
  //places markers for each food truck within range
  initialize: function(options) {
    var marker = new google.maps.Marker({
      map: options['map'],
      animation: google.maps.Animation.DROP,
      position: options['foodPos'],//LatLng,
      title: this.model.get('applicant'),
      descr: this.model.get('fooditems'),
      id : this.model.get('objectid')
    }); 
    
    google.maps.event.addListener(marker, 'mouseover', this.showTruckDetail);
  },
  
  showTruckDetail: function() {
    console.log('here!');
  }
})