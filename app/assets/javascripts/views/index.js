FoodTruckFinder.Views.Index = Backbone.View.extend({
  template: JST['index'],
  
  events: {
    'click button': 'findFood'
  },

  render: function() {
    var renderedHTML = this.template({trucks: this.collection});
    console.log(this.collection);
    this.initialize_map();
    this.$el.html(renderedHTML);
    return this;
  },
  
  findFood: function(e) {
    e.preventDefault();
    console.log('yes');
    $('.form-container').hide();
    $('#map-canvas').css('opacity', '1');
  },
  
  initialize_map: function(){
    var mapOptions = {
      zoom: 11,
      center: new google.maps.LatLng(37.7577,-122.4376)
    };
    
    this.map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  }
})