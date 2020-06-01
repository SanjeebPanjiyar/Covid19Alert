import Vue from "vue";
import axios from "axios";
import form from "../../core/mixins/form";
import amform from "../../core/mixins/amFormWithActionTypeId";
import { format } from "date-fns";

Vue.component("am-import-lc", {

    mixins: [form, amform],

    props: {
        types: Array,
        banks: Array,
        currencies: Array,
        origin : Array
    },

    data() {
        return {
            model: {
                ImportLCTypeID: this.types[0].ImportLCTypeID,
                BankID: this.banks.length !== 0 ? this.banks[0].BankID : null,
                CurrencyID: this.currencies[0].CurrencyID,
                LCDate: format(new Date(), "yyyy-MM-dd")
            },
            history: {
                LCDate: format(new Date(), "yyyy-MM-dd")
            },
            services: {
                create: "/AMImportLC/Create",
                read: "/AMImportLC/Read",
                update: "/AMImportLC/Update",
                delete: "/AMImportLC/Delete",
                getHistory: "/AMImportLC/GetHistory",
                deleteHistory: "/AMImportLC/DeleteHistory",
                defaultModel: "/AMImportLC/getdefaultmodel"
            },
            hasHistory: false,
            filterBy: null
        };
    },

    computed: {
        filteredList() {
            const vm = this;

            if (vm.filterBy) {
                return vm.list.filter(x => x.ImportLCTypeName.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.ImportLCID.toString().includes(vm.filterBy.toLowerCase().trim()));
            }

            return vm.list;
        }
    },

    methods: {

        processList(response) {
            const vm = this;
            response.data.forEach(x => {
                x.LCDate = format(new Date(x.LCDate), "yyyy-MM-dd");
            });

            Vue.set(vm, "list", response.data);
        },

        update() {
            this.model.InDeValue = this.model.InDeValue || 0;
            this.model.InDeUseValue = this.model.InDeUseValue || 0;

            axios.post(this.services.update, this.model).then(() => {
                this.handleSubmit();
                this.handleReplaceAction(vm.model);
            }).catch((error) => {
                this.processError(error);
            });
        },

        processHistory(model) {
            const vm = this;

            Vue.set(vm, "history", model);
            vm.history.LCDate = format(new Date(vm.history.LCDate), "yyyy-MM-dd");
        },

        updateModel(model) {
            const vm = this;
            Vue.set(vm, "model", model ? model : { ...vm.defaultModel });
            Vue.set(vm.model, "LCDate", format(new Date(vm.model.LCDate), "yyyy-MM-dd"));
        }
    }
});
