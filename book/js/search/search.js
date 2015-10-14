(function (app, $, Backbone) {

    var tmpCollection;

    var SearchInputView = Backbone.View.extend({
        el : '#top .col-md-8',
        template : _.templateFromUrl("js/template/searchInput.html", {}),
        render : function(){
            var that = this,
                template = this.template({lang : app.lang.choose});

            this.$el.html(template);
        },
        initialize: function () {
            this.render();
        },
        events : {
            'keyup .search' : "search",
            'blur .search' : "clear"
        },
        clear : function(e){
            var $this = $(e.currentTarget);
            $this.val("");
        },
        search : function(e){
            var $this = $(e.currentTarget),
                val = $this.val(),
                collection = this.searchString(val);

            app.trigger('refresh-categories',collection);

            new app.person.personListView({collection : _.map( collection, function( model ){ return model.toJSON(); } ) });

        },
        searchString : function(str){
            var models = tmpCollection.models,
                collection = []

            for (var i = 0; i < models.length; i++) {
                var valueName = String(models[i].attributes.name).toLowerCase();
                var valueSurname = String(models[i].attributes.surname).toLowerCase();
                var valueAge = String(models[i].attributes.age).toLowerCase();
                var valuePhone = String(models[i].attributes.phone).toLowerCase();
                var valueEmail = String(models[i].attributes.email).toLowerCase();

                if(valueName.indexOf(str.toLowerCase()) > -1 || valueSurname.indexOf(str.toLowerCase()) > -1 || valueAge.indexOf(str.toLowerCase()) > -1 || valuePhone.indexOf(str.toLowerCase()) > -1 || valueEmail.indexOf(str.toLowerCase()) > -1){
                    collection.push(models[i]);
                }
            }
            return collection;
        }
    });

    app.on('start', function () {
        app.search = {
            searchInputView : SearchInputView
        };
        new app.search.searchInputView();
        tmpCollection = app.person.collection;
    });

}(app, jQuery, Backbone));