FoodTruckFinder.Views.Index = Backbone.View.extend({
  template: JST['index'],

  render: function() {
    var renderedHTML = this.template({trucks: this.collection});
    console.log(this.collection);
    this.$el.html(renderedHTML);
    return this;
  }
})