import Vue from "vue";
import form from "../../core/mixins/form";
import axios from "axios";

Vue.component("buyer-info", {

    mixins: [form],

    props: {
        countries: Array
    },

    data() {
        return {
            model: {
                CountryCode: this.countries[0].CountryID
            },
            services: {
                create: "/buyerinfo/create",
                update: "/buyerinfo/update",
                delete: "/buyerinfo/delete",
                read: "/buyerinfo/read",
                bgmeaBuyersQueryByCountryUrl: "/buyerinfo/GetBgmeaBuyersByCountry?countryCode="
            },
            bgmeaBuyers: Array
        };
    },

    computed: {
        filteredList() {
            const vm = this;
            if (vm.filterBy) {
                return vm.list.filter(m => m.BuyerID.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    m.BuyerAddress.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    m.BuyerName.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }
            return vm.list;
        }
    },
    methods: {
        reset() {
            const vm = this;
            vm.$refs.observer.reset();
            Vue.set(vm, "model", { CountryCode: this.countries[0].CountryID });
            Vue.set(vm, "selectedItem", null);
        },

        getBuyerByCountry(countryCode) {
            const vm = this;
            axios.get(vm.services.bgmeaBuyersQueryByCountryUrl + countryCode).then(response => {
                vm.bgmeaBuyers = response.data;
            }).catch((error) => {
                console.log(error.response.data);
            });
        }
    }
});
