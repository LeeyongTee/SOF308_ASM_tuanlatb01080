<!-- BlogCard.vue -->
<template>
  <div class="col-sm-4">
    <div class="card mb-4">
      <img :src="item.image" alt="Ảnh" class="card-img-top" style="height: 233px; object-fit: cover;">
      <div class="card-body">
        <h3 class="card-title fs-2">{{ item.title }}</h3>
        <p class="card-text fs-4">{{ item.content }}</p>
        <button class="btn btn-info" @click="$emit('view', item.id)">Xem chi tiết</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: Object
})
</script>
