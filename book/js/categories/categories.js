(function (app, $, Backbone) {

    var tmpCollection,
        view;

    var CategoriesView = Backbone.View.extend({
        el : '.categories',
        template : _.templateFromUrl("js/template/categories.html", {}),
        collection : null,
        render : function(){
            var that = this,
                template = this.template;

            this.$el.html(template({categories : this.categories(this.collection),counterAll : app.person.collection.length, lang : app.lang.choose}));
        },
        initialize : function(options){
            this.render();
            this.collection = options.collection;
        },
        categories : function(){

            var categories = [],
                counts = {},
                category = [];

            for(var key in this.collection) {
                category.push(this.collection[key].attributes.category);
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
        events : {
            "click li" : "showCategory"
        },
        showCategory : function(e){
            var $this = $(e.currentTarget),
                catName = $this.find("a").data("category"),
                collection = [];

            for(var key in this.collection) {
                if(this.collection[key].attributes.category == catName){
                    collection.push(this.collection[key]);
                }
            }

            $this.parent().find("li").removeClass("active");
            $this.addClass("active");

            if(catName == 'all'){
                new app.person.personListView({collection : app.person.collection.toJSON() });
            } else {
                new app.person.personListView({collection : _.map( collection, function( model ){ return model.toJSON(); } ) });
            }
        }
    });

    app.on('refresh-categories', function (collection) {
        view.$el.off('click', 'li');
        if(typeof collection !== "undefined"){
            view = new app.categories.categoriesView({collection : collection});
        } else {
            view = new app.categories.categoriesView({collection : app.person.collection.models});
        }
    });

    app.on('start', function () {
        app.categories = {
            categoriesView : CategoriesView
        };
        view = new app.categories.categoriesView({collection : app.person.collection.models});

    });

}(app, jQuery, Backbone));