import Vue from "vue";
import axios from "axios";

Vue.component("track-user", {

    props: [consent],

    data() {
        return {
            services: {
                saveLocation: "/Account/GetCountOfNearByPatients"
            },
            model: {},
            Count: 0,
            ConsentGiven:false,
            UsernameValidationMsg: null,
            options : {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        };
    }, mounted() {
        const vm = this;
        Vue.set(vm, "model", {});
        Vue.set(vm.model, "Latitude", 0);
        Vue.set(vm.model, "Longitude", 0);
        if (vm.ConsentGiven) {
            navigator.geolocation.watchPosition((pos) => { vm.success(pos, vm) }, vm.error, vm.options);
        }  
    },

    computed: {
       
    },

    methods: {

        success(pos,vm) {
            var crd = pos.coords;
            if (vm.model.Latitude !== crd.latitude && vm.model.Longitude !== crd.longitude) {
                console.log(vm.model.Latitude, vm.model.Longitude);
                console.log(crd.latitude, crd.longitude);
                Vue.set(vm.model, "Latitude", crd.latitude);
                Vue.set(vm.model, "Longitude", crd.longitude);
                vm.saveLocation();
            }
        },

        error(err) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
        },

        handleSubmit(response) {
            
        },

        saveLocation() {
            const vm = this;
            axios.post(vm.services.saveLocation, this.model).then(response => {
                console.log(response.data);
                Vue.set(vm.model, "Count", response.data);
                //vm.reset();
            }).catch((error) => {
                Vue.set(vm, "UsernameValidationMsg", error.response.data);
                console.log(error.response.data);
            });
        }
    }
});

/*
function success(pos) {
    var crd = pos.coords;
    if (target.latitude != crd.latitude && target.longitude != crd.longitude) {
        console.log(crd.latitude, crd.longitude);
        target.latitude = crd.latitude;
        target.longitude = crd.longitude;
    }

}

function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
}

target = {
    latitude: 0,
    longitude: 0
};

options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

id = navigator.geolocation.watchPosition(success, error, options);
https://www.markopapic.com/finding-nearby-users-using-ef-core-spatial-data/
*/