import Vue from "vue";
import axios from "axios";

Vue.component("fabric-consumption", {
    props: {
        garmentTypes: Array,
        fabricConsumptionTypes: Array
    },

    data() {
        return {
            garmentTypeId: "",
            fabricWidth: 55,
            shrinkagePercent: 5,
            wastagePercent: 10,
            measurementUnit: 2.54,
            quantity: 12,
            totalFabricConsumption: "",
            measurementUnits: [
                { Value: 2.54, Text: "cm" },
                { Value: 1, Text: "inch" }
            ]
        };
    },

    computed: {
        garmentType() {
            return this.garmentTypes.find(x => x.Id === this.garmentTypeId);
        },

        measurementUnitText() {
            return this.measurementUnits.find(x => x.Value === this.measurementUnit).Text;
        }
    },

    methods: {
        submit() {
            axios.post("/FabricConsumption/GetTotalFabricConsumption", {
                FabricWidth: this.fabricWidth,
                WastagePercent: this.wastagePercent,
                ShrinkagePercent: this.shrinkagePercent,
                GarmentType: this.garmentType,
                MeasurementsUnitValue: this.measurementUnit,
                Quantity: this.quantity
            }).then(response => {
                Vue.set(this, "totalFabricConsumption", response.data);
            });
        }
    }
});
