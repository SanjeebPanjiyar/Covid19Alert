import Vue from "vue";
import form from "../../core/mixins/form";

Vue.component("am-m-column", {

    mixins: [form],

    data() {
        return {
            services: {
                read: "/MColumn/Read",
                create: "/MColumn/Create",
                update: "/MColumn/Update",
                delete: "/MColumn/Delete"
            },
            selectedItem: null
        };
    },

    computed: {
        filteredList() {
            const vm = this;

            if (vm.filterBy) {
                return vm.list.filter(x => x.SlNo.toString().toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.MDescription.toString().includes(vm.filterBy.toLowerCase().trim()));
            }

            return vm.list;
        }
    }

});
