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
            <div v-for="(box, index) in room.boxes" :key=index :class="boxClass(index)" @click="build">
                <div :class="(index % 10 != 0) ? 'inside'+Math.floor((index)/10) : ''">
                    <div v-if="box.state == 6" class="hotel">

                    </div>
                    <div v-else-if="(box.state) && (box.state != -1)" class="houses">
                        <div v-for="index in arr(box.state)" :key='index' class="house">
                        </div>
                    </div>
                </div>
                
                <div v-if="room.players.map(p => p.game.pos).includes(index)">
                    <div v-for="player in room.players.filter(p => p.game.pos == index)" 
                        :key=player.name 
                        :class="'playerPiece ' + player.piece_name">
                    
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="playerList">
                <div v-for="player in room.players" :key="player.name" class="playerCard">
                    <img alt="monopoly plateau" src="../assets/monopoly_boat.jpg">
                    <div>
                        <div>
                            {{ player.name }}
                        </div>
                        <div>
                            {{ player.game.money }}
                        </div>
                    </div>
                </div>
                <button @click="playDice" :disabled="!myTurn">
                    {{ room.dice1 }} | {{ room.dice2 }}
                </button>
                <button @click="leaveRoom">
                    Leave room
                </button>
            </div>
            <div class="choiceBox">
                Choice box
                <button @click="buy(false)" :disabled="!canBuy">
                    do not buy
                </button>
                <button @click="buy(true)" :disabled="!canBuy">
                    buy
                </button>
            </div>
            <div v-if="myTurn">
                <button @click="buildMode = !buildMode">
                    {{ buildMode ? 'Cancel' : 'Build'}}
                </button>
            </div>
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
            message: "",
            canBuy: false,
            buildMode: false
        }
    },
    computed: {
        myTurn() {
            if (this.$store.state.player.game && this.room.players) {
                return this.room.players.findIndex((p) => p._id == this.$store.state.player._id) == this.room.playTurn;
            }
            return true;
        }
    },
    methods: {
        boxClass(index) {
            let c = 'box box'+ (index+1) + ((index % 10 != 0) ? ' box0'+Math.floor((index)/10) : '');

            this.room.players.forEach(p => {
                if (p.game.properties.includes(index)) {
                    c += ' property' + p.piece_name
                }
            });
            return c
        },
        playDice() {
            axios.post(config.serverLink + "/game/"+ this.roomId +"/playRound")
            
                .then((res) => {
                    if (res.data.action == "buy") {
                        this.canBuy = true
                    }
                })
                .catch(() => {
                    alert("play round error");
                })
        },
        buy(b) {
            axios.post(config.serverLink + "/game/"+ this.roomId +"/buy", {buy: b})
                .then((res) => {
                    if (b) {
                        this.$store.state.player.game.properties.push(res.data.property);
                    }
                    this.canBuy = false;
                }).catch(() => { alert ('error in buy')})
        },
        build() {
            if (this.buildMode) {
                axios.post(config.serverLink + "/game/" + this.roomId + "/build")
                    .then(() => {
                    }).catch(() => {

                    })
            }
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
                this.$socket.emit('leave_room', this.roomId);
                this.$router.push('/home')

                if (this.room.players.length == 0) {
                    axios.post(config.serverLink + "/game/" + this.roomId + "/deleteRoom"); 
                }
            }).catch(() => {})

        },
        arr(state) {
            return [...Array(state - 1).keys()]
        }
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
        height: 300px;
        border-style: solid;
    }
    .choiceBox {
        width: 200px;
        height: 200px;
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

    .hotel {
        width: 18px;
        height: 18px;
        background-color: darkred;
    }
    .house {
        width: 8px;
        height: 8px;
        background-color: green;
    }

    .propertyboat {
        border-style: solid;
        border-color: cadetblue;
    }
    .propertyhat {
        border-style: solid;
        border-color: chocolate;
    }
    .propertypiece {
        border-style: solid;
        border-color: darkgreen;
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

    .box1 { grid-area: 12 / 12 / 14 / 14; }
    .box2 { grid-area: 12 / 11 / 14 / 12; }
    .box3 { grid-area: 12 / 10 / 14 / 11; }
    .box4 { grid-area: 12 / 9 / 14 / 10; }
    .box5 { grid-area: 12 / 8 / 14 / 9; }
    .box6 { grid-area: 12 / 7 / 14 / 8; }
    .box7 { grid-area: 12 / 6 / 14 / 7; }
    .box8 { grid-area: 12 / 5 / 14 / 6; }
    .box9 { grid-area: 12 / 4 / 14 / 5; }
    .box10 { grid-area: 12 / 3 / 14 / 4; }
    .box11 { grid-area: 12 / 1 / 14 / 3; }
    .box12 { grid-area: 11 / 1 / 12 / 3; }
    .box13 { grid-area: 10 / 1 / 11 / 3; }
    .box14 { grid-area: 9 / 1 / 10 / 3; }
    .box15 { grid-area: 8 / 1 / 9 / 3; }
    .box16 { grid-area: 7 / 1 / 8 / 3; }
    .box17 { grid-area: 6 / 1 / 7 / 3; }
    .box18 { grid-area: 5 / 1 / 6 / 3; }
    .box19 { grid-area: 4 / 1 / 5 / 3; }
    .box20 { grid-area: 3 / 1 / 4 / 3; }
    .box21 { grid-area: 1 / 1 / 3 / 3; }
    .box22 { grid-area: 1 / 3 / 3 / 4; }
    .box23 { grid-area: 1 / 4 / 3 / 5; }
    .box24 { grid-area: 1 / 5 / 3 / 6; }
    .box25 { grid-area: 1 / 6 / 3 / 7; }
    .box26 { grid-area: 1 / 7 / 3 / 8; }
    .box27 { grid-area: 1 / 8 / 3 / 9; }
    .box28 { grid-area: 1 / 9 / 3 / 10; }
    .box29 { grid-area: 1 / 10 / 3 / 11; }
    .box30 { grid-area: 1 / 11 / 3 / 12; }
    .box31 { grid-area: 1 / 12 / 3 / 14; }
    .box32 { grid-area: 3 / 12 / 4 / 14; }
    .box33 { grid-area: 4 / 12 / 5 / 14; }
    .box34 { grid-area: 5 / 12 / 6 / 14; }
    .box35 { grid-area: 6 / 12 / 7 / 14; }
    .box36 { grid-area: 7 / 12 / 8 / 14; }
    .box37 { grid-area: 8 / 12 / 9 / 14; }
    .box38 { grid-area: 9 / 12 / 10 / 14; }
    .box39 { grid-area: 10 / 12 / 11 / 14; }
    .box40 { grid-area: 11 / 12 / 12 / 14; }

    .box {
        display: flex;
        position: relative;
    }
    .box00 {
        flex-direction: column;
    }
    .box01 {
        flex-direction: row;
    }
    .box02 {
        flex-direction: column;
    }
    .box03 {
        flex-direction: row;
    }

    .houses {
        justify-content: space-evenly;
    }
    .inside0 {
        height: 20px;
        width: 100%;
        top: 0;
    }
    .inside0 .houses {
        display: flex;
        flex-direction: row;
    }

    .inside1 {
        width: 20px;
        height: 100%;
        position: absolute;
        right: 0;
    }
    .inside1 .houses {
        display: flex;
    }
    
    .inside2 {
        height: 20px;
        width: 100%;
        position: absolute;
        bottom: 0;
    }   
    .inside2 .houses {
        display: flex;
        flex-direction: row;
    }
     
    .inside3 {
        width: 20px;
        height: 100%;
        left: 0;
    }
    .inside3 .houses {
        display: flex;
    }
    
</style>