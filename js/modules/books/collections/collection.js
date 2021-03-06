define([
    'jquery',
    'underscore',
    'backbone',
    'modules/books/models/book',
    'modules/utils/url'
  ],
  function($, _, Backbone, BookModel, Url) {
    var BooksCollection = Backbone.Collection.extend({
      model: BookModel,
      url: function() {
        return Url('books')
      },

      parse: function(response, options) {
        return response.results
      }
    })

    return BooksCollection
  }
)
