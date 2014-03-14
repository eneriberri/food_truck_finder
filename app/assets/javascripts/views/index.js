FoodTruckFinder.Views.Index = Backbone.View.extend({
  template: JST['index'],
  
  className: "form-container",
  
  initialize: function(options) {
    this.trucksInRange = options['trucksInRange'];
    this.container = options['container'];
    this.infoWindow = new google.maps.InfoWindow({}); //marker info
  },
  
  events: {
    'click button': 'findFood',
    'click .back-arrow': 'replay',
    'hover .back-arrow': 'showNewSearch'
  },

  render: function() {
    var renderedHTML = this.template({trucks: this.collection});
    this.initializeMap();
    this.$el.html(renderedHTML);
    return this;
  },
  
  // initialize the map
  initializeMap: function(){
    var mapOptions = {
      zoom: 13,
      center: new google.maps.LatLng(37.7577,-122.4376)
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
  
  // shows map and sets markers
  findFood: function(e) {
    e.preventDefault();

    this.codeAddress(); //geocode the given address
    //+ 1 for bottom border
    var height = this.container.height()+1;
    //position form and fade in map
    var cssOptions = {'top': '-'+height+'px'};

    this.container.animate(cssOptions);
    cssOptions['opacity'] = 1;
    //top = - height of header el div
    $('#map-canvas').animate(cssOptions);
    
    this.displayBackTab();
  },
  
  //geoCode the given address
  codeAddress: function() {
    var self = this;
    var address = $('#address').val();
    geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({'address': address}, function(results, status) {
      if(status == google.maps.GeocoderStatus.OK) {
        var loc = results[0].geometry.location;
        self.map.setCenter(loc);
        
        //sets address marker
        self.marker = new google.maps.Marker({
            map: self.map,
            icon: {
              path: fontawesome.markers.MAP_MARKER,
              scale: .8,
              strokeWeight: 0.2,
              strokeColor: 'black',
              strokeOpacity: 1,
              fillColor: '#00bbf9',
              fillOpacity: .8,
            },
            clickable: false,
            position: loc
        });
        
        self.computeDistance(loc);
        
      } else {
        console.log("Geocode was not successful: " + status);
      }
    });
  
  },

  //the distance function defaults to km.  
  //to use miles add the radius of the earth in miles as the 3rd param.
  //earths radius in miles == 3956.6
  computeDistance: function(loc) {

     var self = this;
     var numTrucksInRange = 0;
     
     //for every truck, grab their pos
     this.collection.each(function(truck) {
       var foodPos = new google.maps.LatLng(truck.get('latitude'), 
                                            truck.get('longitude'));
                                          
       var distance = 
         google.maps.geometry.spherical.computeDistanceBetween(
            loc/* from LatLng */, 
            foodPos/* to LatLng */, 
            3956.6/* radius of the earth, earth's radius in miles == 3956.6 */ 
          );
    
        if (distance <= .5) { //less or equal to 1/2 miles
          numTrucksInRange++;
          //add to collection of trucks near location
          self.trucksInRange.add({name: truck.get('applicant'), 
                                  descr: truck.get('fooditems')});
          
          // If a new truck is added, create the proper view
          var truckView = new FoodTruckFinder.Views.TruckView({ model: truck, 
                                                                map: self.map, 
                                                                foodPos: foodPos, 
                                                                infoWindow: self.infoWindow });    
                
        }
     });
     
     this.displaySummary(numTrucksInRange);
    
  },
  
  displaySummary: function(numTrucksInRange) {
    console.log(this.marker);
    console.log('displaySummary');
    var result = numTrucksInRange+" food trucks found near "
                                 +$('#address').val();
    
    // this.container.after('<div class="result">'+result+'</div>');
    // $('.result').animate({bottom: 0});
    
    var self = this;
    google.maps.event.addListener(this.marker, 'mouseover', function() {
      
      // bounce once
      self.marker.setAnimation(google.maps.Animation.BOUNCE);
      self.marker.setAnimation(null);
      
      var content = '<div><strong>'+result+'</div>';
                     
      infoWindow.setContent(content);
      infoWindow.open(this.map, self.marker);
    });
  },
  
  //animates into view the tab to perform another search
  displayBackTab: function() {
    this.container.after('<a href="#" class="back-arrow"><span class="new-search">new search</span>^</a>');
    $('.back-arrow').animate({top: '-35px'});
    $('.back-arrow').on('click', this.replay.bind(this));
    $('.back-arrow').on('mouseenter', this.showNewSearch.bind(this, 0));
  },
  
  showNewSearch: function(pos, speed) {
    $('.back-arrow').animate({top: pos}, speed);
    
    
  },
  
  //positions form back into view, clearing 
  //form and map of prior search
  replay: function(e) {
    e.preventDefault();
    
    $('.back-arrow').animate({top: '-100px'}, function() {
      $('.back-arrow').remove();
    });
    
    var height = this.container.height();
    //position form and fade in map
    
    //hide form and show map
    this.container.animate({top: 0});
    $('#map-canvas').animate({top: 0});
    
    //animate prior result and clear it from DOM
    $('.result').animate({bottom: '-38px'}, 1000, function() {
      $('.result').remove();
    });
    
    this.clearForm();
    
    //show new map cleared of prev markers 
    this.initializeMap();
  },
  
  //clears form of prior input
  clearForm: function() {
    $('input').each(function(i,input) { $(input).val(''); });
  }
  
})