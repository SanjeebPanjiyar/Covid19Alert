import Vue from "vue";
import form from "../../core/mixins/form";

Vue.component("ud-buyer", {

    mixins: [form],

    props: {
        buyers: Array
    },

    data() {
        return {
            services: {
                create: "/udbuyer/create",
                update: "/udbuyer/create",
                read: "/udbuyer/read",
                delete: "/udbuyer/delete"
            }
        };
    },

    computed: {
        filteredList() {
            const vm = this;
            if (vm.filterBy) {
                return vm.list.filter(x => x.BuyerID.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.BuyerName.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }
            return vm.list;
        }
    },

    methods: {

        select(item) {
            const vm = this;

            var udbuyer = vm.buyers.filter(b => b.BuyerID == item.BuyerID)[0];
            Vue.set(vm, "model", { ...udbuyer });
            Vue.set(vm, "selectedItem", { ...item });
        },

        resetSelection() {
            Vue.set(this, "selectedItem", null);
        }
    }
});
