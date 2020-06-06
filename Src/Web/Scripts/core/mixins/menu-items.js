import Vue from "vue";

import adminMenu from "./admin-menu-items.json";
import userMenu from "./user-menu-items.json";
import reviewerMenu from "./reviewer-menu-items.json";
import bonderMenu from "./bonder-menu-items.json";
import accountMenu from "./account-menu-items.json";

export default {
    props: {
        roles: Object,
        roleName: String
    },

    data() {
        return {
            mainMenu: [],
            subMenu: []
        };
    },
    mounted() {
        var r = this.roleName;
        if (!r) {
            window.Location = window.location.href = "/account/login";
        }
        var rName = r.toLowerCase();
        if (rName === this.roles.Administrator.toLowerCase()) {
            Vue.set(this, "mainMenu", adminMenu.mainMenu);
            Vue.set(this, "subMenu", adminMenu.subMenu);
        } else if (rName === this.roles.Bonder.toLowerCase()) {
            Vue.set(this, "mainMenu", bonderMenu.mainMenu);
            Vue.set(this, "subMenu", bonderMenu.subMenu);
        } else if (rName === this.roles.Official.toLowerCase()) {
            Vue.set(this, "mainMenu", userMenu.mainMenu);
            Vue.set(this, "subMenu", userMenu.subMenu);
        } else if (rName === this.roles.Account.toLowerCase()) {
            Vue.set(this, "mainMenu", accountMenu.mainMenu);
            Vue.set(this, "subMenu", accountMenu.subMenu);
        } else if (this.isReviewer(rName)) {
            Vue.set(this, "mainMenu", reviewerMenu.mainMenu);
            Vue.set(this, "subMenu", reviewerMenu.subMenu);
        }
    },

    methods: {
        isReviewer(roleName) {
            return roleName === this.roles.Account.toLowerCase()
                || roleName === this.roles.ConsumptionChecker.toLowerCase()
                || roleName === this.roles.Scrutineer.toLowerCase()
                || roleName === this.roles.UdSignatory.toLowerCase()
                || roleName === this.roles.NominatedMember.toLowerCase()
                || roleName === this.roles.Member.toLowerCase()
                || roleName === this.roles.DsOrAboveHeadOfDept.toLowerCase()
                || roleName === this.roles.DocumentChecker.toLowerCase();
        }
    }
};
