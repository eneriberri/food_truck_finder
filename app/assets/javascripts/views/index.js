FoodTruckFinder.Views.Index = Backbone.View.extend({
  template: JST['index'],
  
  className: "form-container",
  
  initialize: function(options) {
    this.trucksInRange = [];
    this.container = options['container'];
    this.infoWindow = new google.maps.InfoWindow({}); //marker popup box
  },
  
  events: {
    'click button': 'validateInput',
    'click .back-arrow': 'replay',
    'mouseenter .back-arrow': 'showNewSearch'
  },

  render: function() {
    this.createMap();
    this.$el.html(this.template);
    return this;
  },
  
  // create map centered on San Francisco
  createMap: function(){
    var mapOptions = {
      zoom: 13,
      center: new google.maps.LatLng(37.7577,-122.4376) //SF
    };
    
    var canvas = document.getElementById('map-canvas');
    this.map = new google.maps.Map(canvas, mapOptions);
  },
    
  
  //autcomplete search box
  searchArea: function() {    
    var self = this;  
    // Create the search box and link it to input field
    var input = document.getElementById('address');
  
    var searchBox = new google.maps.places.SearchBox(input);  
    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {
      var place = searchBox.getPlaces()[0];
                
      //set center to input address and zoom
      var bounds = new google.maps.LatLngBounds();       
      bounds.extend(place.geometry.location);     
      self.map.setCenter(bounds.getCenter());
      self.map.setZoom(14);
    });
    
    // Bias the SearchBox results towards places in SF (map's viewport)
    google.maps.event.addListener(this.map, 'bounds_changed', function() {
      var bounds = self.map.getBounds();
      searchBox.setBounds(bounds);
    });
    
  },
  
  //ensure no blanks before calculating results
  validateInput: function(e) {
    e.preventDefault();
    
    var input = $('input');
    var noneBlank = true;
    for(var i = 0; i < input.length; i++) {
      var currentInput = $(input[i]);
      if(currentInput.val() === "") {
        $(currentInput).addClass('animated shake');
        noneBlank = false;  
        //listens to end of shake animation
        $(currentInput).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
          $('.animated.shake').removeClass('animated shake');
        });
      }
    }   
    //if text fields are filled, run results
    if(noneBlank) this.processInput();
  },
  
  // shows map and sets markers
  processInput: function() {
    this.putFoodTrucksOnMap();
    this.bringUpMap();
    this.displayBackTab();
  },
  
  bringUpMap: function () {
    var height = this.container.height() + 1 // +1 for bottom border
    var cssOptions = {'top': '-' + height + 'px'};
    
    this.container.animate(cssOptions);
    cssOptions['opacity'] = 1;
    
    $('#map-canvas').animate(cssOptions);
  },
  
  putFoodTrucksOnMap: function() {
    var self = this;
    
    this.geocodeAddress(function(results, status) {
      
      //process location/generate trucks
      if(status == google.maps.GeocoderStatus.OK) {
        var loc = results[0].geometry.location;
        self.map.setCenter(loc);
        
        //sets unique marker for search result and add click listener
        self.generateSearchMarker(loc);
        
        self.map.setZoom(15); //because 15 looks nice
        self.generateNearbyTrucks(loc); 
        self.displaySummary();
      }
    });
  },

  geocodeAddress: function(callback) {
    var address = $('#address').val();
    var geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({'address': address}, callback);
  },

  //place address marker on map and listen to clicks to show summary
  generateSearchMarker: function(loc) {
    var self = this;
    this.marker = new google.maps.Marker(this.inputLocMarker(loc));
    google.maps.event.addListener(self.marker, 'click', function() {
      self.clearMarkers();
      self.generateNearbyTrucks(loc);
      self.displaySummary();
    });
  },
  
  inputLocMarker: function(loc) {
    return {
      map: this.map,
      icon: { //special icon for input address marker
        path: fontawesome.markers.MAP_MARKER,
        scale: .8, strokeWeight: 0.2,
        strokeColor: 'black', strokeOpacity: 1,
        fillColor: '#00bbf9', fillOpacity: .8,
      },
      clickable: true,
      position: loc
      };
  },

  //compute distance between loc and trucks
  generateNearbyTrucks: function(loc) {
    var self = this;
    
    this.collection.each(function(truck) {
      var truckPos = new google.maps.LatLng(truck.get('latitude'),
                                            truck.get('longitude'));
    
      var distance = self.computeDistance(truckPos, loc);
         
      if (distance <= $('#miles').val()) { //less or equal to user input miles
        // If truck within range found, create the proper view
        var truckView = new FoodTruckFinder.Views.TruckView({model: truck, map: self.map, truckPos: truckPos, 
                                                             infoWindow: self.infoWindow});    
        self.trucksInRange.push(truckView);
      }
    });
  },
  
  computeDistance: function(truckPos, loc) {
    //(from latLong, to latLong, radius of earth in miles)
    var distanceFromLoc = 
      google.maps.geometry.spherical.computeDistanceBetween(loc, truckPos, 3956.6);
      
    return distanceFromLoc;  
  },
  
  displaySummary: function() {
    var numTrucksInRange = this.trucksInRange.length;  
    var content = '<strong>' + numTrucksInRange +
                 '</strong> food trucks found near <strong>' +
                 $('#address').val() + '</strong>';                              
    
    this.infoWindow.setContent(content);
    this.infoWindow.open(this.map, this.marker);
  },
  
  //animates into view the tab to perform another search
  displayBackTab: function() {   
    //adjust to hide 'New Search' text
    var adj = this.container.height()-30;                        
    $('.back-arrow').fadeIn().animate({top: adj+'px'});
  },
  
  showNewSearch: function() {
    $('.back-arrow').animate({top: '320px'});    
  },
  
  //bring back form & reset map
  replay: function(e) {
    e.preventDefault();
    var self = this;
    
    $('.back-arrow').fadeOut(function() {
      self.container.animate({top: 0});
      $('#map-canvas').animate({top: 0});
    });
    
    this.clearPriorInput();    
    this.clearMarkers();
    this.infoWindow.close(); //depends what route we go...
  },
  
  clearMarkers: function() {
    var noOfMarkers = this.trucksInRange.length;
    for (var i = 0; i < noOfMarkers; i++) {
      var truckView = this.trucksInRange.pop();
      truckView.destroy();
    }
    //this.marker.setMap(null); depends on route
  },
  
  clearPriorInput: function() {
    $('input').each(function(i,input) { $(input).val(''); });
  }
  
})