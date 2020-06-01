import Vue from "vue";
import form from "../../core/mixins/form";
import amform from "../../core/mixins/amFormWithActionTypeId";
import { format } from "date-fns";

Vue.component("am-export-lc", {

    mixins: [form, amform],

    props: {
        types: Array,
        banks: Array,
        currencies: Array
    },

    data() {
        return {
            services: {
                create: "/AmExportLC/Create",
                read: "/AmExportLC/Read",
                update: "/AmExportLC/Update",
                delete: "/AmExportLC/Delete",
                getHistory: "/AmExportLC/GetHistory",
                deleteHistory: "/AmExportLC/DeleteHistory",
                defaultModel: "/AmExportLC/GetDefaultModel"
            }
        };
    },

    computed: {
        filteredList() {
            const vm = this;

            if (vm.filterBy) {
                return vm.list.filter(x => x.BankName.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.ExportLCNo.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
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

        processHistory(model) {
            const vm = this;

            Vue.set(vm, "history", model);

            vm.history.ExportLCTypeID = vm.history.ExportLCTypeID;
            vm.history.BankID = vm.history.BankID;
            vm.history.LCDate = format(new Date(vm.history.LCDate), "yyyy-MM-dd");
            vm.history.ShipmentDate = format(new Date(vm.history.ShipmentDate), "yyyy-MM-dd");
            vm.history.ExpiryDate = format(new Date(vm.history.ExpiryDate), "yyyy-MM-dd");
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
