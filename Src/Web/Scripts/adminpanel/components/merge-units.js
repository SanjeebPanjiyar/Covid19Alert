import Vue from "vue";
import axios from "axios";

Vue.component("merge-units", {

    data() {
        return {
            model: {},
            list: {},
            filterBy: null,
            selectedItem: null,
            services: {
                read: "/unitinfo/mergeread",
                update: "/unitinfo/mergeupdate"
            }
        };
    },
    computed: {
        filteredList() {
            const vm = this;
            if (vm.filterBy) {
                return vm.list.filter(x => x.MUnitID.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.MUnitName.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }
            return vm.list;
        }
    },
    mounted() {
        const vm = this;
        axios.get(vm.services.read, this.model).then(response => {
            Vue.set(vm, "list", response.data);
        });
    }
});
