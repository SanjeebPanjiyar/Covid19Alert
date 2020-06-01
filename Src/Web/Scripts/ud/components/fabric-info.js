import Vue from "vue";
import axios from "axios";
import form from "../../core/mixins/form";

Vue.component("fabric-info", {

    mixins: [form],

    props: {
        foreignImportLcs: Array,
        localImportLcs: Array,
        origins: Array,
        units: Array,
        countries: Array,
        supplierlist: Array,
        fabriclist: Array
    },

    data() {
        return {
            services: {
                create: "/fabricinfo/create",
                read: "/fabricinfo/read",
                update: "/fabricinfo/update",
                delete: "/fabricinfo/delete",
                defaultModel: "/fabricinfo/getdefaultmodel",
                getfabric: "/fabricinfo/GetFabric?fabricId=",
                getfabriclist: "/fabricinfo/GetFabricList",
                getsupplier: "/SupplierInfo/GetSupplierInfo?supplierId=",
                getsupplierlist: "/SupplierInfo/GetSupplierList"
            },
            model: {},
            supplierviewlist: this.supplierlist,
            supplierId : null,
            fabrics: this.fabriclist,
            fabricid : null
        };
    },

    computed: {
        filteredList() {
            const vm = this;

            if (vm.filterBy) {
                return vm.list.filter(x => x.FabricID.toString().toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.SupplierName.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }

            return vm.list;
        },
        importLcs() {
            const vm = this;
            if (vm.model.IsLocal == 'Y') {
                return vm.localImportLcs;
            }
            else {
                return vm.foreignImportLcs;
            }                
        }
    },
    methods: {
        selectfabric() {
            const vm = this;
            if (vm.fabricid.length > 0) {
                axios.get(vm.services.getfabric + vm.fabricid).then(response => {
                    Vue.set(vm.model, "HSID", response.data.HSID);
                    Vue.set(vm.model, "HSDescription", response.data.HSDescription);
                }).catch((error) => {
                    console.log(error.data);
                });
            }
        },

        selectsupplier() {
            const vm = this;
            if (vm.supplierId.length > 0) {
                axios.get(vm.services.getsupplier + vm.supplierId).then(response => {
                    Vue.set(vm.model, "SupplierName", response.data.SupplierName);
                    Vue.set(vm.model, "SupplierAddress", response.data.SupplierAddress);
                    Vue.set(vm.model, "CountryID", response.data.CountryID);
                    Vue.set(vm.model, "PhoneNo", response.data.PhoneNo);
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

            axios.get(vm.services.getsupplierlist).then(response => {
                Vue.set(vm, "supplierviewlist", response.data);
            }).catch((error) => {
                console.log(error.data);
            });

            axios.get(vm.services.getfabriclist).then(response => {
                Vue.set(vm, "fabrics", response.data);
            }).catch((error) => {
                console.log(error.data);
            });
        },
        resetnew() {
            //new reset function for clear all the model data
            const vm = this;
            vm.$refs.observer.reset();
            Vue.set(vm, "model", {});
            Vue.set(vm, "selectedItem", null);
            Vue.set(vm, "supplierId", null);
        }
    }
});
