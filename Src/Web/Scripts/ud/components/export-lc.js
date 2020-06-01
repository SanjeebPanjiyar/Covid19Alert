import Vue from "vue";
import form from "../../core/mixins/form";
import { format } from "date-fns";

Vue.component("export-lc", {

    mixins: [form],

    props: {
        types: Array,
        banks: Array,
        currencies: Array
    },

    data() {
        return {
            services: {
                create: "/ExportLC/Create",
                read: "/ExportLC/Read",
                update: "/ExportLC/Update",
                delete: "/ExportLC/Delete",
                defaultModel: "/ExportLC/GetDefaultModel"
            }
        };
    },

    computed: {
        filteredList() {
            const vm = this;

            if (vm.filterBy) {
                return vm.list.filter(x => x.ExportLCTypeText.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.ExportLCID.toString().includes(vm.filterBy.toLowerCase().trim()));
            }

            return vm.list;
        }
    },

    methods: {

        processList(response) {
            const vm = this;
            response.data.forEach(x => {
                x.LCDate = format(new Date(x.LCDate), "yyyy-MM-dd");
                x.ShipmentDate = format(new Date(x.ShipmentDate), "yyyy-MM-dd");
                x.ExpiryDate = format(new Date(x.ExpiryDate), "yyyy-MM-dd");
            });

            Vue.set(vm, "list", response.data);
        },

        updateModel(model) {
            const vm = this;
            Vue.set(vm, "model", model ? model : { ...vm.defaultModel });
            Vue.set(vm.model, "LCDate", format(new Date(vm.model.LCDate), "yyyy-MM-dd"));
            Vue.set(vm.model, "ShipmentDate", format(new Date(vm.model.ShipmentDate), "yyyy-MM-dd"));
            Vue.set(vm.model, "ExpiryDate", format(new Date(vm.model.ExpiryDate), "yyyy-MM-dd"));
        }
    }
});
