/* eslint-disable */
import * as algosdk from 'algosdk';
import { Base64 } from 'js-base64';
import { Dapp, Account, DappLocalState } from "@/types";
import { Transaction } from 'algosdk';
import { escrow } from './escrow-teal';
declare const AlgoSigner: any;
const CREATOR = process.env.VUE_APP_CREATOR_ADDRESS;
const LEDGER_NAME = process.env.VUE_APP_LEDGER_NAME;


export default {
    /**
     * Connect to AlgoSigner. Must be called before any other api call that uses it.
     */
    async connectAlgoSigner() {
        await AlgoSigner.connect();
    },

    /**
     * Use AlgoSigner to query the Algorand blockchain for a list of Algo-VoteDApps made by CREATOR.
     * 
     * @returns List of DApps.
     */
    async getDapps(): Promise<Dapp[]> {

        // Query the indexer
        const r = await AlgoSigner.indexer({
            ledger: LEDGER_NAME,
            path: `/v2/accounts/${CREATOR}`
        });
        const apps = r['account']['created-apps'];

        const dapps: Dapp[] = []
        apps.forEach((app: any) => {

            // Initialise the Dapp object
            const dapp: Dapp = {
                Id: app['id'],
                Team1: {
                    Name: '',
                    Total: 0
                },
                Team2: {
                    Name: '',
                    Total: 0
                },
                Winner: '',
                Escrow: '',
                LimitDate: 0,
                EndDate: 0
            }

            // Get all global state variables and decode them
            app['params']['global-state'].forEach((item: any) => {
                const key = Buffer.from(item['key'], 'base64').toString('ascii');

                const val_str = Buffer.from(item['value']['bytes'], 'base64').toString('ascii');
                const val_uint = item['value']['uint'];
                switch (key) {
                    case "Team1":
                        dapp.Team1.Name = val_str;
                        break;

                    case "Team2":
                        dapp.Team2.Name = val_str;
                        break;

                    case "Team1Total":
                        dapp.Team1.Total = val_uint;
                        break;

                    case "Team2Total":
                        dapp.Team2.Total = val_uint;
                        break;

                    case "Winner":
                        dapp.Winner = val_str;
                        break;

                    case "LimitDate":
                    case "EndDate":
                        dapp[key] = val_uint;
                        break;

                    case "Escrow": {
                        const bytes = Base64.toUint8Array(item['value']['bytes']);
                        const addr = algosdk.encodeAddress(bytes);
                        if (!algosdk.isValidAddress(addr)) {
                            throw Error(`Escrow value for app with id ${dapp.Id} is not a valid address! (${addr})`);
                        }
                        dapp.Escrow = addr
                        break;
                    }

                    default:
                        console.warn(`Unexpected global variable "${key}" from app with id ${dapp.Id}`)
                        break;
                }
            });
            
            // Don't add DApps that don't have an escrow address set, as users will not be able to vote.
            if (dapp.Escrow !== "") {
                dapps.push(dapp as Dapp);
            }
        });

        return dapps;
    },

    /**
     * Query AlgoSigner for a list of user accounts
     * 
     * @returns The list of Accounts.
     */
    async getUserAccounts(): Promise<Account[]> {
        const accountsRaw = await AlgoSigner.accounts({
            ledger: LEDGER_NAME,
        });

        const userAccounts: Account[] = [];

        // Generate shorthand for display purposes
        accountsRaw.forEach((account: any) => {
            const len = account.address.length;
            const slice = account.address.slice(0, 6)
                + " ... "
                + account.address.substr(len - 6, len);

            const acc: Account = {
                address: account.address,
                short: slice
            };

            userAccounts.push(acc);
        });

        return userAccounts;
    },


    /**
     * For a given list of app ids, check if an account has opted in to it or not. If it has, also provide information on its local state.
     * 
     * @param appIds List of app ids to filter for.
     * @param accounts List of accounts to check.
     * @returns List of objects that include information about the user account, the corresponding app id, and their local state for that app id.
     */
    async getActiveDapps(dapps: Dapp[], account: Account): Promise<DappLocalState[]> {
        const activeAccounts: DappLocalState[] = [];

        // Query the indexer for account information
        const info = await AlgoSigner.indexer({
            ledger: LEDGER_NAME,
            path: `/v2/accounts/${account.address}`
        });


        if ('account' in info && 'apps-local-state' in info['account']) {
            info['account']['apps-local-state'].forEach((app: any) => {
                // Check if this app is in our list of dapps
                const dapp = dapps.find(dapp => dapp.Id === app['id']);

                // If it is, add local state information to the list
                if (dapp !== undefined) {
                    const localState: DappLocalState = {
                        dapp: dapp,
                        Team: '',
                        Bet: 0,
                        account: account,
                    }

                    app['key-value'].forEach((item: any) => {
                        const key = Buffer.from(item['key'], 'base64').toString('ascii');
                        switch (key) {
                            case "MyTeam":
                                localState.Team = Buffer.from(item['value']['bytes'], 'base64').toString('ascii');
                                break;

                            case "MyBet":
                                localState.Bet = item['value']['uint']
                                break;

                            default:
                                console.warn(`Unexpected global variable "${key}" from app with id ${app['id']}`)
                                break;
                        }
                    });

                    activeAccounts.push(localState);
                }
            });
        }

        return activeAccounts;
    },

    /**
     * Query the blockchain for suggested params, and set flat fee to True and the fee to the minimum.
     * 
     * @returns The paramaters.
     */
    async getMinParams(): Promise<algosdk.SuggestedParams> {
        const suggestedParams = await AlgoSigner.algod({
            ledger: LEDGER_NAME,
            path: '/v2/transactions/params'
        });

        const params: algosdk.SuggestedParams = {
            fee: suggestedParams["min-fee"],
            flatFee: true,
            firstRound: suggestedParams["last-round"],
            genesisHash: suggestedParams["genesis-hash"],
            genesisID: suggestedParams["genesis-id"],
            lastRound: suggestedParams["last-round"] + 1000,
        }

        return params
    },

    /**
     * Bet on a team by opting in to the DApp
     * 
     * @param address       The address of the user.
     * @param dapp          The DApp in question.
     * @param amount        The amount to wager.
     * @param teamName      The team neame to bet for. 
     */
    async optInToDapp(address: string, dapp: Dapp, amount: number, teamName: string) {
        const params = await this.getMinParams();

        // Construct the transaction
        const tx0 = new algosdk.Transaction({
            to: dapp.Escrow,
            from: address,
            amount: amount,
            ...params,
        });
        const myTeam = new TextEncoder().encode(teamName);
        const tx1 = algosdk.makeApplicationOptInTxn(
            address,
            params,
            dapp.Id,
            [myTeam]
        );

        // Sign and send
        await this.combineAndSend(tx0, tx1);
    },

    /**
     * Helper function to combine two transactions, sign them with AlgoSigner, and send them to the blockchain
     * 
     * @param tx0 The first transaction
     * @param tx1 The second transaction
     */
    async combineAndSend(tx0: Transaction, tx1: Transaction) {
        algosdk.assignGroupID([tx0, tx1]);

        const binaryTxs = [tx0.toByte(), tx1.toByte()];
        const base64Txs = binaryTxs.map((binary) => AlgoSigner.encoding.msgpackToBase64(binary));

        const signedTxs = await AlgoSigner.signTxn([
            {
                txn: base64Txs[0],
            },
            {
                txn: base64Txs[1],
            },
        ]);

        const binarySignedTxs = signedTxs.map((tx: any) => AlgoSigner.encoding.base64ToMsgpack(tx.blob));
        const combinedBinaryTxns = new Uint8Array(binarySignedTxs[0].byteLength + binarySignedTxs[1].byteLength);
        combinedBinaryTxns.set(binarySignedTxs[0], 0);
        combinedBinaryTxns.set(binarySignedTxs[1], binarySignedTxs[0].byteLength);

        const combinedBase64Txns = AlgoSigner.encoding.msgpackToBase64(combinedBinaryTxns);

        await AlgoSigner.send({
            ledger: LEDGER_NAME,
            tx: combinedBase64Txns,
        });
    },

    /**
     * Helper function used to calculate how much a user is entitled to if they win for the given parameters.
     * 
     * @param myBet 
     * @param myTeamTotal 
     * @param otherTeamTotal 
     * @param fee 
     * @returns The amount a user may claim.
     */
    calculateClaimAmount(myBet: number, myTeamTotal: number, otherTeamTotal: number, fee = 1000) {
        return Math.floor(myBet / myTeamTotal * (myTeamTotal + otherTeamTotal) - fee)
    },

    calculateReclaimAmount(myBet: number, fee = 1000) {
        return myBet - fee
    },

    async getLogicSig(dls: DappLocalState) {
        // Compile the escrow stateless smart contract in order to construct the LogicSig
        const escrow_src = escrow(dls.dapp.Id);
        const response = await AlgoSigner.algod({
            ledger: LEDGER_NAME,
            path: '/v2/teal/compile',
            body: escrow_src,
            method: 'POST',
            contentType: 'text/plain',
        });
        if (response['hash'] !== dls.dapp.Escrow) {
            throw Error(`Escrow program hash ${response['hash']} did not equal the dapps's escrow address ${dls.dapp.Escrow}`)
        }

        const program = new Uint8Array(Buffer.from(response['result'], 'base64'));
        return algosdk.makeLogicSig(program);
    },

    /**
     * Claim winnings for a given user.
     * 
     * @param dls DappLocalState object.
     */
    async claimFromDapp(dls: DappLocalState) {
        const lsig = await this.getLogicSig(dls);

        const params = await this.getMinParams();

        // Calculate winnings
        let myTeamTotal = dls.dapp.Team1.Total;
        let otherTeamTotal = dls.dapp.Team2.Total;
        if (dls.Team !== dls.dapp.Team1.Name) {
            myTeamTotal = dls.dapp.Team2.Total;
            otherTeamTotal = dls.dapp.Team1.Total;
        }
        const amount = this.calculateClaimAmount(dls.Bet, myTeamTotal, otherTeamTotal);

        // Construct the transaction
        console.log("Claiming " + amount + " with account " + dls.account.address);
        const txn_1 = new algosdk.Transaction({
            to: dls.account.address,
            from: lsig.address(),
            amount: amount,
            ...params
        })

        const args: Uint8Array[] = [];
        args.push(new Uint8Array(Buffer.from('claim')))

        const txn_2 = algosdk.makeApplicationNoOpTxn(dls.account.address, params, dls.dapp.Id, args);

        algosdk.assignGroupID([txn_1, txn_2]);

        const binaryTxs = [txn_1.toByte(), txn_2.toByte()];
        const base64Txs = binaryTxs.map((binary) => AlgoSigner.encoding.msgpackToBase64(binary));

        // Sign the app call with the user's account
        const signedTxs = await AlgoSigner.signTxn([
            {
                txn: base64Txs[0],
                signers: []
            },
            {
                txn: base64Txs[1],
            },
        ]);

        // Sign the payment transaction with the LogicSig
        const stxn_1 = algosdk.signLogicSigTransactionObject(txn_1, lsig);
        const signedTx1Binary = stxn_1.blob;
        const signedTx2Binary = AlgoSigner.encoding.base64ToMsgpack(signedTxs[1].blob);

        const combinedBinaryTxns = new Uint8Array(signedTx1Binary.byteLength + signedTx2Binary.byteLength);
        combinedBinaryTxns.set(signedTx1Binary, 0);
        combinedBinaryTxns.set(signedTx2Binary, signedTx1Binary.byteLength);

        const combinedBase64Txns = AlgoSigner.encoding.msgpackToBase64(combinedBinaryTxns);

        await AlgoSigner.send({
            ledger: LEDGER_NAME,
            tx: combinedBase64Txns,
        });
    },

    async reclaimFromDapp(dls: DappLocalState) {
        const lsig = await this.getLogicSig(dls);

        const params = await this.getMinParams();

        const amount = this.calculateReclaimAmount(dls.Bet);

        // Construct the transaction
        console.log("Reclaiming " + amount + " with account " + dls.account.address);
        const txn_1 = new algosdk.Transaction({
            to: dls.account.address,
            from: lsig.address(),
            amount: amount,
            ...params
        })

        const args: Uint8Array[] = [];
        args.push(new Uint8Array(Buffer.from('reclaim')))

        const txn_2 = algosdk.makeApplicationNoOpTxn(dls.account.address, params, dls.dapp.Id, args);

        algosdk.assignGroupID([txn_1, txn_2]);

        const binaryTxs = [txn_1.toByte(), txn_2.toByte()];
        const base64Txs = binaryTxs.map((binary) => AlgoSigner.encoding.msgpackToBase64(binary));

        // Sign the app call with the user's account
        const signedTxs = await AlgoSigner.signTxn([
            {
                txn: base64Txs[0],
                signers: []
            },
            {
                txn: base64Txs[1],
            },
        ]);

        // Sign the payment transaction with the LogicSig
        const stxn_1 = algosdk.signLogicSigTransactionObject(txn_1, lsig);
        const signedTx1Binary = stxn_1.blob;
        const signedTx2Binary = AlgoSigner.encoding.base64ToMsgpack(signedTxs[1].blob);

        const combinedBinaryTxns = new Uint8Array(signedTx1Binary.byteLength + signedTx2Binary.byteLength);
        combinedBinaryTxns.set(signedTx1Binary, 0);
        combinedBinaryTxns.set(signedTx2Binary, signedTx1Binary.byteLength);

        const combinedBase64Txns = AlgoSigner.encoding.msgpackToBase64(combinedBinaryTxns);

        await AlgoSigner.send({
            ledger: LEDGER_NAME,
            tx: combinedBase64Txns,
        });
    }
}