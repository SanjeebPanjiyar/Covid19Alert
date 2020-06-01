import Vue from "vue";
import axios from "axios";
import form from "../../core/mixins/form";

Vue.component("ud-accessories-info", {

    mixins: [form],

    props: {
        origins: Array,
        localLcNumber: Array,
        foreignLcNumber: Array,
        units: Array,
        countrys: Array,
        supplierinfos: Array,
        accessorieslist: Array
    },

    data() {
        return {
            services: {
                create: "/AccessoriesInfo/create",
                read: "/AccessoriesInfo/read",
                update: "/AccessoriesInfo/update",
                delete: "/AccessoriesInfo/delete",
                defaultModel: "/AccessoriesInfo/GetDefaultModel",
                getsupplier: "/SupplierInfo/GetSupplierInfo?supplierId=",
                getsupplierlist: "/SupplierInfo/GetSupplierList",
                getaccessories: "/AccessoriesInfo/GetAccessories?accessoriesId=",
                getaccessorieslist: "/AccessoriesInfo/GetAccessoriesList"
            },
            model: {},
            supplierlist: this.supplierinfos,
            supplierId : null,
            accessories: this.accessorieslist,
            accessoriesId : null
        };
    },

    computed: {
        filteredList() {
            const vm = this;
            if (vm.filterBy) {
                return vm.list.filter(x => x.HSID.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.SupplierName.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }
            return vm.list;
        },
        getLc() {
            var vm = this;
            if (vm.model.IsLocal === 'Y') {
                return vm.localLcNumber;
            }
            return vm.foreignLcNumber;
        }
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

        submit() {
            const vm = this;

            var confirmText = vm.selectedItem == null ? "Are you sure you want to save this information?" : "Are you sure you want to update this information?";
            var buttonText = vm.selectedItem == null ? "Save" : "Update";

            vm.$bvModal.msgBoxConfirm(confirmText, {
                okVariant: "info",
                cancelTitle: "Cancel",
                okTitle: buttonText,
                centered: true,
                hideHeaderClose: false,
                footerClass: "p-2"
            }).then(value => {
                if (value) {
                    vm.model.UseQty = parseFloat(vm.model.UseQty);
                    vm.model.Qty = parseFloat(vm.model.Qty);

                    if (isNaN(vm.model.AccessoriesID)) {
                        Vue.set(vm.model, "AccessoriesID", 1);
                    }

                    if (vm.selectedItem === null) {
                        vm.save();
                    } else {
                        vm.update();
                    }
                }
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
        }
    }
});
