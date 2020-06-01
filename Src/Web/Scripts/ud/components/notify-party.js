import Vue from "vue";
import axios from "axios";
import form from "../../core/mixins/form";

Vue.component("notify-party", {

    mixins: [form],

    props: {
        countries: Array,
        notifyparty: Array,
        buyerlist: Array
    },

    data() {
        return {
            services: {
                read: "/notifyparty/read",
                create: "/notifyparty/create",
                update: "/notifyparty/update",
                delete: "/notifyparty/delete",
                defaultModel: "/notifyparty/GetDefaultModel",
                getnotifyparty: "/notifyparty/GetNotifyParty?notifyId=",
                getnotifypartylist: "/notifyparty/GetNotifyPartyList",
                getbuyer: "/UDBuyer/GetBuyer?buyerId="
            },
            model: {
                NotifyName: null,
                CountryID: 0,
                EmailAddress: null,
                FaxNo: null,
                NotifyAddress : null
            },
            notifypartylist: this.notifyparty,
            notifypartyid: null,
            buyers: this.buyerlist,
            buyerid : null
        };
    },

    computed: {
        filteredList() {
            const vm = this;
            if (vm.filterBy) {
                return vm.list.filter(x => x.NotifyName.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }
            return vm.list;
        }
    },
    methods: {
        selectnotifyparty() {
            const vm = this;
            if (vm.notifypartyid.length > 0) {
                axios.get(vm.services.getnotifyparty + vm.notifypartyid).then(response => {
                    Vue.set(vm.model, "NotifyName", response.data.NotifyName);
                    Vue.set(vm.model, "CountryID", response.data.CountryID);
                    Vue.set(vm.model, "EmailAddress", response.data.EmailAddress);
                    Vue.set(vm.model, "FaxNo", response.data.FaxNo);
                    Vue.set(vm.model, "NotifyAddress", response.data.NotifyAddress);
                }).catch((error) => {
                    console.log(error.data);
                });
            }
        },
        selectbuyer() {
            const vm = this;
            if (vm.buyerid.length > 0) {
                axios.get(vm.services.getbuyer + vm.buyerid).then(response => {
                    Vue.set(vm.model, "NotifyName", response.data.BuyerName);
                    Vue.set(vm.model, "CountryID", response.data.CountryCode);
                    Vue.set(vm.model, "EmailAddress", response.data.EmailNo);
                    Vue.set(vm.model, "FaxNo", response.data.FaxNo);
                    Vue.set(vm.model, "NotifyAddress", response.data.BuyerAddress);
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

            axios.get(vm.services.getnotifypartylist).then(response => {
                Vue.set(vm, "notifypartylist", response.data);
            }).catch((error) => {
                console.log(error.data);
            });
        }

    }
});
