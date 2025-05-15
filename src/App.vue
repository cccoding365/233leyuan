<script setup>
const items = [
  {
    title: "1",
    description: "The first item.",
  },
  {
    title: "2",
    description: "The second item.",
  },
  {
    title: "3",
    description: "The second item.",
  },
  {
    title: "4",
    description: "The second item.",
  },
  {
    title: "5",
    description: "The second item.",
  },
];
</script>

<template>
  <div class="p-1 container  max-w-2xl mx-auto">
    <masonry-wall :items="items" :ssr-columns="1" :column-width="300" :gap="5">
      <template #default="{ item, index }">
        <div class="bg-blue-500 text-white flex flex-col justify-center items-center rounded-md" :style="{ height: `${(index + 1) * 100}px` }">
          <h1 class="text-4xl">{{ item.title }}</h1>
          <span class="text-2xl">{{ item.description }}</span>
        </div>
      </template>
    </masonry-wall>
  </div>
</template>
