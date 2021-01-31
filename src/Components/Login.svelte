<script lang="ts">
  import { Button , Snackbar } from "svelma";
  import firebase from "firebase/app";
  import "firebase/auth"
  const login = async ()=>{
      try{
        firebase.auth().signInAnonymously(); 
      }catch(e){
        Snackbar.create({
        message: `登入失敗 ${e}`,
        type: "is-danger",
      });
      }
      
  }
</script>

<section class="section">
  <div class="columns is-centered">
    <div class="column is-half">
      <Button
        type="is-link"
        iconPack="fa"
        iconLeft="user-secret"
        on:click={async () => login()}>
        Sign-in anonymously
      </Button>
    </div>
  </div>
</section>
