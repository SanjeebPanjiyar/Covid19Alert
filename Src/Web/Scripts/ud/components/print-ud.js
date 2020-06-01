import Vue from "vue";
import axios from "axios";

import form from "../../core/mixins/form";
import moneyReceipt from "../../core/mixins/money-receipt";

Vue.component("print-ud", {

    mixins: [form, moneyReceipt],

    props: {
        selectedUd: String,
        CurrentUdinfoModel: Object
    },

    data() {
        return {
            uploadedDocuments: Array,
            model: { ...this.CurrentUdinfoModel },
            services: {
                read: "/udprint/read",
                set: "/ud/setselectedud?udTrackingNo=",
                getPrintModel: "/udprint/getprintmodel?",
                getUploadedDocuments: "/api/reviews/UploadedDocuments?trackingNo="
            }
        };
    },

    mounted() {
        this.$root.$on("UDNoUpdated", ({ updatedUDTrackingNo }) => {
            if (updatedUDTrackingNo) {
                axios.get(this.services.getUploadedDocuments + updatedUDTrackingNo).then(response => {
                    this.uploadedDocuments = response.data;
                });
            }
        });
    },

    computed: {
        filteredList() {
            const vm = this;
            if (vm.filterBy) {
                return vm.list.filter(x => x.MembershipID.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.UDTrackingNo.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }
            return vm.list;
        },
        exportLCTypes() {
            const vm = this;
            if (vm.model.ExportLCs && vm.model.ExportLCs.ExportLCTypes) {
                return vm.model.ExportLCs.ExportLCTypes;
            }
            return [];
        },
        importLCTypeGroup() {
            const vm = this;
            if (vm.model.ImportLCs && vm.model.ImportLCs.ImportLCTypeGroup) {
                Vue.set(vm.model, "ImportLCRemarks", vm.model.ImportLCs.Remarks);
                return vm.model.ImportLCs.ImportLCTypeGroup;
            }
            return [];
        },
        garments() {
            const vm = this;
            if (vm.model.Garments && vm.model.Garments.ReadymadeGarmentsDetails) {
                return vm.model.Garments.ReadymadeGarmentsDetails;
            }
            return [];
        },
        focRemarks() {
            const vm = this;
            console.log(vm.model.FocInfo);
            var focRemarks = vm.model.FocInfo.map(x => x.Remarks);
            console.log(focRemarks);
            return focRemarks.join();
        }
    },

    methods: {
        processList(response) {
            const vm = this;
            Vue.set(vm, "list", response.data);
            if (vm.selectedUd) {
                var ud = vm.list.filter(x => x.UDTrackingNo === vm.selectedUd)[0];
                if (ud) {
                    vm.select(ud);
                }
            }
        },

        printud() {
            const vm = this;

            axios.get(vm.services.getPrintModel + 'uDTrackingNo=' + vm.model.UDTrackingNo)
                .then(response => {
                    if (response.data !== false) {
                        Vue.set(vm, "model", { ...response.data });
                    }
                });
        },

        select(item) {
            const vm = this;

            Vue.set(vm, "model", { ...item });
            Vue.set(vm, "selectedItem", { ...item });
            document.title = vm.model.UDTrackingNo;

            axios.post(vm.services.set + vm.model.UDTrackingNo);
            vm.$root.$emit("UDNoUpdated", { updatedUDTrackingNo: vm.model.UDTrackingNo });

            vm.printud();
        }
    }
});
