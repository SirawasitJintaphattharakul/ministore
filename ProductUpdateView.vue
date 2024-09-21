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
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  
    const id = ref(route.params.id);
    const name = ref('')
    const description = ref('')
    const price = ref('')
    const category = ref('')
    const image_url = ref('')
    
  
  // ดึงข้อมูลลูกค้าเมื่อคอมโพเนนต์ถูก mount
  const fetchData = () => {
    fetch('http://localhost:8800/api/v1/products/' + id.value)
      .then(res => res.json())
      .then((result) => {
        name.value = result.name;
        description.value = result.description;
        price.value = result.price;
        category.value = result.category;
        image_url.value = result.image_url;
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        alert('Error fetching data:', error);
      });
  };
  fetchData();
  
  // ฟังก์ชันสำหรับอัปเดตข้อมูลลูกค้า
  const onSubmit = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const raw = JSON.stringify({
      "first_name": first_name.value,
      "last_name": last_name.value,
      "email": email.value,
      "address": address.value,
      "phone_number": phone_number.value
    });
  
    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
  
    fetch(`http://localhost:8800/api/v1/customers/`+ id.value, requestOptions)
      .then((response) => {
        if(!response.ok) {
            return response.json().then((err) => {
                throw new Error(err.message || 'Something went worng!'); 
            });
        }
        return response.json()
      })
      .then((result) => {
        alert(result.message);
        console.log(result);
        if(result.status === 'ok'){
            router.push('/')

        }
        fetchData()
      })
      .catch((error) => {
        console.error('Error updating customer:', error)
        alert(`Error: ${error.message}`)
    });
  };
  </script>