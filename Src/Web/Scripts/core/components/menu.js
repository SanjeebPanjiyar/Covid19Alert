import Vue from "vue";
import axios from "axios";
import menuItems from "../mixins/menu-items";

Vue.component("nav-menu", {
    props: {
        udTrackingNumber: String,
        amTrackingNumber: String
    },

    mixins: [menuItems],

    data() {
        return {
            udTrackingNo: this.udTrackingNumber,
            amTrackingNo: this.amTrackingNumber,
            location: window.location,
            activeMenuId: "",
            activeTabId: "",
            udNotSelectedMessage: "UD not selected",
            amNotSelectedMessage: "AM not selected",
            services: {
                getSelectedUD: "/ud/getSelectedUD",
                getSelectedAM: "/am/getSelectedAM"
            }
        };
    },

    mounted() {
        const vm = this;

        vm.$root.$on("UDNoUpdated", function ({ updatedUDTrackingNo }) {
            Vue.set(vm, "udTrackingNo", updatedUDTrackingNo);
        });

        vm.$root.$on("AMNoUpdated", function (updatedAMTrackingNo) {
            Vue.set(vm, "amTrackingNo", updatedAMTrackingNo);
        });

        vm.subMenu.forEach(subMenu => {
            if (subMenu.items.find(x => x.href === window.location.pathname)) {
                vm.activeMenuId = subMenu.parentId;
                vm.activeTabId = subMenu.tabId;
            }
        });
    },

    methods: {
        handleClick(item) {
            const vm = this;

            if (item.validateUd || item.validateAm) {
                var alertMessage = item.validateUd ? vm.udNotSelectedMessage : vm.amNotSelectedMessage;
                var validationUrl = item.validateUd ? vm.services.getSelectedUD : vm.services.getSelectedAM;
                vm.validateMenuSelection(validationUrl, alertMessage, item.href);
            } else {
                window.location.href = item.href;
            }
        },

        validateMenuSelection(url, message, href) {
            const vm = this;

            axios.get(url).then((response) => {
                if (response.data === "") {
                    vm.$bvModal.msgBoxOk(message, {
                        okVariant: "info",
                        okTitle: "Ok",
                        centered: true,
                        hideHeaderClose: false,
                        footerClass: "p-2",
                        size: "sm",
                    }).then(value => {
                        window.location.href = href;
                    });
                } else {
                    window.location.href = href;
                }
            });
        }
    }
});
