var app = {

    //findByName: function() {
    //    var self = this;
    //    this.store.findByName($('.search-key').val(), function (employees) {
    //        $('.employee-list').html(self.employeeLiTpl(employees));
    //    });
    //},

    showAlert: function (message, title){
        if(navigator.notification){
            navigator.notification.alert(message, null, tile, 'OK');
        } else {
            alert(title? (title+": "+message):message);
        }
    },

    //renderHomeView: function(){
    //    $('body').html(this.homeTpl());
    //    $('.search-key').on('keyup', $.proxy(this.findByName, this));
    //},

    route: function() {
        var self = this;
        var hash = window.location.hash;
        if (!hash) {
            if (this.homePage) {
                this.slidePage(this.homePage);
            } else {
                this.homePage = new HomeView(this.store).render();
                this.slidePage(this.homePage);
            }
            return;
        }
        var match = hash.match(this.detailsURL);
        if (match) {
            this.store.findById(Number(match[1]), function (employee) {
                self.slidePage(new EmployeeView(employee).render());
            });
        }
    },

    registerEvents: function () {
        var self = this;
        // Check of browser supports touch events...
        if (document.documentElement.hasOwnProperty('ontouchstart')) {
            // ... if yes: register touch event listener to change the "selected" state of the item
            $('body').on('touchstart', 'a', function (event) {
                $(event.target).addClass('tappable-active');
            });
            $('body').on('touchend', 'a', function (event) {
                $(event.target).removeClass('tappable-active');
            });
        } else {
            // ... if not: register mouse events instead
            $('body').on('mousedown', 'a', function (event) {
                $(event.target).addClass('tappable-active');
            });
            $('body').on('mouseup', 'a', function (event) {
                $(event.target).removeClass('tappable-active');
            });
        }
        $(window).on('hashchange', $.proxy(this.route, this));
    },

    slidePage: function (page) {

        var currentPageDest,
            self = this;

        // If there is no current page (app just started) -> No transition: Position new page in the view port
        if (!this.currentPage) {
            $(page.el).attr('class', 'page stage-center');
            $('body').append(page.el);
            this.currentPage = page;
            return;
        }

        // Cleaning up: remove old pages that were moved out of the viewport
        $('.stage-right, .stage-left').not('.homePage').remove();

        if (page === app.homePage) {
            // Always apply a Back transition (slide from left) when we go back to the search page
            $(page.el).attr('class', 'page stage-left');
            currentPageDest = "stage-right";
        } else {
            // Forward transition (slide from right)
            $(page.el).attr('class', 'page stage-right');
            currentPageDest = "stage-left";
        }

        $('body').append(page.el);

        // Wait until the new page has been added to the DOM...
        setTimeout(function () {
            // Slide out the current page: If new page slides from the right -> slide current page to the left, and vice versa
            $(self.currentPage.el).attr('class', 'page transition ' + currentPageDest);
            // Slide in the new page
            $(page.el).attr('class', 'page stage-center transition');
            self.currentPage = page;
        });

    },

    initialize: function () {
        var self = this;
        this.detailsURL = /^#employees\/(\d{1,})/;
        this.registerEvents();
        
        this.store = new MemoryStore(function () {
            
        });
        //this.store = window.openDatabase("test", "1.0", "Test DB", 1000000);
        //this.store.transaction(self.populateDB, self.errorCB, self.successCB);
        self.route();
        
    },
    //populateDB: function (tx) {
    //    tx.executeSql('DROP TABLE IF EXISTS DEMO');
    //    tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
    //    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
    //    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
    //},

    //errorCB: function (tx, err) {
    //    alert("Error processing SQL: "+err);
    //},

    //successCB: function () {
    //    alert("success!");
    //}


};

app.initialize();