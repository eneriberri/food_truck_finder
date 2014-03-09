FoodTruckFinder.Views.Index = Backbone.View.extend({
  template: JST['index'],
  
  events: {
    'click button': 'findFood',
    'click .food': 'displayNext',
    'keypress .food': 'displayNext',
    'keypress .location': 'displayNext',
    'keypress .distance': 'displayNext'
  },

  render: function() {
    var renderedHTML = this.template({trucks: this.collection});
    console.log(this.collection);
    this.initializeMap();
    this.$el.html(renderedHTML);
    return this;
  },
  
  // initialize the map
  initializeMap: function(){
    var mapOptions = {
      zoom: 5,
      center: new google.maps.LatLng(37.7577,-122.4376)
    };
    
    this.map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  },
  
  
  //autcomplete search box
  searchArea: function() {
    
    var self = this;
  
    var markers = [];

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');

    var searchBox = new google.maps.places.SearchBox(input);

    // [START region_getplaces]
    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {
      var places = searchBox.getPlaces();
      console.log(places);
  
      for (var i = 0, marker; marker = markers[i]; i++) {
        marker.setMap(null);
      }
  
      // For each place, get the icon, place name, and location.
      markers = [];
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0, place; place = places[i]; i++) {
        var image = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };
        
        // commenting out placing marker on map
        // Create a marker for each place.
        // var marker = new google.maps.Marker({
        //   map: self.map,
        //   icon: image,
        //   title: place.name,
        //   position: place.geometry.location
        // });
        //   
        // markers.push(marker);
  
        bounds.extend(place.geometry.location);
      }
  
      // self.map.fitBounds(bounds);
      
      //set center to input address and zoom
      self.map.setCenter(bounds.getCenter());
      self.map.setZoom(17);
    });

    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    google.maps.event.addListener(this.map, 'bounds_changed', function() {
      var bounds = self.map.getBounds();
      searchBox.setBounds(bounds);
    });
    
  },
  
  // shows map and sets markers
  findFood: function(e) {
    e.preventDefault();
    console.log('findFood');
    this.codeAddress(); //geocode the given address
    
    var speed = 1000;
    //fade in map and fade out form
    var self = this;
    $('#map-canvas').animate({opacity: 1, top: 0}, speed, function(){
      $('.form-container').fadeOut(speed);
      // self.addMarker();
      // self.setCenter();
    });
    
  },
  
  //geoCode the given address
  codeAddress: function() {
    var self = this;
    var address = $('#pac-input').val();
    geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var loc = results[0].geometry.location;
        self.map.setCenter(loc);
        var marker = new google.maps.Marker({
            map: self.map,
            position: loc
        });
        
        self.computeDistance(loc);
        
      } else {
        console.log("Geocode was not successful for the following reason: " + status);
      }
    });
  
  },
  
  computeDistance: function(loc) {
      //the distance function defaults to km.  
       //to use miles add the radius of the earth in miles as the 3rd param.
       //earths radius in miles == 3956.6
       var self = this;
       this.collection.each(function(truck) {

         var foodPos = new google.maps.LatLng(truck.get('latitude'), 
                                              truck.get('longitude'));
                                              
         var distance = 
           google.maps.geometry.spherical.computeDistanceBetween(
              loc/* from LatLng */, 
              foodPos/* to LatLng */, 
              3956.6/* radius of the earth, earths radius in miles == 3956.6 */ 
            );
        
          if (distance <= .5) { //less or equal to 1/2 miles
            var marker = new google.maps.Marker({
              map: self.map,
              animation: google.maps.Animation.DROP,
              position: foodPos//LatLng
            });              
          }
       });
       

    
  },
  
  // add markers to the map and zooms
  // addMarker: function() {
  //   var myLatlng = new google.maps.LatLng(37.7577,-122.4376);
  //   var marker = new google.maps.Marker({
  //       position: myLatlng,
  //       animation: google.maps.Animation.DROP,
  //       map: this.map,
  //       title: "Hello World!",
  //       descr: "Helloooo"
  //   });
  //   this.map.setCenter(marker.getPosition());
  //   this.map.setZoom(12);
  // },
  
  setCenter: function(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        animation: google.maps.Animation.DROP,
        map: this.map,
        title: "Hello World!",
        descr: "Helloooo"
    });
    this.map.setCenter(marker.getPosition());
    // this.map.setZoom(3);
  },
  
  //fades in next input field
  displayNext: function(e) {
    var $nextInput = $($(e.target).parent().next()[0]);
    
    $nextInput.fadeIn(function() {
      $nextInput.animate({top: 0});
    });
    
  }
  
})