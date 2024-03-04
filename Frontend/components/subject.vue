<template>
    <div draggable="false" class=" bg-gradient-to-b from-[#61d0f6] from-[-80%] hover:from-[-65%] to-[#5845fa] opacity-100 w-[13rem] h-[15rem] rounded-[10px] shadow-xl flex flex-col items-center justify-center gap-3 hover:-translate-y-5 transition-all ease-in-out">
            <img :src=svg alt="Subject Icon" class=" select-none" draggable="false">
            <p class=" font-notosans text-4xl font-semibold text-slate-100 select-none" draggable="false">{{ subject }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    subject: {
      type: String,
      required: true
    },
    svg: {
      type: String,
      required: true
    }
  }
});
</script>