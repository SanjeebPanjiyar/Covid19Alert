import Vue from "vue";
import axios from "axios";
import form from "../../core/mixins/form";
import { format } from "date-fns";
import { integer } from "vee-validate/dist/rules";

Vue.component("other-material", {

    mixins: [form],

    props: {
        countries: Array,
        rawMaterialTypes: Array,
        units: Array,
        origins: Array,
        currencies: Array,
        suppliers: Array,
        udraws : Array
    },

    data() {
        return {
            isTradeNameReadonly: true,
            services: {
                read: "/othermaterial/read",
                create: "/othermaterial/create",
                update: "/othermaterial/update",
                delete: "/othermaterial/delete",
                defaultModel: "/othermaterial/getdefaultmodel",
                getraw: "/othermaterial/GetUDRaw?udRawId=",
                getrawlist: "/othermaterial/GetUDRawList",
                getsupplier: "/SupplierInfo/GetSupplierInfo?supplierId=",
                getsupplierlist: "/SupplierInfo/GetSupplierList"
            },
            model: {},
            supplierviewlist: this.suppliers,
            supplierId: null,
            raws: this.udraws,
            rawid: null
        };
    },

    computed: {
        filteredList() {
            const vm = this;

            if (vm.filterBy) {
                return vm.list.filter(x => x.UDNo.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.RawMaterialTypeName.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }

            return vm.list;
        }
    },

    methods: {

        updateModel(model) {
            const vm = this;
            Vue.set(vm, "model", model ? model : { ...vm.defaultModel });
            Vue.set(vm.model, "UDDate", format(new Date(vm.model.UDDate), "yyyy-MM-dd"));
        },

        processList(response) {
            const vm = this;
            response.data.forEach((item) => {
                item.UDDate = format(new Date(item.UDDate), "yyyy-MM-dd");
            });

            Vue.set(vm, "list", response.data);
        },

        onRawMaterialTypeChange(e) {
            const vm = this;

            if (vm.model.RawMaterialTypeID === 2) {
                vm.isTradeNameReadonly = true;
                vm.model.TradeName = "N/A";

            } else {
                vm.isTradeNameReadonly = false;
                vm.model.TradeName = " ";
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
                    vm.model.Qty = parseFloat(vm.model.Qty);
                    vm.model.MaterialValue = parseFloat(vm.model.MaterialValue);
                    var rawMaterialTypeID = vm.rawMaterialTypes.filter(x => x.RawMaterialTypeID.toString() === vm.model.RawMaterialTypeID.toString())[0].Description.substring(0, 1);
                    Vue.set(vm.model, "RawMaterialTypeName", rawMaterialTypeID);

                    if (isNaN(vm.model.OtherRawMaterialID)) {
                        Vue.set(vm.model, "OtherRawMaterialID", 0);
                        Vue.set(vm.model, "RawMaterialTypeID", 0);
                    }

                    vm.model.RawMaterialTypeID = rawMaterialTypeID.toString();

                    if (vm.selectedItem === null) {
                        vm.save();
                    } else {
                        vm.update();
                    }
                }
            });
        },

        selectRaw() {
            const vm = this;
            if (vm.rawid.length > 0) {
                axios.get(vm.services.getraw + vm.rawid).then(response => {
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

            axios.get(vm.services.getrawlist).then(response => {
                Vue.set(vm, "raws", response.data);
            }).catch((error) => {
                console.log(error.data);
            });
        }

    }
});
