import Vue from "vue";
import axios from "axios";

Vue.component("report-filter", {
    data() {
        return {
            errors: null,
            filter: {},
            filterBy: null,
            trackingList: null,
            selectedItem : null,
            services:
            {
                read: "/api/reviews/factory",
                getTrackingList: "/ReportFilter/GetTrackingInfo"
            },
            model:
            {
                MembershipId : null,
                TrackingType : null,
                TrackingNumber : null
            },
            args: this.$options.args,
            lcTypes: this.$options.lcTypes

        };
    },
    created() {
        
        this.getFilterData();
    },
    computed: {
        filteredList() {
            const vm = this;

            if (vm.filterBy) {
                return vm.trackingList.filter(x => x.TrackingNumber.toString().toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }

            return vm.trackingList;
        }
    },

    methods: {
        getFilterData() {
            const vm = this;

            axios.get(vm.services.read)
                .then(response => {
                    Vue.set(vm, "filter", response.data);
                })
                .catch((error) => {
                    vm.$bvModal.msgBoxOk(error.response.data, {
                        okVariant: "danger",
                        centered: true,
                        hideHeaderClose: false,
                        size: 'sm',
                        footerClass: "p-2"
                    });
                    Vue.set(vm, "errors", error.response.data);
                });
        },
        select(item) {
            Vue.set(this, "selectedItem", item);
            this.$emit('selected', item.TrackingNumber);
        },
        clear() {
            Vue.set(this.model, "TrackingNumber", null);
        },
        search() {
            const vm = this;

            axios.post(vm.services.getTrackingList, vm.model)
                .then(response => {
                    Vue.set(vm, "trackingList", response.data);
                })
                .catch((error) => {
                    vm.$bvModal.msgBoxOk(error.response.data, {
                        okVariant: "danger",
                        centered: true,
                        hideHeaderClose: false,
                        size: 'sm',
                        footerClass: "p-2"
                    });
                    Vue.set(vm, "errors", error.response.data);
                });
        }
    }
});
