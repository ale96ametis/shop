function Item(data){
  this.id = ko.observable(data._id);
  this.name = ko.observable(data.name);
  this.price = ko.observable(data.price);
  this.save = function() {
    $.ajax("/api/store", {
        data: ko.toJSON({
          name: this.name,
          price: this.price
         }),
        type: "post", contentType: "application/json",
        success: function(result) { console.log('Saved') }
    });
  }
  this.remove = function() {
    $.ajax("/api/store", {
        data: ko.toJSON({
          id: this.id
         }),
        type: "delete", contentType: "application/json",
        success: function(result) { console.log('Removed') }
    });
  }
  this.modify = function() {
    var url = "/api/store/" + this.id();
    $.ajax(url, {
        data: ko.toJSON(
          { name: this.name, price: this.price}
        ),
        type: "put", contentType: "application/json",
        success: function(result) { console.log('Modified') }
    });
  }
}
var myViewModel = function() {
  var self = this;
  self.items = ko.observableArray([]);
  self.itemName = ko.observable();
  self.itemPrice = ko.observable();
  $.getJSON("/api/store", function(allData) {
    var mappedTasks = $.map(allData, function(item) { return new Item(item) });
    self.items(mappedTasks);
  });
  self.save = function() {
    for (var i=0; i < self.items().length; i++){
      if (!self.items()[i].id()) self.items()[i].save();
    }
  };
  self.removeItem = function(item) {
    self.items.destroy(item);
    item.remove();
  }
  self.addItem = function() {
    var data =
        {
            name : self.itemName(), price : self.itemPrice()
        }; // prepare request data
    self.items.push(new Item(data));
    self.save();
    self.itemName('');
    self.itemPrice('');
  }
  self.modifyItem = function(item) {
    item.modify();
  }
}
ko.applyBindings(new myViewModel());
