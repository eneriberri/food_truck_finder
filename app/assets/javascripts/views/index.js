FoodTruckFinder.Views.Index = Backbone.View.extend({
  template: JST['index'],
  
  events: {
    'click button': 'findFood'
  },

  render: function() {
    var renderedHTML = this.template({trucks: this.collection});
    console.log(this.collection);
    this.$el.html(renderedHTML);
    return this;
  },
  
  findFood: function(e) {
    e.preventDefault();
    console.log('yes');
  }
})