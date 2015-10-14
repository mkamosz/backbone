(function (app, $, Backbone) {

    var tmpCollection;

    var SearchView = Backbone.View.extend({
        el : '#header .search',
        template : _.templateFromUrl("js/template/search.html", {}),
        render : function(){
            var that = this,
                template = this.template;

            this.$el.html(template());
        },
        initialize: function () {
            this.collection = app.tracks.collection;
            this.render();
        },
        events : {
            'keyup #search' : "search",
            'focus #search' : "clear"
        },
        clear : function(e){
            var $this = $(e.currentTarget);
            $this.val("");
        },
        search : function(e){
            var $this = $(e.currentTarget),
                val = $this.val(),
                collection = this.searchString(val);

            new app.tracks.view({txt: {title: "Search '"+val+"' in all tracks"}, collection : collection });

        },
        searchString : function(str){
            var models = this.collection.models,
                collection = [];

            for (var i = 0; i < models.length; i++) {
                var valueTitle = String(models[i].attributes.title).toLowerCase();
                var valueAuthor = String(models[i].attributes.author).toLowerCase();

                if(valueTitle.indexOf(str.toLowerCase()) > -1 || valueAuthor.indexOf(str.toLowerCase()) > -1){
                    collection.push(models[i]);
                }
            }
            return collection;
        }
    });

    app.on('data-ready', function () {
        app.search = {
            searchView : SearchView
        };
        new app.search.searchView();
    });

}(app, jQuery, Backbone));