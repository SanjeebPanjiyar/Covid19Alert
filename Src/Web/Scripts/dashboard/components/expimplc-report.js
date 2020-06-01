import Vue from "vue";
import axios from "axios";

Vue.component("expimplc-report", {

    props: {
        lcTypes: Array
    },
    data() {
        return {
            args: {
                //trackingNumber: "",
                selectedLCType: ""
            },
            services: {
                getResult: "/LCDetails/GetResult"
            },
            lcType: null,
            factoryName: null,
            udLCRecord: {},
            amLCRecordList: []
        };
    },

    created() {
        this.$options.lcTypes = this.lcTypes;
        this.$options.args = this.args;
    },

    mounted() {

        let uri = window.location.search.substring(1);
        let params = new URLSearchParams(uri);
        let trackingNumber = params.get("trackingNumber");
        let lcTypen = params.get("lcType");
        console.log(params.get("trackingNumber"));
        console.log(params.get("lcType"));

        const vm = this;
        if (trackingNumber) {
            axios.get(`${vm.services.getResult}?trackingNumber=${trackingNumber}&lcType=${lcTypen}`)
                .then(response => {
                    if (response.data.UDLCRecord) {
                        Vue.set(vm, "udLCRecord", response.data.UDLCRecord);
                    }
                    if (response.data.AMInfo) {
                        Vue.set(vm, "amLCRecordList", response.data.AMInfo);
                    }
                    if (response.data.LCType) {
                        Vue.set(vm, "lcType", response.data.LCType);
                    }
                    if (response.data.FactoryName) {
                        Vue.set(vm, "factoryName", response.data.FactoryName);
                    }
                })
                .catch((error) => {

                    vm.$bvModal.msgBoxOk(error.response.data, {
                        okVariant: "danger",
                        centered: true,
                        hideHeaderClose: false,
                        size: 'sm',
                        footerClass: "p-2"
                    });
                    Vue.set(vm, "udLCRecord", {});
                    Vue.set(vm, "amLCRecordList", []);
                    Vue.set(vm, "lcType", null);
                });
        }
        else {
            const vm = this;
            vm.$bvModal.msgBoxOk("Please input a tracking number", {
                okVariant: "danger",
                centered: true,
                hideHeaderClose: false,
                size: 'sm',
                footerClass: "p-2"
            });
        }
    },

    methods: {

    }
});