<template>
    <ListView for="client in clients">
        <v-template height="150">
            <GridLayout rows="20, 20" columns="*" class="clients">
                <Label fontWeight="bold" row="0" col="0" class="client-name" :text="client.client_name"/>
                <Label row="1" col="0" class="client-email" :text="client.client_email" />
            </GridLayout>
        </v-template>
    </ListView>
</template>

<script>
import * as http from "http";
const appSettings = require("application-settings");
const user_id = appSettings.getString("user_id");

    export default {
        data() {
            return {
                client: {
                  name: '',
                  email: ''
                },
                clients: []
            }
        },

        mounted() {
            this.getClients();
        },

        methods: {
            getClients() {
                http.request({
                    url: 'http://209.97.167.184:8080/api/clients',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', 'user-id': user_id}                
                })
                .then(res => {
                    this.clients = res.content.toJSON();
                }, error => {
                    console.error(error);
                });
            }
        }
    }
</script>

<style scoped>
    .clients {
        padding: 10;
    }
</style>