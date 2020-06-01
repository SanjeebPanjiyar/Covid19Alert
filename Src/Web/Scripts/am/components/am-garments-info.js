import Vue from "vue";
import axios from "axios";
import form from "../../core/mixins/form";
import amForm from "../../core/mixins/amFormWithActionType";

Vue.component("am-garments-info", {

    mixins: [form, amForm],

    props: {
        exportLcs: Array,
        units: Array,
        hscodes: Array
    },

    data() {
        return {
            model: {
                ExportLCNo: this.exportLcs.length !== 0 ? this.exportLcs[0].ExportLCNo : null,
                MUnitID: this.units.length !== 0 ? this.units[0].MUnitID : null
            },
            services: {
                read: "/AMGarmentsInfo/Read",
                create: "/AMGarmentsInfo/Create",
                update: "/AMGarmentsInfo/Update",
                delete: "/AMGarmentsInfo/Delete",
                getHistory: "/AMGarmentsInfo/GetHistory",
                deleteHistory: "/AMGarmentsInfo/DeleteHistory",
                defaultModel: "/AMGarmentsInfo/GetDefaultModel",
                getgarments: "/AMGarmentsInfo/GetGarmentsInfo?garmentsId=",
                getgarmentslist: "/AMGarmentsInfo/GetGarmentsList"
            },
            hslist : this.hscodes,
            hsId : null
        };
    },

    computed: {
        filteredList() {
            const vm = this;

            if (vm.filterBy) {
                return vm.list.filter(x => x.StyleNo.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.HSID.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }

            return vm.list;
        }
    },

    methods: {

        selectgarments() {
            const vm = this;
            if (vm.hsId.length > 0) {
                axios.get(vm.services.getgarments + vm.hsId).then(response => {
                    Vue.set(vm.model, "HSID", response.data.HSID);
                    Vue.set(vm.model, "HSDescription", response.data.HSDescription);

                }).catch((error) => {
                    console.log(error.data);
                });
            }
        },

        reset() {
            const vm = this;
            vm.$refs.observer.reset();
            vm.updateModel();
            Vue.set(vm, "selectedItem", null);

            axios.get(vm.services.getgarmentslist).then(response => {
                Vue.set(vm, "hslist", response.data);
            }).catch((error) => {
                console.log(error.data);
            });
        }

    }

});
