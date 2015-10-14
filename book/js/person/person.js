(function (app, $, Backbone) {

    app.person = {};

    var Person = Backbone.Model.extend({
        defaults: {
            'name' : '',
            'surname' : '',
            'age' : '',
            'phone' : '',
            'email' : '',
            'photo' : '',
            'category' : ''
            //friend, job, family, new, other
        },
        initialize : function(){
            this.on("add",this.onAdd);
        },
        onAdd : function(){
            this.save();
        }
    });

    var Persons = Backbone.Collection.extend({
        model: Person,
        localStorage: new Backbone.LocalStorage("persons"),
        initialize : function(){
            if(!localStorage.getItem("persons")) {
                var userDetails = {
                    name : "John",
                    surname : "Smith",
                    age : "23",
                    category : "other",
                    phone : "666 555 222",
                    email : "test@google.pl",
                    photo : "img/icon1.png"
                };
                var userDetails2 = {
                    name : "Thomas",
                    surname : "Wolsburg",
                    age : "45",
                    category : "job",
                    phone : "765 222 345",
                    email : "test@deutch.pl",
                    photo : "img/icon2.png"
                };
                var user = new Person(userDetails);
                this.add(user);
                var user2 = new Person(userDetails2);
                this.add(user2);
            } else {
                this.fetch();
            }
        }
    });

    app.on('start', function () {
        app.person.model = Person;
        app.person.collection = new Persons();

        app.person.collection.comparator = "name";
        app.person.collection.sort({sort: true});
    });

}(app, jQuery, Backbone));

(function (app, $, Backbone) {

    var PersonAddButton = Backbone.View.extend({
        el : '#top .col-md-4',
        template : _.templateFromUrl("js/template/addButton.html"),
        render : function(){
            var that = this;
                template = this.template({lang : app.lang.choose});

            this.$el.html(template);
        },
        initialize: function () {
            this.render();
        },
        events : {
            "click #add-person" : 'showForm'
        },
        showForm : function(){
            app.person.clearUserForm();
            app.person.userForm = new app.person.addUserForm({id : null});
            $('#person').modal('show');
        }
    });

    app.on('start', function () {
        app.person.personAddButton = PersonAddButton;
    });

}(app, jQuery, Backbone));


(function (app, $, Backbone) {
    var PersonAddUserForm = Backbone.View.extend({
        el : '#header',
        template : _.templateFromUrl("js/template/addUserForm.html"),
        render : function(options){
            var that = this;
                model = (options.id != null ? app.person.collection.get(options.id).toJSON() : null),
                template = this.template({person : model,lang : app.lang.choose});

            this.$el.find(".modal .modal-content").html(template);
        },
        initialize: function (options) {
            this.render(options);
        },
        events : {
            "submit .user-form" : "addUser",
            "click .user-form .cancel" : "cancelForm",
            "click .user-form .close" : "cancelForm"
        },
        addUser : function(e){
            var $this = $(e.currentTarget),
                userDetails = $this.serializeObject(),
                user = new app.person.model(userDetails),
                id = $(e.currentTarget).data("id"),
                model,
                $error = $this.find(".error"),
                check = true;

            $this.find("input[type='text'],select").each(function(){
                if($(this).val() == ""){
                    check = false;
                    $error.fadeIn();
                    setTimeout(function(){$error.fadeOut();},3000);
                }
            });

            if(check){
                if(id != ''){
                    model = app.person.collection.get(id);
                    model.set(userDetails)
                    model.save();
                } else {
                    app.person.collection.add(user);
                }

                app.router.navigate('' , {trigger:true});
                app.person.refreshListView();

                $('#person').modal('hide');

                app.trigger('refresh-categories');
            }

            e.preventDefault();
        },
        cancelForm : function(){
            app.router.navigate('' , {trigger:true});
        }
    });

    var clearUserForm = function(){
        if(app.person.userForm != null){
            app.person.userForm.$el.off('submit', '.user-form');
        }
    };

    app.on('start', function () {
        app.person.addUserForm = PersonAddUserForm;
        app.person.clearUserForm = clearUserForm;
        app.person.userForm = null;

        new app.person.personAddButton();
    });

}(app, jQuery, Backbone));

(function (app, $, Backbone) {

    var viewList;

    var PersonsListView = Backbone.View.extend({
        el : '.listView',
        template : _.templateFromUrl("js/template/personsView.html"),
        render : function(options){
            var that = this,
                collection = (typeof options !== "undefined" ? options.collection : app.person.collection.toJSON()),
                template = this.template({persons : collection, lang : app.lang.choose});

            this.$el.html(template);
        },
        initialize: function (options) {
            this.render(options);
        },
        events : {
            "click .editUser" : "showPopup",
            "click .delete" : "delete"
        },
        showPopup : function(e){
            $("#person").modal("show");
        },
        delete : function(e){
            var $this = $(e.currentTarget),
                id = $this.data('id'),
                model = app.person.collection.get(id);

            if (confirm('Czy na pewno chcesz usunąć tą osobe?')) {
                model.destroy({success: function(model, response) {
                    app.person.collection.remove(this);
                }});

                app.person.refreshListView();
                app.trigger('refresh-categories');
            } else {
                // Do nothing!
            }
        }
    });

    var RefreshListView = function(){
        viewList.$el.off('click', '.editUser');
        viewList.$el.off('click', '.delete');
        viewList = new app.person.personListView();
    };

    app.on('start', function () {
        app.person.personListView = PersonsListView;
        app.person.refreshListView = RefreshListView;

        viewList = new app.person.personListView();

        app.on('edit-person', function (id) {
            app.person.clearUserForm();
            app.person.userForm = new app.person.addUserForm({id : id});
        });

    });

}(app, jQuery, Backbone));