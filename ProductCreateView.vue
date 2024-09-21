<template>
    <div class="q-pa-md" style="max-width: 400px">
    <q-form
    @submit="onSubmit"
    class="q-gutter-md"
    >
    <q-input v-model="name" label="Name" />
    <q-input v-model="description" label="Description" />
    <q-input v-model="price" label="Price" />
    <q-input v-model="category" label="Category" />
    <q-input v-model="image_url" label="Image Url" />
    <q-btn label="Submit" type="submit"
    color="primary"/>
    </q-form>
    </div>
    </template>
    
    <script setup>
    import { ref } from 'vue';
    import router from '@/router';


    const name = ref('')
    const description = ref('')
    const price = ref('')
    const category = ref('')
    const image_url = ref('')
    
//////////////////////////////
const onSubmit = () => {const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "name": name.value,
  "description": description.value, 
  "price": price.value,
  "category": category.value,
  "image_url": image_url.value
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:8800/api/v1/products", requestOptions)
  .then((response) => response.json())
  .then((result) => {
    alert(result.message);
    console.log(result);
    if (result.status === "success") {
      router.push("/");
    }
  })
  .catch((error) => console.error(error));
    }
    </script>