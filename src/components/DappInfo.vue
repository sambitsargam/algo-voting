<template>
    <table>
        <tr>
            <td>
                <span></span>
            </td>
            <td>
                <span>{{timeRemainingString}}</span>
            </td>
            <td>
                <span></span>
            </td>
        </tr>
        <tr v-if="verbose">
            <td>
                <span>{{team1TotalAlgos}}</span>
            </td>
            <td>
                <span>Total Vote</span>
            </td>
            <td>
                <span>{{team2TotalAlgos}}</span>
            </td>
        </tr>
        <tr v-if="verbose">
            <td>
                <span>1:{{team1Ratio}}</span>
            </td>
            <td>
                <span>Return Ratio</span>
            </td>
            <td>
                <span>1:{{team2Ratio}}</span>
            </td>
        </tr>
        <!--
        <tr>
            <td>
                <span>{{dapp.Team1NumVoters}}</span>
            </td>
            <td>
                <span>Number of Voters</span>
            </td>
            <td>
                <span>{{dapp.Team2NumVoters}}</span>
            </td>
        </tr>
        -->
    </table>
</template>

<script lang="ts">
import { Dapp } from '@/types';
import { defineComponent, PropType } from 'vue'
import * as algosdk from 'algosdk';

export default defineComponent({
    name: 'DappInfo',
    props: {
        dapp: {
            type: Object as PropType<Dapp>,
            required: true,
        },
        verbose: {
            type: Boolean,
            default: true,
        }
    },
    computed: {
        team1Ratio: function() {
            let ratio: number = (this.dapp.Team1.Total + this.dapp.Team2.Total) / this.dapp.Team1.Total;
        
            return ratio.toFixed(2)
        },
        team2Ratio: function() {
            let ratio: number = (this.dapp.Team1.Total + this.dapp.Team2.Total) / this.dapp.Team2.Total;
        
            return ratio.toFixed(2)
        },
        timeRemainingString: function() {
            if (this.limitTimeRemaining.total > 0) {
                let str = "Voting Close in " 
                let datestr: string = this.limitTimeRemaining.days + ` day${this.limitTimeRemaining.days != 1 ? 's' : ''}`
                let hourstr: string = this.limitTimeRemaining.hours + ` hour${this.limitTimeRemaining.hours != 1 ? 's' : ''}`
                let minstr: string = this.limitTimeRemaining.minutes + ` minute${this.limitTimeRemaining.seconds != 1 ? 's' : ''}`
                let secstr: string = this.limitTimeRemaining.seconds + ` second${this.limitTimeRemaining.seconds != 1 ? 's' : ''}`
                if (this.limitTimeRemaining.days > 0) {
                    return str + ' ' + datestr + ' ' + hourstr
                } else if (this.limitTimeRemaining.hours > 0) {
                    return str + ' ' + hourstr + ' ' + minstr
                } else if (this.limitTimeRemaining.minutes > 0) {
                    return str + ' ' + minstr + ' ' + secstr
                } else {
                    return str + ' ' + secstr
                }
            } else {
                return "Vote have closed"
            }
        },
        team1TotalAlgos(): number {
            return algosdk.microalgosToAlgos(this.dapp.Team1.Total);
        },
        team2TotalAlgos(): number {
            return algosdk.microalgosToAlgos(this.dapp.Team2.Total);
        }
    },
   
    data() {
        return {
            limitTimeRemaining: {
                total: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
            }
        };
    },
    mounted() {
        setTimeout(this.countdown, 1);
    },
    methods: {
        countdown() {
            let t = this.dapp.LimitDate - Math.floor(Date.now() / 1000);

            if (t > 0) {
                let seconds = t % 60;
                let minutes = Math.floor((t / 60) % 60);
                let hours = Math.floor((t / 3600) % 24);
                let days = Math.floor(t / (3600 * 24));

                this.limitTimeRemaining = {
                        total: t,
                        days: days,
                        hours: hours,
                        minutes: minutes,
                        seconds: seconds,
                    };
                
                let timeout = 1;
                if (days > 0) {
                    timeout = 600;
                } else if (hours > 0) {
                    timeout = 10;
                }
                setTimeout(this.countdown, timeout);

            } else {
                this.limitTimeRemaining = {
                        total: 0,
                        days: 0,
                        hours: 0,
                        minutes: 0,
                        seconds: 0,
                    };
            }
        }
    }
})
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

table span {
    color: darkgrey
}

td {
    padding: 1px;
}

table tr td {
    text-align: left;
    width: 30%;
}

table tr td + td {
    text-align: center;
    width: 40%;
}

table tr td + td + td {
    text-align: right;
    width: 30%;
}

</style>