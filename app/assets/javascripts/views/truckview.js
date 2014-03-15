FoodTruckFinder.Views.TruckView = Backbone.View.extend({
  
  //places markers for each food truck within range
  initialize: function(options) {
    
    var marker = new google.maps.Marker({
      map: options['map'],
      animation: google.maps.Animation.DROP,
      optimized: false, //stops marker from flashing
      position: options['foodPos']//LatLng
    }); 
    
    var self = this;
    this.map = options['map']
    var infoWindow = options['infoWindow'];
    
    google.maps.event.addListener(marker, 'mouseover', function() {
      
      // bounce once
      marker.setAnimation(google.maps.Animation.BOUNCE);
      marker.setAnimation(null);
      
      var content = '<div><strong>'+self.model.get('applicant')+
                          '</strong><p>'+self.model.get('address')+
                          '</p><p>'+self.model.get('fooditems')+'</p></div>';
                     
      infoWindow.setContent(content);
      infoWindow.open(this.map, marker);
    });
    
  },

});