define([
		'jquery',
		'underscore',
		'backbone',
		'modules/menu/views/menu',
		'modules/menu/collections/items',
		'modules/menu/models/item',
	],
	function($, _, Backbone, MenuView, MenuItems, MenuItem) {
		var menuCollection = {}

		var Menu = {
			View:  MenuView,
			Items: MenuItems,
			Item:  MenuItem,

			base: '#!/books/',

			add: function(menu, pages) {
				var models = []
				for (var i = 0; i < pages.length; ++i) {
					models.push(new this.Item(pages[i]))
				}
				return new this.View({
					collection: new Menu.Items(models, {menu: menu})
				})
			},

			pages: function(menu) {
				var readButton = '<button type="button" class="btn btn-default btn-lg" style="padding-top: 4px; padding-bottom: 4px"> Read </button>'
				return {
				'header': 
						[{page: 'books'}, {page: 'questions'}],
				'books': 
						[{page: 'all', path: '#!/books/'}, 
						{page: 'favorites', path: '#!/books/favorites/'}, 
						{page: 'recent', path: '#!/books/recent'}
						],
				'book': [
						{page: 'description', path: this.base},
						{page: 'edit', path: this.base + 'edit'},
						{page: 'read', path: '#', title: readButton, full: true}
						],
				'questions':
						[{page: 'all', path: '#!/questions/'}, 
						]
				}[menu]
			},

			set: function(options) {
				options || (options = {})
				this.base = options.path || this.base
			},

			get: function(menu, addPages) {
				return this.add(menu, this.pages(menu))
				// return menuCollection[menu] || (menuCollection[menu] = Menu.add(menu, Menu.pages(menu)))
			}
		}

		return Menu
		
		// return {
		// 	'View': MenuView,
		// 	'Items': MenuItems,
		// 	'Item': MenuItem
		// }
	}
)
