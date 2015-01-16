define([
		'jquery',
		'underscore',
		'backbone',
		'controller'
	],
	function($, _, Backbone, Controller) {
		var Router = Backbone.Router.extend({
			listener: new Backbone.View(),

			requireLogin: function(action) {
				if (this.user.loggedIn()) {
					action.success()
				} else {
					action.error === undefined ?
						this.navigate('!/signin/', {trigger: true, replace: true})
						:
						action.error()
				}
			},

			ifLogged: function (callback) {
				this.requireLogin({success: callback, error: function() {}})
			},

			routes: {
				'!/books(/p:page)(/)':       'books',
				'!/books/:id(/)':            'book',
				'!/questions(p:page)(/)':    'questions',
				'!/questions/:id(/)':        'question',
				'!/signin(/)':               'signin',
				'!/signout(/)':              'signout',
				'!/users/:id(/)':            'user',
				'!/favorites(/)':  	         'favorites',
				'!/users/:id/favorites(/)':  'favorites',
				'!/test(/)':                 'test',
				'*path':                     'root'
			},

			root: function() {
				this.navigate('!/books', true)
			},

			books: function(page) {
				Controller.view('books', page)
			},

			book: function(id) {
				Controller.view('book', {'id': id})
			},

			questions: function(page) {
				Controller.view('questions', page)
			},

			question: function(id) {
				Controller.view('question', {'id': id})
			},

			signin: function() {
				Controller.view('signin')
			},

			signout: function() {
				this.user.logOut()
				Backbone.trigger('signout')
				this.navigate('!/books/', true)
			},

			user: function() {
				Controller.view('user', this.user.id)
			},

			favorites: function() {
				Controller.view('favorites', this.user.id)
			},

			test: function() {
				Controller.view('test')
				// this.requireLogin({
				// 	success: function() {
				// 		Controller.view('test', 'loggedIn')
				// 	}
				// })
			},

			initialize: function() {
				var that = this
				Controller.signed = this.user.loggedIn()

				var openBook = function(obj) {
					that.navigate('!/books/' + obj.model.get('id') + '/', true)
				}
				var openQuestion = function(obj) {
					that.navigate('!/questions/' + obj.model.get('id') + '/', true)
				}
				var signIn = function(id) {
					Controller.userId = id
					Backbone.history.history.back()
				}
				var toggleFavorite = function(obj) {
					console.log('toggleFavorite')
					that.user.toggleFavorite(obj.model.get('id'))
				}
				var back = function() {
					console.log('BACK')
					Backbone.history.back()
				}

				var eventHandler = {
					'book:open':					openBook,
					'book:toggleFavorite': 			toggleFavorite,
					'question:open': 				openQuestion,
					'signin:success': 				signIn,
					'backstrip':                    back
				}

				for (var event in eventHandler) {
					that.listener.listenTo(Backbone, event, eventHandler[event])
				}
			}
		})

		return Router
	}
);
