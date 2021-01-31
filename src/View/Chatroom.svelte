<script lang="ts">
  export let currentId: string, currentName: string;
  import { onMount, onDestroy, afterUpdate } from "svelte";
  import { Input, Field, Button , Snackbar } from "svelma";
  import { chatroomStream } from "../stores";
  import firebase from "firebase/app";
  import "firebase/firestore";

  import Message from "../Components/Message.svelte";

  let lastUpdatedTime = Date.now();
  let chatroomName = "global";
  let firstSnapshot = true;
  let lastMessage = null;
  let messages = [];
  let inputValue = "";
  let chatroomRef = firebase.firestore().collection(chatroomName);
  let listener = ()=>{};
  const updateTime = () => {
    lastUpdatedTime = Date.now();
  };
  const initMessages = async () => {
    updateTime();
    messages = [];
    lastMessage = null;
    listener();
    chatroomRef = firebase.firestore().collection(chatroomName);
    firstSnapshot = true;
    await getMessages();
    listener = chatroomRef.onSnapshot(
      function (snapshot) {
        if (firstSnapshot) {
          firstSnapshot = false;
          return;
        }
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            console.log("message incoming");
            messages.push(change.doc.data());
            if (messages.length === 1) {
              lastMessage = change.doc.ref;
            }
          }
          updateTime();
          messages = messages;
        });
      },
      function (error) {
        listener();
      }
    );
  };

  const getMessages = async () => {
    console.log("getMessages");
    let query =
      lastMessage === null
        ? await chatroomRef.orderBy("time", "desc").limit(5).get()
        : await chatroomRef
            .orderBy("time", "desc")
            .startAfter(lastMessage)
            .limit(5)
            .get();
    if (query.size != 0) {
      lastMessage = query.docs[query.size - 1];
      query.forEach((document) => {
        messages.unshift(document.data());
      });
    }
    else{
      Snackbar.create({
        message: "已無訊息可供加載",
        type: "is-danger",
      });
    }
    messages = messages;
  };
  const sendMessage = async () => {
    if (inputValue === "") {
      return;
    }
    const currentTime = Date.now();
    await chatroomRef.add({
      sender: currentName,
      senderId: currentId,
      time: currentTime,
      content: inputValue,
    });
  };
  onMount(async () => {
    initMessages();
  });
  const unsubscribe = chatroomStream.subscribe(async (value) => {
    if (value != chatroomName){
      chatroomName = value;
      await initMessages();
    }
  });
  onDestroy(() => {
    listener();
    unsubscribe()
  });
  
</script>

<Button type="is-success">聊天室：{chatroomName} 姓名：{currentName}</Button>
<div id="messagesShower">
  {#if messages.length === 0}
    <Message
      sender="系統提示"
      time={lastUpdatedTime}
      content={"這個聊天室沒有任何訊息"}
      self={false}
    />
  {:else}
    {#each messages as message}
      <Message
        {...message}
        self={message.senderId === currentId ? true : false}
      />
    {/each}
  {/if}
</div>

<div id="messageSender">
  <Field>
    <Button
      type="is-danger"
      iconLeft="sync"
      on:click={async () => {
        await getMessages();
      }}>載入更多</Button
    >
    <Input
      type="text"
      placeholder="說點有趣的吧！"
      bind:value={inputValue}
      expanded
    />
    <Button
      type="is-primary"
      iconLeft="paper-plane"
      on:click={async () => {
        sendMessage();
      }}>送出</Button
    >
  </Field>
</div>
