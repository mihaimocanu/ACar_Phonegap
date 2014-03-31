var HomeView = function (store) {
    var gMap = "";
    var markers = [];
    this.render = function () {
        this.el.html(HomeView.template());
        return this;
    };

    this.findByName = function () {
        store.findByName($('.search-key').val(), function (employees) {
            // clear old markers
            var k = markers.length;
            if (k > 0) {
                for (var j = 0; j < markers.length; j++) {
                    markers[j].setMap(null);
                }
                markers = [];
            }

            // add new markers
            for (var i = 0; i < employees.length; i++) {
                var latLong = new google.maps.LatLng(employees[i].lat, employees[i].long);
                var marker = new google.maps.Marker({
                    position: latLong,
                    title: employees[i].firstName + " " + employees[i].lastName,
                    map: gMap,
                    url: "/#employees/" + employees[i].id,
                    icon: new google.maps.MarkerImage(
                        "img/" + employees[i].firstName + "_" + employees[i].lastName + ".jpg", // reference from your base
                        new google.maps.Size(56, 56), // size of image to capture
                        new google.maps.Point(0, 0), // start reference point on image (upper left)
                        new google.maps.Point(10, 10), // point on image to center on latlng (scaled)
                        new google.maps.Size(35, 35) // actual size on map
                    )
                });
                google.maps.event.addListener(marker, 'click', function () {
                    //alert('go to ' + this.url);
                    window.location.href = this.url;
                });
                markers.push(marker);
            }

            //$('.employee-list').html(HomeView.liTemplate(employees));
            //if (self.iscroll) {
            //    console.log('Refresh iScroll');
            //    self.iscroll.refresh();
            //} else {
            //    console.log('New iScroll');
            //    self.iscroll = new iScroll($('.scroll', self.el)[0], { hScrollbar: false, vScrollbar: false });
            //}
        });
        //store.transaction(this.queryDB, this.errorCB);

    };
    //this.queryDB=function(tx) {
    //    tx.executeSql('SELECT * FROM DEMO', [], this.querySuccess);
    //}
    //this.errorCB=function(err) {
    //    console.log("Error processing SQL: " + err.code);
    //}
    //this.querySuccess=function(tx, results) {
    //    console.log("Insert ID = " + results.rows.length);
    //}

    this.initialize = function () {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div/>');
        this.el.on('keyup', '.search-key', this.findByName);

        window.ondevicemotion = function () {
            //var emp = employee;
             
            var latLong = new google.maps.LatLng(46.545556, 24.562500000000004);
            var mapOptions = {
                center: latLong,
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            gMap = new google.maps.Map(document.getElementById("geolocationHome"), mapOptions);
            this.el.on('keyup', '.search-key', this.findByName);
            //var marker = new google.maps.Marker({
            //    position: latLong,
            //    title: "My MArker2",
            //    map: map,
            //    //url: "/#employees/2",
            //    icon: new google.maps.MarkerImage(
            //        "img/" + employee.firstName + "_" + employee.lastName + ".jpg", // reference from your base
            //        new google.maps.Size(56, 56), // size of image to capture
            //        new google.maps.Point(0, 0), // start reference point on image (upper left)
            //        new google.maps.Point(10, 10), // point on image to center on latlng (scaled)
            //        new google.maps.Size(35, 35) // actual size on map
            //    )
            //});
        }

    };

    this.initialize();

}

HomeView.template = Handlebars.compile($("#home-tpl").html());
HomeView.liTemplate = Handlebars.compile($("#employee-li-tpl").html());