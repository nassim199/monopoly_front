<template>
    <div class="container">
        <div class="chat">
            <ul>
                <li v-for="(message, index) in room.chat" :key="index">
                    {{ message }}
                </li>
            </ul>
            <div>
                <input type="text" v-model="message">
                <button @click="sendMessage">
                    Send Message
                </button>
            </div>
        </div>
        <div class="gameBoard">
            <img alt="monopoly plateau" src="../assets/monopoly-plateau.jpg" id="plateau">
            <div v-for="(box, index) in room.boxes" :key=index :class="'div'+index">
                <div v-if="room.players.map(p => p.game.pos).includes(index)">
                    <div v-for="player in room.players.filter(p => p.game.pos == index)" 
                        :key=player.name 
                        :class="'playerPiece ' + player.piece_name">
                    
                    </div>
                </div>
            </div>
        </div>
        <div class="playerList">
            <div v-for="player in room.players" :key="player.name" class="playerCard">
                <img alt="monopoly plateau" src="../assets/monopoly_boat.jpg">
                <div>
                    {{ player.name }}
                </div>
            </div>
            <button @click="playDice" :disabled="myTurn">
                {{ room.dice1 }} | {{ room.dice2 }}
            </button>
            <button @click="leaveRoom">
                Leave room
            </button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import config from '../config'

export default {
    data() {
        return {
            room: {},
            player: {},
            roomId: this.$route.params.roomId,
            message: ""
        }
    },
    computed: {
        myTurn() {
            return false;
            //return this.$store.state.player.game.pos == this.room.playTurn;
        }
    },
    methods: {
        playDice() {
            axios.post(config.serverLink + "/game/"+ this.roomId +"/playRound");
                // .then((res) => {
                //     this.room = res.data;
                // })
                // .catch(() => {
                //     alert("play round error");
                // })
        },
        sendMessage() {
    
            axios.post(config.serverLink + "/game/"+ this.roomId +"/chat", {
                message: this.message
            });
            this.message = "";
        },
        leaveRoom() {
            axios.post(config.serverLink + "/game/"+this.roomId+ "/leaveRoom", {
                playerId: this.$store.state.player._id
            }).then(() => {
                this.$router.push('/home')

                if (this.room.players.length == 0) {
                    axios.post(config.serverLink + "/game/" + this.roomId + "/deleteRoom"); 
                }
            }).catch(() => {})

        },
    },
    created() {
        axios.get(config.serverLink + "/game/"+this.roomId)
            .then((res) => { 
                this.room = res.data;  
           })
            .catch(() => {

            });
    },
    sockets: {
        playRound(room) {
            this.room = room;
        },
        chatMessage(data) {
            const message = data.newMessage;
            let r = this.room
            r.chat.push(message);

            this.room = r;
        },
        leftRoom(player) {
            let r = this.room

            r.players = r.players.filter((p) => p._id != player._id);

            this.room = r
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