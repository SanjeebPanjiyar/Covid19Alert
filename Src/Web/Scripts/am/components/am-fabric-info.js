import Vue from "vue";
import form from "../../core/mixins/form";
import axios from "axios";
import amForm from "../../core/mixins/amFormWithActionTypeId";

Vue.component("am-fabric-info", {

    mixins: [form, amForm],

    props: {
        units: Array,
        sources: Array,
        origins: Array,
        suppliers: Array,
        countries: Array,
        fabricList: Array
    },

    data() {
        return {
            services: {
                read: "/AMFabricInfo/Read",
                create: "/AMFabricInfo/Create",
                update: "/AMFabricInfo/Update",
                delete: "/AMFabricInfo/Delete",
                getHistory: "/AMFabricInfo/GetHistory",
                deleteHistory: "/AMFabricInfo/DeleteHistory",
                getImportLC: "/AMFabricInfo/GetImportLCList",
                defaultModel: "/AMFabricInfo/getdefaultmodel",
                getFabric: "/AMFabricInfo/GetFabric?fabricId=",
                getSupplier: "/SupplierInfo/GetSupplierInfo?supplierId="
            },
            model: {},
            fabricId: null,
            supplierId: null
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

        sourceCheck() {

            if (this.model.Source === 'Stock') {
                return false;
            }
            return true;
        }
    },
    mounted() {
        this.onOriginChange();
    },

    methods: {
        
        onOriginChange() {
            const vm = this;
            axios.get(`${vm.services.getImportLC}?isLocal=${vm.model.IsLocal}`).then((response) => {
                Vue.set(vm.model, "ImportLCList", response.data);
            }).catch((error) => {
                console.log(error.response);
            });
        },

        selectFabric() {
            const vm = this;
            if (vm.fabricId) {
                axios.get(vm.services.getFabric + vm.fabricId).then(response => {
                    Vue.set(vm.model, "HSID", response.data.HSID);
                    Vue.set(vm.model, "HSDescription", response.data.HSDescription);
                }).catch((error) => {
                    console.log(error.data);
                });
            }
        },

        selectSupplier() {
            const vm = this;
            if (vm.supplierId.length > 0) {
                axios.get(vm.services.getSupplier + vm.supplierId).then(response => {
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
            vm.onOriginChange();
        }

    }
});
