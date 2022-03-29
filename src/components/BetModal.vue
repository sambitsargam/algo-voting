<template>
    <div>
        <div class="modal-overlay" @click="$emit('toggle-bet-modal')"></div>

        <div class="modal">
            <form @submit="onSubmit">
            <label id="header">Vote on <span :style="{color: teamColor}">{{teamName}}</span></label>
            <br>
            <select id="account">
                <option disabled selected value>- select account -</option>
                <option :key="account.address" v-for="account in accounts" :value="account.address">{{account.short}}</option>
            </select>
            <div v-if="!isValidAddress" id="please-select">
                Please select an account
            </div>
            <input type="number" v-model="amount" placeholder="0" step="0.000001" min="0.01" maxlength="8">
            <br>
            <input v-if="!confirmText" type="submit" value="Sign Transaction" :style="{ 'background-color': teamColor }"> 
            <div v-else>
                {{confirmText}}
            </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import * as algosdk from 'algosdk'
import { Account, Dapp } from '@/types';
import api from '@/api/dapps';

export default defineComponent({
    name: 'BetModal',

    props: {
        teamName: {
            type: String,
            required: true,
        },
        teamColor: String,
        dapp: {
            type: Object as PropType<Dapp>,
            required: true
        },
    },
    data() {
        return {
            amount: 0,
            isValidAddress: true,
            confirmText: "",
        }
    },
    computed: {
        accounts(): Account[] {
            return this.$store.state.userAccounts;
        }
    },
    methods: {     
        async onSubmit(e: Event) {
            e.preventDefault();

            if (!this.amount) {
                alert('Please specify an amount')
                return
            }

            let elem: HTMLSelectElement = document.getElementById("account") as HTMLSelectElement;
            let acc = elem.value;

            if (!algosdk.isValidAddress(acc)) {
                this.isValidAddress = false
                return
            } else {
                this.isValidAddress = true
            }

            console.log("Betting " + this.amount + " on " + this.teamName 
            + " with account " + acc);
        
            // construct the transaction and sign
            api.optInToDapp(acc, this.dapp, algosdk.algosToMicroalgos(this.amount), this.teamName as string).then( () => {
                this.confirmText = "Transaction Complete!";
            }).catch((e) => {
                console.error(e);
                this.confirmText = "Transaction Failed!";
            });
        }
    },
    emits: ['toggle-bet-modal']
})
</script>

<style scoped>
.modal {
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;

    width: 100%;
    max-width: 400px;
    background-color: #eeeeee;
    border-radius: 16px;

    padding: 25px;
    text-align: center;
}

.modal * {
    margin: 7px;
}

#please-select {
    margin: 0px;
    padding: 0px;
    color: orangered;
}

#header {
    font-size: 50px;
    font-weight: bold;
}


.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 98;
    background-color: rgba(0, 0, 0, 0.3);
}


.modal input[type=number] {
    padding: 10px 10px;
    border-radius: 16px;
    font-size: 50px;
    font-weight: bold;
    text-align: center;
    width: 80%;
    border-width: 0px;

    background-image: url('../assets/algorand_logo_mark_black.svg');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: right;
}


/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}


.modal input[type=submit] {
    font-size: 20px;
    width: 70%;
    padding: 15px;
    border-radius: 5px;
    color: white;
    border-width: 0px;
}

select {
    font-family: 'Courier New';
    font-weight: bold;
}

</style>
