FoodTruckFinder.Views.Index = Backbone.View.extend({
  template: JST['index'],
  
  events: {
    'click button': 'findFood'
  },

  render: function() {
    var renderedHTML = this.template({trucks: this.collection});
    console.log(this.collection);
    this.initializeMap();
    this.$el.html(renderedHTML);
    return this;
  },
  
  initializeMap: function(){
    var mapOptions = {
      zoom: 11,
      center: new google.maps.LatLng(37.7577,-122.4376)
    };
    
    this.map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  },
  
  findFood: function(e) {
    e.preventDefault();
    var speed = 300;
    //fade in map and fade out form
    var self = this;
    $('#map-canvas').animate({opacity: 1}, speed, function(){
      $('.form-container').fadeOut(speed);
      self.addMarker();
    });
  },
  
  addMarker: function() {
    var myLatlng = new google.maps.LatLng(37.7577,-122.4376);
    var marker = new google.maps.Marker({
        position: myLatlng,
        animation: google.maps.Animation.DROP,
        map: this.map,
        title: "Hello World!",
        descr: "Helloooo"
    });
  }
  
})