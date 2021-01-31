<script lang="ts">
  import Hero from "./Components/Hero.svelte";
  import Login from "./Components/Login.svelte";
  import { chatroomStream } from "./stores";
  import { onMount } from "svelte";
  import { Select, Field, Button, Input, Snackbar , Tabs , Tab } from "svelma";
  import "../public/global.css";
  import firebase from "firebase/app";
  import "firebase/auth";
  import Chatroom from "./View/Chatroom.svelte";
  const firebaseConfig = {
    apiKey: "AIzaSyBx26qU4L_Afbdbc3u6lnt9k4UyTtsMC3g",
    authDomain: "secretchat-445e5.firebaseapp.com",
    projectId: "secretchat-445e5",
    storageBucket: "secretchat-445e5.appspot.com",
    messagingSenderId: "975055876280",
    appId: "1:975055876280:web:a0eda7f0e41636e37dc44d",
    measurementId: "G-JZD47KMGXV",
  };
  firebase.initializeApp(firebaseConfig);
  const generateId = (length: number) => {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const seq = Math.floor(Math.random() * charset.length);
      result += charset[seq];
    }
    return result;
  };
  let loggedIn = false;
  let name = `新使用者${generateId(6)}`;
  let inputName = "";
  let chatrooms = ["global"];
  let selectedChatroom = chatrooms[0];
  let newChatroomName = "";
  onMount(async () => {
    await firebase.auth().signOut();
  });
  firebase.auth().onAuthStateChanged(() => {
    loggedIn = firebase.auth().currentUser === null ? false : true;
  });
  const changeName = () => {
    if (inputName != "") {
      name = inputName;
      inputName = "";
      Snackbar.create({
        message: `已更新使用者名稱：${name}`,
        type: "is-success",
      });
    }
  };

  const currentId = generateId(32);
</script>

<svelte:head
  ><script
    defer
    src="https://kit.fontawesome.com/230002ca0f.js"
    crossorigin="anonymous">
  </script></svelte:head
>

<Hero title="悄悄話聊天室" subtitle="By Maowman" />
{#if loggedIn}
  <section class="section">
    <Tabs style="is-boxed is-centered">
      <Tab label="聊天室" icon="comments">
        <Chatroom
          currentId={currentId}
          currentName={name}
        />
      </Tab>
      <Tab label="設定" icon="cogs">
        <Field label="選擇聊天室：">
          <div class="select">
            <select bind:value={ selectedChatroom }  on:change={()=>chatroomStream.set(selectedChatroom)} on:blur = {()=>{}} >
              {#each chatrooms as chatroom }
                <option value={chatroom}>{chatroom}</option>
              {/each}
            </select>
          </div>
        </Field>
        <Field>
          <Input placeholder="聊天室名稱" bind:value={newChatroomName} />
          <p class="control">
            <Button
              type="is-link"
              iconLeft="comment-medical"
              on:click={() => {
                if (newChatroomName != "") {
                  chatrooms.push(newChatroomName);
                  chatrooms = chatrooms;
                  newChatroomName = "";
                }
              }}>搜尋/新增聊天室</Button
            >
          </p>
        </Field>
        <Field>
          <Input placeholder="使用者名稱" bind:value={inputName} />
          <p class="control">
            <Button
              type="is-link"
              iconLeft="user-cog"
              on:click={() => changeName()}>更改使用者姓名</Button
            >
          </p>
        </Field>
      </Tab>
    </Tabs>
  </section>
{:else}
  <Login />
{/if}
