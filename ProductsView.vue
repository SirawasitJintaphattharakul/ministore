<template>
    <div class="q-pa-md">
      <div class="q-pa-md">
          <q-btn icon="add" @click="onCreate"/>
      </div>
      <q-table
        title="Treats"
        :rows="rows"
        :columns="columns"
        row-key="name"
      >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" @click="onEdit(props.row.product_id)"/>
          <q-btn icon="delete" @click="onDelete(props.row.product_id)"/>
    
        </q-td>
      </template>
      </q-table>
    </div>
  </template>
  <script setup>
  
   import { ref } from 'vue'
   import router from '@/router';
  
   const columns = ref([
    { name: 'product_id', align: 'center', label: 'product_id', field: 'product_id', sortable: true },
    { name: 'name', align: 'center', label: 'name', field: 'name', sortable: true },
    { name: 'description', align: 'center', label: 'description', field: 'description', sortable: true },
    { name: 'price', align: 'center', label: 'price', field: 'price', sortable: true },
    { name: 'category', align: 'center', label: 'category', field: 'category', sortable: true },
    { name: 'image_url', align: 'center', label: 'image_url', field: 'image_url', sortable: true },
    { name: 'actions', align: 'center', label: 'id', field: 'id', sortable: true },
  ])
  
  const rows =ref([]) 
  
  const fetcData =()=>{
    fetch('http://localhost:8800/api/v1/products')
      .then (res => res.json())
      .then(result =>{
        rows.value =result
    })
  }
  fetcData()
  
  const onEdit = (id)=>{
      router.push('/update/' + id)
  }
  
  const onDelete = (id) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const requestOptions = {
      method: 'DELETE',
      headers: myHeaders, 
      redirect: 'follow'
    };
  
    fetch(`http://localhost:8800/api/v1/peoducts/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        alert(result.message);
        console.log(result);
        if (result.status === 'ok') {
          router.push('/');
        }
        fetcData()
      })
      .catch(error => {
        console.error('Error deleting customer:', error);
        alert('There was a problem deleting the customer.');
      });
  
  };
  
  
  const onCreate= ()=>{
      router.push('/create')
  }
  </script>
  
  