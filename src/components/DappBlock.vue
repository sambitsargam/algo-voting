<template>
    <div class="dapp">
        
        <table>
            <tr>
                <td>
                    <h1 :style="{ color: team1Color }">{{ dapp.Team1.Name }}</h1>
                </td>
                <td>
                    <h2>vs</h2>
                </td>
                <td>
                    <h1 :style="{ color: team2Color }">{{ dapp.Team2.Name }}</h1>
                </td>
            </tr>
        </table>
        
        <Bar 
            :team1Total="dapp.Team1.Total"
            :team2Total="dapp.Team2.Total"
            :team1Color="team1Color"
            :team2Color="team2Color"
            :showRatios="!localState"
            >
        </Bar>
        <DappInfo :dapp="dapp"></DappInfo>
        <table v-if="!localState && isVoteable">
            <tr>
                <td>
                    <VoteButton 
                        text="Vote"
                        :color="team1Color"
                        :teamName="dapp.Team1.Name"
                        :dapp="dapp"
                        >
                    </VoteButton>
                </td>
                <td></td>
                <td>
                    <VoteButton
                        text="Vote"
                        :color="team2Color"
                        :teamName="dapp.Team2.Name"
                        :dapp="dapp"
                        >
                    </VoteButton>
                </td>
            </tr>
        </table>
        <div v-else-if="localState">
            <LocalStateInfo :localState="localState" :color="myTeamColor"></LocalStateInfo>
            <div v-if="isExpired">
                Winner was not picked!
                <br>
                <ReclaimButton :localState="localState"></ReclaimButton>
            </div>
            <div v-else-if="dapp.Winner === ''">
                Winner has yet to be picked...
            </div>
            <div v-else-if="!hasClaimed">
                Winner: <span :style="{ color: winningTeamColor }">{{dapp.Winner}}</span>
                <br>
                <ClaimButton v-if="isWinner" :color="myTeamColor" :localState="localState"></ClaimButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import VoteButton from './VoteButton.vue'
import Bar from './Bar.vue'
import DappInfo from './DappInfo.vue'
import { Dapp, DappLocalState } from '@/types'
import LocalStateInfo from './LocalStateInfo.vue'
import ClaimButton from './ClaimButton.vue'
import ReclaimButton from './ReclaimButton.vue'

export default defineComponent({
    name: 'DappBlock',
    props: {
        dapp: {
            type: Object as PropType<Dapp>,
            required: true
        },
        localState: {
            type: Object as PropType<DappLocalState>,
            required: false
        },
        team1Color: {
            type: String,
            default: "#D18F1D" 
        },
        team2Color: {
            type: String,
            default: "#4D5ACE"
        },
    },
    components: {
        VoteButton,
        Bar,
        DappInfo,
        LocalStateInfo,
        ClaimButton,
        ReclaimButton
    },
    computed: {
        myTeamColor(): string {
            if ((this.localState as DappLocalState).Team === this.dapp.Team1.Name) {
                return this.team1Color;
            } else {
                return this.team2Color;
            }
        },
        winningTeamColor(): string {
            if (this.dapp.Winner === this.dapp.Team1.Name) {
                return this.team1Color;
            } else {
                return this.team2Color;
            }
        },
        isVoteable(): boolean {
            return this.dapp.LimitDate * 1000 > Date.now();
        },
        isExpired(): boolean {
            return this.dapp.EndDate * 1000 < Date.now();
        },
        isWinner(): boolean {
            return ((this.localState as DappLocalState).Team === this.dapp.Winner)
        },
        hasClaimed(): boolean {
            return ((this.localState as DappLocalState).Bet === 0)
        }
    }
})
</script>


<style scoped>
.dapp {
    display: inline-block;
    background: #eeeeee;
    margin: 10px;
    padding: 10px 20px;
    border-radius: 10px;
    width: 80%;
    max-width: 700px;
}


.dapp table {
   width: 100%;
   border-collapse: collapse;
}

td {
    padding: 5px;
}

.dapp table tr td {
    text-align: left;
    width: 45%;
}

.dapp table tr td + td {
    text-align: center;
    width: 10%;
}

.dapp table tr td + td + td {
    text-align: right;
    width: 45%;
}

.dapp h1 {
    display: inline;
    font-size: 48px;
}

.dapp h2 {
    display: inline

}

.dapp img {
    width: 25px;
    height: 25px;
    border: 2px solid #000;
    border-radius: 50%;
    display: none;
}
</style>
