import Vue from "vue";
import axios from "axios";
import { format } from "date-fns";
import form from "../../core/mixins/form";

Vue.component("import-lc", {

    mixins: [form],

    props: {
        bankList: Array,
        importLcTypeList: Array,
        currencies: Array,
        origins: Array
    },

    data() {
        return {
            model: {
                LCDate: format(new Date(), "yyyy-MM-dd")
            },
            services: {
                read: "/importlc/read",
                create: "/importlc/create",
                update: "/importlc/update",
                delete: "/importlc/delete",
                defaultModel: "/importlc/getdefaultmodel"
            }
        };
    },

    computed: {
        filteredList() {
            const vm = this;
            if (vm.filterBy) {
                return vm.list.filter(x => x.ImportLCTypeName.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.BankName.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }
            return vm.list;
        }
    },

    methods: {

        processList(response) {
            const vm = this;
            response.data.forEach((item) => {
                item.LCDate = format(new Date(item.LCDate), "yyyy-MM-dd");
            });
            Vue.set(vm, "list", response.data);
        },

        updateModel(model) {
            const vm = this;
            Vue.set(vm, "model", model ? model : { ...vm.defaultModel });
            Vue.set(vm.model, "LCDate", format(new Date(vm.model.LCDate), "yyyy-MM-dd"));            
        }
    }
});
