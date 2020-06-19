import Vue from "vue";
import axios from "axios";

Vue.component("track-user", {

    props: ["consent"],

    data() {
        return {
            services: {
                saveLocation: "/Account/GetCountOfNearByPatients",
                setConsent: "/Account/SetConsent"
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
        Vue.set(vm, "ConsentGiven", this.consent);
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

        giveLocationPermission: function (event) {
            const vm = this;
            axios.post(vm.services.setConsent).then(response => {
                location.reload();
                //vm.reset();
            }).catch((error) => {
                console.log(error.response.data);
            });
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
                Vue.set(vm, "Count", response.data);
                //vm.reset();
            }).catch((error) => {
                Vue.set(vm, "UsernameValidationMsg", error.response.data);
                console.log(error.response.data);
            });
        }
    }
});