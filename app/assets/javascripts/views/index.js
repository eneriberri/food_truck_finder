FoodTruckFinder.Views.Index = Backbone.View.extend({
  template: JST['index'],
  
  render: function() {
    var renderedHTML = this.template;
    this.$el.html(renderedHTML);
    return this;
  }
})