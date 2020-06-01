import Vue from "vue";
import axios from "axios";

Vue.component("logs", {
    props: {
        data: Array
    },

    data() {
        return {
            logs: []
        };
    },

    created() {

        this.data.forEach(l => {
            l.TimeStamp = new Date(l.TimeStamp + "Z").toLocaleString();
        });

        Vue.set(this, "logs", this.data);

        this.logs.forEach(log => {
            Vue.set(log, "ShowMore", false);
            Vue.set(log, "ExcerptException", log.Exception.slice(0, 200));
        });
    },

    methods: {
        toggleShowMore(log) {
            Vue.set(log, "ShowMore", !log.ShowMore);
        },

        clearLogs() {
            axios.post("/logs/ClearLogs").then(response => {
                this.logs = [];
            });
        }
    }
});
