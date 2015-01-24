define([
		'jquery',
		'underscore',
		'backbone',
		'modules/books/main',
		'modules/questions/main',
		'modules/reviews/main',
		'headerview',
		'searchboxview',
		'modules/menu/main',
		'modules/user/main',
		'modules/utils/url',
		'modules/bookpage',
		'modules/questionpage',
		'modules/post/main'
	],
	function($, _, Backbone, BookModule, QuestionModule, ReviewModule, HeaderView, SearchView, Menu, User, Url, BookPage, QuestionPage, Post) {
		var currentState = {}

		var addMenu = function(menu, pages) {
			var models = []
			for (var i = 0; i < pages.length; ++i) {
				models.push(new Menu.Item(pages[i]))
			}
			return new Menu.View({
				collection: new Menu.Items(models, {menu: menu})
			})
		}

		var Controller = {
			currentView: undefined,

			view: function(page, params) {
				$('#sub-header').empty()

				if (currentState.header === undefined) {
					currentState.header = new HeaderView({userId: this.userId})
				}
				if (currentState.search === undefined) {
					currentState.search = new SearchView()
				}

				if (currentState.menu === undefined) {
					currentState.menu = adMenu('header', [{page: 'books'}, {page: 'questions'}])
					$('#header').html(currentState.menu.render().el)
				}

				console.log('Controller: ' + page)
				Backbone.trigger('controller:transition', {menu: 'header', page: page})


				if (currentState.subMenu) currentState.subMenu.remove();
				if (this.currentView) this.currentView.remove();
				this.currentView = this[page](params)
				$('#page').html(this.currentView.render().el)

				Backbone.trigger('menu:activate', {menu: 'sub', page: page})
				Backbone.trigger('page:rendered', {page: page, options: params})
			},
			

			//*******************************************************************************************
			books: function(page) {
				currentState.subMenu = addMenu('sub-header', [
					// {page: 'images-toggler'}, 
					{page: 'all', path: '#!/books/'}, 
					{page: 'favorites', path: '#!/books/favorites/'}, 
					{page: 'recent', path: '#!/books/recent'} 
				])
				$('#sub-header').html(currentState.subMenu.render().el)
				Backbone.trigger('controller:transition', {menu: 'sub-header', page: 'all'})

				currentState.books = currentState.books ? currentState.books : new BookModule.PagedCollection()
				currentState.books.currentPage = page || currentState.books.currentPage || 0

				return new BookModule.FramedListView({collection: currentState.books})
			},

			booksSearch: function(query) {
				currentState.subMenu = addMenu('sub-header', [
					{page: 'all', path: '#!/books/'}, 
					{page: 'favorites', path: '#!/books/favorites/'}, 
					{page: 'recent', path: '#!/books/recent'},
					{page: 'add', path: '#!/books/search/' + query, title: 'search: ' + query}
				])
				$('#sub-header').html(currentState.subMenu.render().el)
				Backbone.trigger('controller:transition', {menu: 'sub-header', page: 'add'})
				Backbone.trigger('controller:transition', {menu: 'header', page: 'books'})
				
				var collection = new BookModule.PagedCollection([], {url: 'http://beta.reslib.org/api/books/?query=' + query})
				var view = new BookModule.FramedListView({collection: collection})
				return view
			},

			booksFavorites: function(userId) {
				currentState.subMenu = addMenu('sub-header', [
					{page: 'all', path: '#!/books/'}, 
					{page: 'favorites', path: '#!/books/favorites/'}, 
					{page: 'recent', path: '#!/books/recent'} 
				])
				$('#sub-header').html(currentState.subMenu.render().el)
				Backbone.trigger('controller:transition', {menu: 'sub-header', page: 'favorites'})

				var view = new BookModule.PagedListView({
					collection: new BookModule.PagedCollection([], {
						url: function() {
							return Url('booksFavorites', userId)
						}
					})
				})
				return view
			},

			booksRecent: function(userId) {
				currentState.subMenu = addMenu('sub-header', [
					{page: 'all', path: '#!/books/'}, 
					{page: 'favorites', path: '#!/books/favorites/'}, 
					{page: 'recent', path: '#!/books/recent'} 
				])
				$('#sub-header').html(currentState.subMenu.render().el)
				Backbone.trigger('controller:transition', {menu: 'sub-header', page: 'recent'})

				var view = new BookModule.PagedListView({
					collection: new BookModule.PagedCollection([], {
						url: function() {
							return Url('booksRecent', userId)
						}
					})
				})
				return view
			},			

			bookQuestions: function(book) {
				var readButton = '<button type="button" class="btn btn-default btn-lg" style="padding-top: 4px; padding-bottom: 4px"> Read </button>'
				currentState.subMenu = addMenu('sub-header', [
					{page: 'description', path: '#!/books/' + book.id + '/'}, 
					{page: 'edit', path: '#!/books/' + book.id + '/edit'},
					{page: 'read', path: '#', title: readButton, full: true}
				])
				$('#sub-header').html(currentState.subMenu.render().el)
				Backbone.trigger('controller:transition', {menu: 'sub-header', page: 'description'})

				var collection = new QuestionModule.PagedCollection([], {
					url: function() {
						return Url('bookQuestions', book.id)
					}
				})
				var questions = new QuestionModule.FramedListView({collection: collection, listType: 'bookQuestions'})

				var view = new BookPage(book.id, questions)
				return view
			},

			bookReviews: function(book) {
				var readButton = '<button type="button" class="btn btn-default btn-lg" style="padding-top: 4px; padding-bottom: 4px"> Read </button>'

				currentState.subMenu = addMenu('sub-header', [
					{page: 'description', path: '#!/books/' + book.id + '/'}, 
					{page: 'edit', path: '#!/books/' + book.id + '/edit'},
					{page: 'read', path: '#', title: readButton, full: true}
				])
				$('#sub-header').html(currentState.subMenu.render().el)
				Backbone.trigger('controller:transition', {menu: 'sub-header', page: 'description'})

				var collection = new ReviewModule.PagedCollection([], {
					url: function() {
						return Url('bookReviews', book.id)
					}
				})
				var reviews = new ReviewModule.FramedListView({collection: collection, listType: 'bookReviews'})

				var view = new BookPage(book.id, reviews)
				return view
			},

			bookEdit: function(book) {
				currentState.subMenu = addMenu('sub-header', [
					{page: 'description', path: '#!/books/' + book.id + '/'}, 
					{page: 'edit', path: '#!/books/' + book.id + '/edit'}
				])
				$('#sub-header').html(currentState.subMenu.render().el)
				Backbone.trigger('controller:transition', {menu: 'sub-header', page: 'edit'})

				var model = new BookModule.Model({'id': book.id})
				var view = new BookModule.EditView({'model': model})
				model.fetch()
				return view
			},

			//*******************************************************************************************
			questions: function(page) {
				currentState.questions = currentState.questions ? currentState.questions : new QuestionModule.PagedCollection()
				currentState.questions.currentPage = page

				return new QuestionModule.FramedListView({collection: currentState.questions})
			},

			questionsSearch: function(query) {
				currentState.subMenu = addMenu('sub-header', [
					{page: 'all', path: '#!/questions/'}, 
					{page: 'add', path: '#!/books/search/' + query, title: 'search: ' + query}
				])
				$('#sub-header').html(currentState.subMenu.render().el)
				Backbone.trigger('controller:transition', {menu: 'sub-header', page: 'add'})
				Backbone.trigger('controller:transition', {menu: 'header', page: 'questions'})

				var collection = new QuestionModule.PagedCollection([], {url: 'http://beta.reslib.org/api/questions/?query=' + query})
				var view = new QuestionModule.FramedListView({collection: collection})
				return view
			},

			questionsFavorites: function(userId) {
				Backbone.trigger('controller:transition', {menu: 'sub-header', page: 'favorites'})
				var view = new BookModule.PagedListView({
					collection: new BookModule.PagedCollection([], {
						url: function() {
							return Url('favorites', userId)
						}
					})
				})
				return view
			},

			questionAnswers: function(question) {
				var view = new QuestionPage(question.id)
				return view

				var model = new QuestionModule.Model({'id': question.id})
				var view = new QuestionModule.CardView({'model': model})
				model.fetch()
				return view
			},

			//*******************************************************************************************
			signin: function() {
				var view = new User.signinView()
				return view
			},

			user: function() {

			},



			test: function(status) {
				return view = new Post.view()

				// var template = _.template('<h3> <%=status%> </h3>')
				// var View = Backbone.View.extend({
				// 	el: template({status: status}),
				// 	render: function() {
				// 		return this
				// 	}
				// })
				// return new View
			}
		}

		return Controller
	}
);
