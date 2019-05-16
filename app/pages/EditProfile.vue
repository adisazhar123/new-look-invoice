<template>
    <Page>
        <ActionBar title="Edit Account" android:flat="true" class="page">
            <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
            <ActionItem @tap="updateProfile1" text="Save" ios.systemIcon="3" android.systemIcon="ic_menu_save" ios.position="right" android.position="actionBar" />
        </ActionBar>   

        <StackLayout>
            <FloatLabel ref="accountName" placeholder="Account Name" @floatLabelValue="setAccountName"/>
            <FloatLabel ref="companyName" placeholder="Company Name" @floatLabelValue="setCompany"/>
            <FloatLabel ref="companyAddress" placeholder="Company Address" @floatLabelValue="setAddress"/>
            <FloatLabel ref="phone" placeholder="Contact Number" @floatLabelValue="setPhone"/>
            <Label text="Account Profile Picture" />

            <GridLayout rows="auto" columns="auto, auto">
                <Button row="0" col="0" text="Take picture"  @tap="attachPicture" />
                <Button row="0" col="1" text="Select from gallery" @tap="selectPicture" />
            </GridLayout>

            <WrapLayout>
                <Image :src="this.image.src"/>
            </WrapLayout>
        </StackLayout>
  


    </Page>
</template>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }
</style>

<script>
import * as camera from "nativescript-camera";
import * as imagepicker from "nativescript-imagepicker";
import { Image } from "tns-core-modules/ui/image";
const bghttp = require("nativescript-background-http");
import App from '../pages/App'
import * as http from "http";

export default {
    data() {
        return {            
          profile: {
                id: this._id,
                name: this._name,
                company: this._company,
                phone: this._phone,
                image: this._image,
                address: this._address
            },
            image: {},
        }
    },

    props: {
        _id: {
            type: String
        },
        _name: {
            type: String
        },
        _company: {
            type: String
        },
        _phone: {
            type: String
        },
        _image: {
            type: String
        },
        _address: {
            type: String
        }
    },

    mounted() {
        this.initAccount();
    },

    methods: {
        initAccount() {
            this.$refs['accountName'].value = this.profile.name;
            this.$refs['companyName'].value = this.profile.company;
            this.$refs['phone'].value = this.profile.phone;
            this.$refs['companyAddress'].value = this.profile.address;
            this.$refs['phone'].keyboardType = 'phone';

        },

        updateProfile1() {
            if (Object.keys(this.image).length) {
                this.updateProfile();
            } else {
                this.updateProfile2();
            }
        },

         attachPicture() {
            camera.requestPermissions()
            .then(() => {
                camera.takePicture({ width: 300, height: 300, keepAspectRatio: true, saveToGallery:true })
                .then(imageAsset => {
                    let img = new Image();
                    img.src = imageAsset;
                    this.image = img;
                })
                .catch(e => {
                    console.log('error ', e);
                })
            })
            .catch(e => {
                console.log('error requesting permission');
            })
        },

        selectPicture() {

			let context = imagepicker.create({
				mode: 'single' 
			});

			context.authorize()
			.then(function() {
				return context.present();
			})
			.then(selection => {
				selection.forEach(selected => {
					
					console.log(JSON.stringify(selected));

					let img = new Image();
					img.src = selected;
					this.image = img;
				});
			}).catch(function (e) {
				console.log('error in selectPicture', e);
			});

        },
        
        setAccountName(name) {
            this.profile.name = name;
        },

        setCompany(company) {
            this.profile.company = company;
        },

        setPhone(phone) {
            this.profile.phone = phone;
        },

        setAddress(address) {
          this.profile.address = address;
        },

        updateProfile() {
            console.log('here1');

            let session = bghttp.session('image-upload');
            let request = {
                url: 'http://209.97.167.184:8080/api/account',
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            let params = [
                {name: 'profile', value: JSON.stringify(this.profile)},
                {
                    name:'image',
                    filename: this.image.src.android, 
                    mimeType:'image/jpeg'
                }
            ];



            console.log('here2');

            let task = session.multipartUpload(params, request);
            console.log('here');

            task.on('error', e => {
                console.log('error', e);
            });

            task.on('complete', e => {
                console.log('complete', JSON.stringify(e));
                this.$navigateTo(App);
            });
        },

        updateProfile2() {
            http.request({
                url: 'http://209.97.167.184:8080/api/account',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                content: JSON.stringify({profile: this.profile})
            })
            .then(res => {
                const invoice_response = res.content.toJSON();
                console.log(invoice_response);
                this.$navigateTo(App);
            }, error => {
                console.error(error);
            });
        }
    }
}
</script>

<style scoped>
    StackLayout {
        padding: 20;
    }
</style>

