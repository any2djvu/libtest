define([
		'jquery',
		'underscore',
		'backbone',
		'modules/books/main',
		'modules/questions/main',
		'headerview',
		'modules/user/main',
		'modules/utils/url'
	],
	function($, _, Backbone, BookModule, QuestionModule, HeaderView, User, Url) {
		var currentState = {}

		var Controller = {
			currentView: undefined,

			view: function(page, params) {
				console.log('Controller: ' + page)
				if (currentState.header === undefined) {
					currentState.header = new HeaderView({signed: this.signed})
				}
				$('.active').removeClass('active')

				if (this.currentView) this.currentView.remove();
				this.currentView = this[page](params)
				$('#page').html(this.currentView.render().el)
			},

			books: function(page) {
				$('#page-books').addClass('active')
				currentState.books = currentState.books ? currentState.books : new BookModule.PagedCollection()
				currentState.books.currentPage = page
				return new BookModule.PagedListView({
								collection: currentState.books
							})
			},

			book: function(book) {
				$('#page-books').addClass('active')
				var model = new BookModule.Model({'id': book.id})
				var view = new BookModule.CardView({'model': model})
				model.fetch() // ({'success': function(a) {console.log('model fetched')}})
				return view
			},

			questions: function(page) {
				$('#page-questions').addClass('active')
				currentState.questions = currentState.questions ? currentState.questions : new QuestionModule.PagedCollection()
				currentState.questions.currentPage = page
				return new QuestionModule.PagedListView({
								collection: currentState.questions
							})
			},

			question: function(question) {
				$('#page-questions').addClass('active')
				var model = new QuestionModule.Model({'id': question.id})
				var view = new QuestionModule.CardView({'model': model})
				model.fetch() //{'success': function(a) {console.log('model fetched')}})
				return view
			},

			signin: function() {
				$('#page-signin').addClass('active')
				var view = new User.signinView()
				return view
			},

			user: function() {

			},

			favorites: function(userId) {
				$('#page-favorites').addClass('active')
				var view = new BookModule.PagedListView({
					collection: new BookModule.PagedCollection([], {
						url: function() {
							return Url('favorites', userId)
						}
					})
				})
				return view
			},

			test: function(status) {
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
