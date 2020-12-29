<template>
    <div class="container">
        <div class="chat">
            Chat
        </div>
        <div class="gameBoard">
            <img alt="monopoly plateau" src="../assets/monopoly-plateau.jpg" id="plateau">
            <div v-for="index in boxes" :key=index :class="'div'+index">
                <div v-if="players.map(p => p.pos).includes(index)">
                    <div v-for="player in players.filter(p => p.pos == index)" 
                        :key=player.name 
                        :class="'playerPiece ' + player.piece_name">
                    
                    </div>
                </div>
            </div>
        </div>
        <div class="playerList">
            <div v-for="player in players" :key="player.name" class="playerCard">
                <img alt="monopoly plateau" src="../assets/monopoly_boat.jpg">
                <div>
                    {{ player.name }}
                </div>
            </div>
            <button @click="playDice">
                {{ dice1 }} || {{ dice2 }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dice1 : 1,
            dice2 : 1,
            boxes: Array(40).fill().map((_, i) => i+1),
            players: [
                { name: "player 1", piece_name: "boat", pos: 1},
                { name: "player 2", piece_name: "hat", pos: 4},
                { name: "player 3", piece_name: "piece", pos: 34}
            ],
            playerTurn: 0
        }
    },
    methods: {
        playDice() {
            this.dice1 = Math.floor(Math.random() * (6) ) + 1;
            this.dice1 = Math.floor(Math.random() * (6) ) + 1;

            let p = this.players[this.playerTurn];

            p.pos = (p.pos + this.dice1 + this.dice2) ;
            if (p.pos > 40) p.pos -= 40;
            this.players.splice(this.playerTurn, 1, p)

            this.playerTurn = (this.playerTurn + 1) % 3
        }
    }
}
</script>

<style>
    .container {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }
    .chat {
        width: 25%;
        height: 500px;
        border-style: solid;
    }
    .gameBoard {
        width : 540px;
        height: 540px;
        display: grid;
        grid-template-columns: repeat(13, 1fr);
        grid-template-rows: repeat(13, 1fr);
        grid-column-gap: 0px;
        grid-row-gap: 0px;
    }
    .playerList {
        width: 200px;
        height: 500px;
        border-style: solid;
    }

    #plateau {
        width: 540px;
        height: 540px;
        grid-area: 1 / 1 / 14 / 14;
    }

    .playerPiece {
        width: 20px;
        height: 20px;
        justify-content: center;
    }
    .boat {
        background-color: cadetblue;
    }
    .hat {
        background-color: chocolate;
    }
    .piece {
        background-color: darkgreen;
    }


    .playerCard {
        display: flex;
        justify-content: space-around;
    }

    .playerList img {
        width: 50px;
        height: 50px;
    }

    /* .gameBoard div {
        border-style: solid;
    } */

    .div1 { grid-area: 12 / 12 / 14 / 14; }
    .div2 { grid-area: 12 / 11 / 14 / 12; }
    .div3 { grid-area: 12 / 10 / 14 / 11; }
    .div4 { grid-area: 12 / 9 / 14 / 10; }
    .div5 { grid-area: 12 / 8 / 14 / 9; }
    .div6 { grid-area: 12 / 7 / 14 / 8; }
    .div7 { grid-area: 12 / 6 / 14 / 7; }
    .div8 { grid-area: 12 / 5 / 14 / 6; }
    .div9 { grid-area: 12 / 4 / 14 / 5; }
    .div10 { grid-area: 12 / 3 / 14 / 4; }
    .div11 { grid-area: 12 / 1 / 14 / 3; }
    .div12 { grid-area: 11 / 1 / 12 / 3; }
    .div13 { grid-area: 10 / 1 / 11 / 3; }
    .div14 { grid-area: 9 / 1 / 10 / 3; }
    .div15 { grid-area: 8 / 1 / 9 / 3; }
    .div16 { grid-area: 7 / 1 / 8 / 3; }
    .div17 { grid-area: 6 / 1 / 7 / 3; }
    .div18 { grid-area: 5 / 1 / 6 / 3; }
    .div19 { grid-area: 4 / 1 / 5 / 3; }
    .div20 { grid-area: 3 / 1 / 4 / 3; }
    .div21 { grid-area: 1 / 1 / 3 / 3; }
    .div22 { grid-area: 1 / 3 / 3 / 4; }
    .div23 { grid-area: 1 / 4 / 3 / 5; }
    .div24 { grid-area: 1 / 5 / 3 / 6; }
    .div25 { grid-area: 1 / 6 / 3 / 7; }
    .div26 { grid-area: 1 / 7 / 3 / 8; }
    .div27 { grid-area: 1 / 8 / 3 / 9; }
    .div28 { grid-area: 1 / 9 / 3 / 10; }
    .div29 { grid-area: 1 / 10 / 3 / 11; }
    .div30 { grid-area: 1 / 11 / 3 / 12; }
    .div31 { grid-area: 1 / 12 / 3 / 14; }
    .div32 { grid-area: 3 / 12 / 4 / 14; }
    .div33 { grid-area: 4 / 12 / 5 / 14; }
    .div34 { grid-area: 5 / 12 / 6 / 14; }
    .div35 { grid-area: 6 / 12 / 7 / 14; }
    .div36 { grid-area: 7 / 12 / 8 / 14; }
    .div37 { grid-area: 8 / 12 / 9 / 14; }
    .div38 { grid-area: 9 / 12 / 10 / 14; }
    .div39 { grid-area: 10 / 12 / 11 / 14; }
    .div40 { grid-area: 11 / 12 / 12 / 14; }
</style>