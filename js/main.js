require([
    'backbone',
    'app',
    'modules/utils/scrolling',
    'modules/utils/backstrip'
  ], function(Backbone, App, Scrolling, BackStrip) {
    (function() {

      var proxiedSync = Backbone.sync;

      Backbone.sync = function(method, model, options) {
        options || (options = {});

          if (!options.crossDomain) {
            options.crossDomain = true;
          }

          if (!options.xhrFields) {
            options.xhrFields = {withCredentials: true};
          }

          return proxiedSync(method, model, options);
      };
    })();

    var user = new App.User.model();
    App.User.init(user)
    // var userview = new App.User.view({model: user});
    var Router = App.Router.extend({ user: user });
    var router = new Router();
    
    Backbone.history.start({ pushState: false });
    Scrolling.initialize();

    // BackStrip.initialize()
  }
)