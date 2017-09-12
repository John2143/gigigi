<template>
    <div>
        Todo: items
    </div>
</template>
<script>
import {addSocketHook} from "./socket.js";

export default {
    data(){
        return {
            sounds: {},
            soundNames: ["whoop.mp3", "alert.mp3"],
            isMuted: false,
            alerts: [],
        };
    },
    methods: {
        playSound(sound){
            if(sound && this.sounds[sound]) this.sounds[sound].play();
        },
        addAlert(dat){
            if(dat.sound && !this.isMuted) this.playSound(dat.sound);
            dat.time = new Date();
            alerts.push(dat);
        }
    },
    created(){
        //Download required sounds
        for(let file of this.soundNames){
            this.sounds[file] = new Audio("/" + file);
            this.sounds[file].volume = .1;
        }

        addSocketHook("alert", (...r) => this.addAlert(...r));
    }
}
</script>
