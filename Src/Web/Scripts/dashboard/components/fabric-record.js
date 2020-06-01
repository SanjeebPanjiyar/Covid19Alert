import Vue from "vue";
import axios from "axios";

Vue.component("fabric-record", {

    data() {
        return {
            list: null
        };
    },
    methods: {
        getTrackingNumber(trackingNumber) {
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
        }
    }
});