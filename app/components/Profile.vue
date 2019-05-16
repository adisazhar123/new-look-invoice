<template>
    <GridLayout rows="150, auto, auto, auto, 25, 25, 25, 25, auto" columns="100, *, 120" class="profile">
        
        
        <Image :src="this.profile.image" stretch="none" row="0" col="1" />
        
        <StackLayout row="1" col="1" class="stack-profile">
            <Label :text="this.profile.name"/>
            <Label :text="this.profile.company"  />
            <Label :text="this.profile.phone" />
        </StackLayout>

        <Label :text="this.profile.projects" row="4" col="0" class="bold" />
        <Label text="Projects" row="5" col="0" />

        <Label :text="'Rp' + convertToRupiah(this.profile.revenue)" row="4" col="2" class="bold" />
        <Label text="Revenue" row="5" col="2" />

    
        <Button class="btn btn-primary" text="Edit" row="8" col="0" colSpan="3" @tap="openEditProfilePage" />

    </GridLayout>
</template>

<script>
import EditProfile from '../pages/EditProfile'
import * as http from "http";
import * as Toast from 'nativescript-toast';
const appSettings = require("application-settings");
const user_id = appSettings.getString("user_id");

export default {
    data() {
        return {
            EditProfile,
            profile: {
                id: user_id,
                name: '',
                company: '',
                phone: '',
                image: '',
                revenue: '',
                projects: '',
                address: ''
            }
        }
    },

    mounted() {
        console.log("INIT PROFILE");
        this.initProfile();
    },

    methods: {
        openEditProfilePage() {
            this.$navigateTo(EditProfile, {
                transition: {},
                transitioniOS: {},
                transitionAndroid: {},
                props: {
                    _id: this.profile.id,
                    _name: this.profile.name,
                    _company: this.profile.company,
                    _phone: this.profile.phone,
                    _image: this.profile.image,
                    _address: this.profile.address
                }
            });
        },

        initProfile() {
            http.request({
                url: "http://209.97.167.184:8080/api/account",
                method: "GET",
                headers: { "Content-Type": "application/json", "user-id": user_id }
            }).then(response => {
                var result = response.content.toJSON();
                console.log('projects ', result.projects);
                this.profile.id = result.user[0].id;
                this.profile.name = result.user[0].name;
                this.profile.phone = result.user[0].phone;
                this.profile.company = result.user[0].company;
                this.profile.image = result.user[0].image;
                this.profile.revenue = result.revenue;
                this.profile.projects = result.projects;
                this.profile.address = result.user[0].address;

                console.log('bawahh ', this.profile.projects);
            }, error => {
                console.error(error);
            });

        },

        convertToRupiah(angka)
        {
            var rupiah = '';		
            var angkarev = angka.toString().split('').reverse().join('');
            for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
            return rupiah.split('',rupiah.length-1).reverse().join('');
        }
    }
}
</script>

<style scoped>
    .profile {
        padding: 20;
    }

    .stack-profile Label {
        margin-bottom: 5;
    }

    Label.bold {
        font-weight: bold;
        font-size: 16;
    }

    StackLayout {
        text-align: center;
    }

    Image {
        border-radius: 50%;
    }
</style>
