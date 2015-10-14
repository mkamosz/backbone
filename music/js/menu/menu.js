(function (app, $, Backbone) {

    var view;

    var MenuView = Backbone.View.extend({
        el : ".left .icons-menu",
        template : _.templateFromUrl("js/template/menu.html", {}),
        initialize : function(){
            if(typeof view !== "undefined"){
                ClearBind();
            };
            this.collection = app.tracks.collection;
            this.render();
        },
        render : function(){
            var template = this.template;

            this.$el.html(template({categories : this.categories()}))
        },
        events : {
            "click .accordion > a" : "accordion",
            "click .category li" : "showCategoryResult",
            "click .favorite" : "favorite",
            "click .all" : "all"
        },
        accordion : function(e){
            var $this = $(e.currentTarget),
                $list = $this.parent().find("ul");

            $list.slideToggle();

            e.preventDefault();
        },
        favorite : function(e){

            var collection = this.collection.where({favorite: "1"});
            new app.tracks.view({txt: {title: "Favorite tracks"}, collection: collection});

            e.preventDefault();
        },
        all : function(e){
            new app.tracks.view({txt: {title: "All tracks"}, collection: this.collection.models});

            e.preventDefault();
        },
        categories : function(){

            var categories = [],
                counts = {},
                category = [],
                collection = this.collection.models;
                //collection = (this.collection instanceof Backbone.Collection ? this.collection.models : this.collection);

            for(var key in collection) {
                category.push(collection[key].attributes.category);
            }

            category = category.sort();
            //remove duplicates
            for (var i = 0; i < category.length; i++) {
                counts[category[i]] = 1 + (counts[category[i]] || 0);
            }
            //creat object with title and counter
            for( var i in counts ) {
                if (counts.hasOwnProperty(i)){
                    categories.push({ title : i, counter : counts[i]});
                }
            }
            return categories;
        },
        showCategoryResult : function(e){
            var $this = $(e.currentTarget),
                catName = $this.find("a").data("category"),
                collection = [];


            for (var key in this.collection.models) {
                if (this.collection.models[key].attributes.category == catName) {
                    collection.push(this.collection.models[key]);
                }
            }

            new app.tracks.view({ txt: {title: "Category '"+catName+"' tracks"}, collection : collection });

            e.preventDefault();
        }
    });

    var ClearBind = function(){
        view.$el.off('click', '.accordion > a');
        view.$el.off('click', '.category li');
        view.$el.off('click', '.favorite');
        view.$el.off('click', '.all');

    };


    app.on('data-ready', function () {
        app.menu = {
            view : MenuView
        };

        view = new MenuView();
    });

    app.on('refresh-categories', function () {
        view = new MenuView();
    });

}(app, jQuery, Backbone));