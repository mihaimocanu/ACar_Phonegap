var EmployeeView = function (employee) {

    function initMap() {
        var latLong = new google.maps.LatLng(46.5, 24.5);
        var mapOptions = {
            center: latLong,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("geolocation"), mapOptions);
    }

    this.initialize = function () {
        this.el = $('<div/>');
        this.el.on('click', '.add-location-btn', this.addLocation);
        this.el.on('click', '.add-contact-btn', this.addToContacts);
        this.el.on('click', '.change-pic-btn', this.changePicture);
        //window.ready = initMap;
        window.ondevicemotion = function () {
            var emp = employee;
            var latLong = new google.maps.LatLng(employee.lat, employee.long);
            var mapOptions = {
                center: latLong,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("geolocation"), mapOptions);
            var marker = new google.maps.Marker({
                position: latLong,
                title: "My MArker2",
                map: map,
                //url: "/#employees/2",
                icon: new google.maps.MarkerImage(
                    "img/"+employee.firstName+"_"+employee.lastName+".jpg", // reference from your base
                    new google.maps.Size(56, 56), // size of image to capture
                    new google.maps.Point(0, 0), // start reference point on image (upper left)
                    new google.maps.Point(10, 10), // point on image to center on latlng (scaled)
                    new google.maps.Size(35, 35) // actual size on map
                )
            });
        }

        //$(document).on("pagebeforeshow", function() {
        //    alert("Here"); //this will get the active page id (like #page1)
        //});​
    };

    this.render = function () {
        this.el.html(EmployeeView.template(employee));

       

        return this;
    };

    this.addToContacts = function (event) {
        event.preventDefault();
        console.log('addToContacts');
        if (!navigator.contacts) {
            app.showAlert("Contacts API not supported", "Error");
            return;
        }
        var contact = navigator.contacts.create();
        contact.name = { givenName: employee.firstName, familyName: employee.lastName };
        var phoneNumbers = [];
        phoneNumbers[0] = new ContactField('work', employee.officePhone, false);
        phoneNumbers[1] = new ContactField('mobile', employee.cellPhone, true); // preferred number
        contact.phoneNumbers = phoneNumbers;
        contact.save();
        return false;
    };

    this.changePicture = function (event) {
        event.preventDefault();
        if (!navigator.camera) {
            app.showAlert("Camera API not supported", "Error");
            return;
        }
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
            encodingType: 0     // 0=JPG 1=PNG
        };

        navigator.camera.getPicture(
            function (imageData) {
                $('.employee-image', this.el).attr('src', "data:image/jpeg;base64," + imageData);
            },
            function () {
                app.showAlert('Error taking picture', 'Error');
            },
            options);

        return false;
    };


    this.addLocation = function (event) {
        event.preventDefault();
        console.log('addLocation');
        navigator.geolocation.getCurrentPosition(
            function (position) {
                //$('.location', this.el).html(position.coords.latitude + ',' + position.coords.longitude);
                var longitude = position.coords.longitude;
                var latitude = position.coords.latitude;
                console.log(longitude);
                console.log(latitude);
                var latLong = new google.maps.LatLng(latitude, longitude);
                var latLong2 = new google.maps.LatLng(46.5, 24.5);
                var mapOptions = {
                    center: latLong,
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map(document.getElementById("geolocation"), mapOptions);
                var marker = new google.maps.Marker({
                    position: latLong,
                    title: "My MArker",
                    map:map
                });
                var marker2 = new google.maps.Marker({
                    position: latLong2,
                    title: "My MArker2",
                    map: map,
                    url:"/#employees/2",
                    icon: new google.maps.MarkerImage(
                        "img/Toby_Flenderson.jpg", // reference from your base
                        new google.maps.Size(36, 36), // size of image to capture
                        new google.maps.Point(0, 0), // start reference point on image (upper left)
                        new google.maps.Point(10, 10), // point on image to center on latlng (scaled)
                        new google.maps.Size(20, 20) // actual size on map
                    )
                });
                google.maps.event.addListener(marker2, 'click', function () {
                    //alert('go to ' + this.url);
                    window.location.href = this.url;
                });
            },
            function () {
                alert('Error getting location');
            });
        return false;
    };

    this.initialize();
    //google.maps.event.addDomListener(window, "onload", initMap);
    
}

EmployeeView.template = Handlebars.compile($("#employee-tpl").html());