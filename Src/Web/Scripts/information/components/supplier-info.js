import Vue from "vue";
import form from "../../core/mixins/form";

Vue.component("supplier-info", {

    mixins: [form],

    props: {
        countries: Array
    },

    data() {
        return {
            model: {
                CountryID: this.countries[0].CountryID
            },
            services: {
                create: "/supplierinfo/create",
                read: "/supplierinfo/read",
                update: "/supplierinfo/update",
                delete: "/supplierinfo/delete"
            }
        };
    },

    computed: {
        filteredList() {
            const vm = this;
            if (vm.filterBy) {
                return vm.list.filter(x => x.SupplierID.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.SupplierName.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.SupplierAddress.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) );
            }
            return vm.list;
        }
    },

    methods: {
        reset() {
            const vm = this;
            vm.$refs.observer.reset();
            Vue.set(vm, "model", { CountryID: this.countries[0].CountryID });
            Vue.set(vm, "selectedItem", null);
        }
    }
});
