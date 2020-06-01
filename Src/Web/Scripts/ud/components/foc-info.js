import Vue from "vue";
import axios from "axios";
import form from "../../core/mixins/form";

Vue.component("foc-info", {

    mixins: [form],

    props: {
        focTypes: Array,
        currencies: Array
    },

    data() {
        return {
            services: {
                create: "/focinfo/create",
                read: "/focinfo/read",
                update: "/focinfo/update",
                delete: "/focinfo/delete",
                defaultModel: "/focinfo/GetDefaultModel"
            }
        };
    },

    computed: {
        filteredList() {
            const vm = this;
            if (vm.filterBy) {
                return vm.list.filter(x => x.FocId.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.FOCTypeName.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }
            return vm.list;
        }
    }
});
