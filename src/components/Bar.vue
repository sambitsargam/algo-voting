<template>
    <div class="bar">
        <table v-if="showRatios">
            <tr>     
                <td v-bind:style="{ color: team1Color}">
                    <strong>{{team1Ratio}}%</strong>
                </td>
                <td v-bind:style="{ color: team2Color}">
                    <strong>{{team2Ratio}}%</strong>
                </td>
            </tr>
        </table>
        <div v-bind:style="{ background: team2Color}" class="bar_right">
            <div v-bind:style="{ background: team1Color, width: barWidth}" class="bar_left"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Bar',
    props: {
        showRatios: {
            type: Boolean,
            default: true
        },
        team1Color: {
            type: String,
            required: true,
        },
        team2Color: {
            type: String,
            required: true,
        },
        team1Total: {
            type: Number,
            required: true,
        },
        team2Total: {
            type: Number,
            required: true,
        }
    },
    computed: {
        team1Ratio: function(): number {
            if (this.team1Total + this.team2Total == 0) return 50
            return Math.round(this.team1Total / (this.team1Total + this.team2Total) * 100)
        },
        team2Ratio: function(): number {
            if (this.team1Total + this.team2Total == 0) return 50
            return Math.round(this.team2Total / (this.team1Total + this.team2Total) * 100)
        },
        barWidth: function() {
            let ratio = this.team1Ratio;
            let clamped = Math.min(Math.max(ratio, 2), 98);
            return clamped.toString() + "%"
        },
    }
})
</script>

<style scoped>

.bar {
    width: 100%;
    display: inline-block;
}

.bar_left {
    min-height: 20px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
}

.bar_right {
    min-height: 20px;
    border-radius: 20px;
}

table {
    width: 100%;
    font-size: 30px;
}

td {
    padding: 0;
}

table tr td {
    text-align: left;
}

table tr td + td {
    text-align: right;
}
</style>
