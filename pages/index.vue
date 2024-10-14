<template>
  <div>
    <PackageForm />
    <PackageList />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import PackageForm from '~/components/PackageForm.vue'
import PackageList from '~/components/PackageList.vue'
import { usePackageStore } from '~/store/package'

const packageStore = usePackageStore()

onMounted(() => {
  packageStore.loadFromLocalStorage()
})
</script>