import Vue from "vue";
import axios from "axios";

Vue.component("master-b2b-lc", {

    
    props: {
        
    },
    data() {
        return {
            args: {
                trackingNumber: "",
                selectedLCType:""
            },
            services: {
                getResult: "/LCDetails/GetResult"
            },
            lcType: null,
            udLCRecord: {},
            amLCRecordList:[]
        };
    },

    computed: {
        
    },

    methods: {
        clear() {
            this.args = {
                trackingNumber: "",
                selectedLCType: ""
            };
            lcType: null;
        },

        search() {
            const vm = this;

            if (vm.args.trackingNumber) {
                axios.get(`${vm.services.getResult}?trackingNumber=${vm.args.trackingNumber}&lcType=${vm.args.selectedLCType}`)
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
        }
    }
});