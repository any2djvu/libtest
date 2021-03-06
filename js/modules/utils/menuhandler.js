define([
    'jquery',
    'underscore',
    'backbone',
  ],
  function($, _, Backbone) {
    var MenuHandler = Backbone.View.extend({
      pageMap: {
        'books':            {'header': 'books', 'books': 'all'},
        'booksRecent':      {'header': 'books', 'books': 'recent'},
        'booksFavorites':   {'header': 'books', 'books': 'favorites'},
        'booksSearch':      {'header': 'books', 'books': 'add'},
        'book':             {'header': 'add', 'book': 'description'},
        'bookEdit':         {'header': 'add', 'book': 'edit'},
        'bookReviews':      {'header': 'add', 'book': 'description', 'sub': 'bookReviews'},
        'bookQuestions':    {'header': 'add', 'book': 'description', 'sub': 'bookQuestions'},
        'questions':        {'header': 'questions'}, //, 'questions': 'all'}]
        'questionsSearch':  {'header': 'questions', 'questions': 'search'},
        'question':         {'header': 'question', 'sub': 'questionAnswers'},
        'questionAnswers':  {'header': 'question', 'sub': 'questionAnswers'}
      },

      handle: function(options) {
        options || (options = {})
        this.page = options.page || this.page

        var menus = this.pageMap[this.page]
        for (var i in menus) {
          Backbone.trigger('menu:activate', {menu: i, page: menus[i]})
        }
      },

      initialize: function() {
        this.listenTo(Backbone, 'page:rendered', this.handle)
        this.listenTo(Backbone, 'menu:refresh', this.handle)
      }
    })

    return MenuHandler
  }
)
