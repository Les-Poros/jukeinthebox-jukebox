<template>
  <div v-cloak class="modal">
    <div class="modal-content">
      <p class="white">Veuillez entrer votre token (qrcode)</p>
      <br/>
      <input type="search" v-model="token" class id="token" placeholder="Entrer votre qrcode" v-on:keyup.enter="entrerToken()">
      <button v-on:click="entrerToken()">Valider</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      token: ""
    };
  },
  methods: {
    //permet de valider la saisie d'un token
    entrerToken: function() {
         this.$emit('input', this.token);
    }
  }
};
</script>

<style>
.white {
    color:white
}
.modal {
  /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

.modal-content {
  background-color: gray;
  margin: 40vh 0 0 40vw; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: fit-content; /* Could be more or less, depending on screen size */
}
</style>
