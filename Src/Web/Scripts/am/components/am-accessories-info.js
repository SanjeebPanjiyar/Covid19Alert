import Vue from "vue";
import axios from "axios";
import form from "../../core/mixins/form";
import amform from "../../core/mixins/amFormWithActionType";

Vue.component("am-accessories-info", {

    mixins: [form, amform],

    props: {
        measurements: Array,
        countries: Array,
        actions : Array,
        supplierinfos : Array,
        currencies: Array,
        importlcs: Array,
        origins: Array,
        accessorieslist: Array
    },

    data() {
        return {
            supplierlist: this.supplierinfos,
            supplierId: null,
            accessories: this.accessorieslist,
            accessoriesId: null,
            lcList: {},
            services: {
                create: "/AMAccessoriesInfo/Create",
                read: "/AMAccessoriesInfo/Read",
                update: "/AMAccessoriesInfo/Update",
                delete: "/AMAccessoriesInfo/Delete",
                getHistory: "/AMAccessoriesInfo/GetHistory",
                deleteHistory: "/AMAccessoriesInfo/DeleteHistory",
                defaultModel: "/AMAccessoriesInfo/GetDefaultModel",
                getsupplierlist: "/SupplierInfo/GetSupplierList",
                getsupplier: "/SupplierInfo/GetSupplierInfo?supplierId=",
                getaccessories: "/AMAccessoriesInfo/GetAccessories?accessoriesId=",
                getaccessorieslist: "/AMAccessoriesInfo/GetAccessoriesList"
            }
        };
    },

    computed: {
        filteredList() {
            const vm = this;

            if (vm.filterBy) {
                return vm.list.filter(x => x.AccessoriesID.toString().toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.SupplierName.includes(vm.filterBy.toLowerCase().trim()));
            }

            return vm.list;
        }
    },


    mounted() {
        this.lcOrigin();
    },

    methods: {

        selectaccessories() {
            const vm = this;
            if (vm.accessoriesId.length > 0) {
                axios.get(vm.services.getaccessories + vm.accessoriesId).then(response => {
                    Vue.set(vm.model, "HSID", response.data.HSID);
                    Vue.set(vm.model, "HSDescription", response.data.HSDescription);
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
                Vue.set(vm, "supplierlist", response.data);
            }).catch((error) => {
                console.log(error.data);
            });

            axios.get(vm.services.getaccessorieslist).then(response => {
                Vue.set(vm, "accessories", response.data);
            }).catch((error) => {
                console.log(error.data);
            });
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

        select(item) {
            const vm = this;
            Vue.set(vm, "model", { ...item });
            Vue.set(vm, "selectedItem", { ...item });
            vm.handleReplaceAction(vm.model);

            if (vm.model.IsLocal) {
                var lcOrigin = vm.importlcs.filter(x => x.IsLocal === vm.model.IsLocal);
                Vue.set(vm, "lcList", lcOrigin);
            }
        },

        lcOrigin() {
            const vm = this;
            if (vm.model.IsLocal) {
                Vue.set(vm.model, "ImportLCNo", null);
                var lcOrigin = vm.importlcs.filter(x => x.IsLocal === vm.model.IsLocal);
                Vue.set(vm, "lcList", lcOrigin);
            }
            else {
                Vue.set(vm.model, "ImportLCNo", null);
                Vue.set(vm, "lcList", vm.importlcs);
            }
        }
    }
});
