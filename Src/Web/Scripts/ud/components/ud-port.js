import Vue from "vue";
import axios from "axios";
import form from "../../core/mixins/form";

Vue.component("ud-port", {

    mixins: [form],

    props: {
        countries: Array,
        ports : Array
    },

    data() {
        return {
            services: {
                create: "/udport/create",
                read: "/udport/read",
                update: "/udport/update",
                delete: "/udport/delete",
                defaultModel: "/udport/getdefaultmodel",
                getport: "/udport/GetPort?portId=",
                getportlist: "/udport/GetPortList"
            },
            portlist: this.ports,
            portid: null
        };
    },

    computed: {
        filteredList() {
            const vm = this;

            if (vm.filterBy) {
                return vm.list.filter(x => x.PortName.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }

            return vm.list;
        }
    },
    methods: {
        selectport() {
            const vm = this;
            if (vm.portid.length > 0) {
                axios.get(vm.services.getport + vm.portid).then(response => {
                    Vue.set(vm.model, "PortName", response.data.PortName);
                    Vue.set(vm.model, "PortCountryID", response.data.PortCountryID);
                    Vue.set(vm.model, "DestinationCountryID", response.data.DestinationCountryID);
                }).catch((error) => {
                    console.log(error.data);
                });
            }
        },

        reset() {
            const vm = this;
            vm.$refs.observer.reset();
            vm.updateModel();
            Vue.set(vm, "selectedItem", null);

            axios.get(vm.services.getportlist).then(response => {
                Vue.set(vm, "portlist", response.data);
            }).catch((error) => {
                console.log(error.data);
            });
        }

    }
});
