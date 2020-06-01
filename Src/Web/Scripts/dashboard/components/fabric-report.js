import Vue from "vue";
import axios from "axios";

Vue.component("fabric-report", {

    data() {
        return {
            list: null
        };
    },

    created() {
        

    },

    mounted() {

        let uri = window.location.search.substring(1);
        let params = new URLSearchParams(uri);
        let trackingNumber = params.get("trackingNumber");
        console.log(params.get(trackingNumber));
        
        const vm = this;

        axios.get('/fabricrecord/getresult?trackingNumber=' + trackingNumber).then(response => {
            Vue.set(vm, "list", response.data);
        }).catch((error) => {
            vm.$bvModal.msgBoxOk(error.response.data, {
                okVariant: "danger",
                centered: true,
                hideHeaderClose: false,
                size: 'sm',
                footerClass: "p-2"
            });
            Vue.set(vm, "list", null);
        });
    },

    methods: {

    }
});