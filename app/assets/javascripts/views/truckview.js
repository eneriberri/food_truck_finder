FoodTruckFinder.Views.TruckView = Backbone.View.extend({
  className: 'truck-detail',
  template: JST['truckdetail'],
  
  
  render: function() {
    var renderedHTML = this.template({ truck: this.model });
    this.$el.html(renderedHTML);
    return this;
  },
  
  events: {
    'click .full-map': 'showMap'
  },
  
  //places markers for each food truck within range
  initialize: function(options) {
    
    this.marker = new google.maps.Marker({
      map: options['map'],
      animation: google.maps.Animation.DROP,
      optimized: false, //stops marker from flashing
      position: options['foodPos'],//LatLng
      title: this.model.get('applicant'),
      descr: this.model.get('fooditems'),
      id : this.model.get('objectid')
    }); 
    
    var infoWindow = options['infoWindow'];
    var self = this;
    google.maps.event.addListener(this.marker, 'mouseover', function() {
      var content = '<div>' + self.model.get('applicant') + '</div>';
      infoWindow.setContent(content);
      infoWindow.open(this.map, self.marker);
    });
  },
  
  showTruckDetail: function() {
    console.log(this.model.get('applicant'));
    
    var content = '<div>' + this.model.get('applicant') + '</div>'
    var infowindow = new google.maps.InfoWindow({ content: content });
    
    infowindow.open(this.map, this.marker);
    
    //bounce once
    this.marker.setAnimation(google.maps.Animation.BOUNCE);
    this.marker.setAnimation(null);
    // var speed = 1000;
 //    setTimeout(function() {
 //      $('#map-canvas').animate({opacity: 1, right: '400px'}, speed, function(){
 //        $('.truck-detail').fadeIn(speed);
 //      });
 //    }, 300);
    
  },
  
  hideTruckDetail: function() {
    
  },
  
  showMap: function() {
    var speed = 1000;
    $('#map-canvas').animate({opacity: 1, right: 0}, speed);
  }
})