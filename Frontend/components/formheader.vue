<template>
    <div id="Prompt" class=" h-16 rounded-full flex justify-between items-center p-8">
        <p class=" p-[1rem] text-6xl font-bold font-notosans bg-gradient-to-r from-[#61d0f6] from-[-80%] hover:from-[-65%] to-[#5845fa] text-transparent bg-clip-text select-none">
            {{ question }}
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    question: {
      type: String,
      required: true
    }
  }
});
</script>