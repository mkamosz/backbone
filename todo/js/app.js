var app = {}; // create namespace for our app

var todoList;
var viewField;
var viewList;

app.modelToDo = Backbone.Model.extend({
    defaults : {
        'title' : '',
        'complete' : false
    }
});

app.collectionToDo = Backbone.Collection.extend({
    model : app.modelToDo,
    localStorage: new Backbone.LocalStorage("backbone-todo")
});

app.viewMain = Backbone.View.extend({
    el          : '#todoapp',
    container   : '<div class="row"><div class="col-md-12"></div></div>',
    initialize  : function () {
        this.$el.append(this.container);

        todoList = new app.collectionToDo();
        todoList.fetch();
        viewField = new app.viewField();
        viewList = new app.viewList();
    }
});

app.viewField = Backbone.View.extend({
    template : _.template($("#todo-field").html()),
    el : '.col-md-12',
    container   : $('<div/>').prop({ class : 'field-view' }),
    initialize  : function () {
        this.$el.append(this.container);
        this.$el = this.$el.find('.field-view');
        this.render();
    },
    render : function(){
        var that = this,
            template = that.template({});

        that.$el.html(template);
        that.input = that.$el.find("#new-todo");
    },
    events : {
        "keypress #new-todo" : "creatTask"
    },
    creatTask : function(e){
        var that = this,
            values = this.newAttributes();

        if(e.which == 13 && values.title != ''){
            var item = new app.modelToDo(values);

            todoList.add(item);
            item.save();
            app.refreshViewList()
            that.input.val('');
        }
    },
    newAttributes : function(){
        return {
            title: this.input.val().trim(),
            complete: false
        }
    }
});

app.viewList = Backbone.View.extend({
    template : _.template($("#todo-list").html()),
    el : '.col-md-12',
    container   : $('<div/>').prop({ class : 'list-view' }),
    initialize  : function () {
        this.$el.append(this.container);
        this.$el = this.$el.find('.list-view');
        this.render();
    },
    render : function(){
        var that = this,
            template = that.template({toDoList : todoList.toJSON()});

        that.$el.html(template);
        this.$el.find(".badge").html(todoList.where({complete: false}).length);
    },
    events : {
        "click .checkboxInput" : "clickCheckbox",
        "dblclick li" : "editPanel",
        "click .glyphicon-remove" : "removeItem",
        "keypress .editField" : "editTask",
        "blur .editField" : "editTask"
    },
    editTask : function(e){
        var that = this,
            $item = $(e.currentTarget),
            $parent = $item.closest("li"),
            id = $parent.data("id"),
            model = todoList.get(id);

        if(e.which == 13 || e.type == 'focusout') {
            model.set({title: $item.val().trim(), complete: model.get('complete')})
            model.save();
            $parent.removeClass("edit");
            app.refreshViewList();
        }
    },
    editPanel : function(e){
        var $item = $(e.currentTarget);
        $item.toggleClass("edit");

    },
    removeItem : function(e){

        var $item = $(e.currentTarget),
            $parent = $item.closest("li"),
            id = $parent.data("id"),
            model = todoList.get(id);

        model.destroy({success: function(model, response) {
            todoList.remove(this);
        }});

        app.refreshViewList();
    },
    clickCheckbox : function(e){
        var $item = $(e.currentTarget),
            $parent = $item.closest("li"),
            id = $parent.data("id"),
            model = todoList.get(id);

        model.set({complete: (model.get('complete') ? false : true)})
        model.save();

        $parent.toggleClass("done");

        todoList.where({complete: false});
        viewList.$el.find(".badge").html(todoList.where({complete: false}).length);
    }
});

app.refreshViewList = function(){
    viewList.$el.off('click', '.checkboxInput');
    viewList.$el.off('click', '.glyphicon-remove');
    viewList.$el.off('dblclick', 'li');
    viewList = new app.viewList();
};

var LoginView = Backbone.View.extend({
    el : "#loginForm",
    initialize : function(){
        if(typeof(Storage) !== "undefined") {
            if(localStorage.getItem("loginToDo") == "true"){
                this.$el.parent().addClass("active");
                this.$el.hide();
            } else {
                this.$el.parent().addClass("in");
            }
        } else {
            this.$el.parent().addClass("in");
        }
    },
    events : {
        "submit form" : "check"
    },
    check : function(e){
        var that = this,
            $this = $(e.currentTarget),
            loginField = $this.find("#login").val(),
            passwordField = $this.find("#password").val(),
            $error =  $this.find(".error");

        if(loginField == "demo" && passwordField == "demo"){
            that.$el.parent().removeClass("in").addClass("active");
            setTimeout(function(){that.$el.hide()},500);

            if(typeof(Storage) !== "undefined") {
                localStorage.setItem("loginToDo", "true");
            }

        } else {
            $this.addClass("error")
            setTimeout(function(){
                $this.removeClass("error")
            },5000);
        }
        e.preventDefault();
    }
});

app.login = {
    view : new LoginView()
};


var viewMain = new app.viewMain();