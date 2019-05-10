<template>
    <Page>
        <ActionBar title="New Look Invoice" android:flat="true" class="page">  
            <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
            <ActionItem @tap="saveInvoice" text="Save" ios.systemIcon="3" android.systemIcon="ic_menu_save" ios.position="right" android.position="actionBar" />
        </ActionBar>   

        <ScrollView>
            <StackLayout class="app">   
                <GridLayout rows="auto, auto" columns="*">
                    <GridLayout rows="auto,auto,auto,auto,auto" columns="*" row="0">
                        <Label text="Project and Client Details" class="font-weight-bold label-client-name" row="0"/>
                        <FloatLabel placeholder="Client Name" @floatLabelValue="setClientName" row="1" />
                        <FloatLabel placeholder="Client Email" @floatLabelValue="setClientEmail" row="2" />
                        <FloatLabel placeholder="Project Name" @floatLabelValue="setProjectName" row="3" />
                        <FloatTextView class="project-description" placeholder="Project Description" @floatTextViewValue="setProjectDescription" row="4" />
                    </GridLayout>   
                
                    <GridLayout rows="20, 100, auto" columns="*" row="1">
                        <Label class="font-weight-bold" text="Invoice Status" row="0" />
                        <ListPicker :items="['Request for Payment', 'Paid']" row="1"
                        :selectedIndex="invoice.invoice_status"
                        v-model="invoice.invoice_status"
                        @selectedIndexChange="checkInvoiceStatus" />                        
                    </GridLayout>
                </GridLayout>

                <GridLayout rows="auto, auto" columns="*">
                    <Label textDecoration="underline" text="Attach Picture" @tap="attachPicture" row="0" color="blue" />                    
                    <WrapLayout row="1">
                        <Image v-for="img in images" :src="img.src" width="75" height="75" />
                    </WrapLayout>
                </GridLayout>                           

                <GridLayout rows="auto" columns="*">
                    <Label class="font-weight-bold" text="Items for this Project" row="0" />
                </GridLayout> 

                <StackLayout v-for="(item, index) in invoice.items">                        
                        <GridLayout rows="*, *", columns="220,115,*"> 
                            <TextField hint="Project Item" row="0" col="0" v-model="item.item_name" />
                            <TextField @textChange="countTotalPrice" class="price" keyboardType="number" hint="Price in Rupiah" row="0" col="1" v-model="item.item_price" />
                            <Button class="delete-item" color="white" text="X" row="0" col="2" @tap="deleteItem(index)" />
                        </GridLayout>
                </StackLayout>                  
                     
                <GridLayout rows="auto, auto" columns="*">                    
                    <Button class="btn btn-primary" text="Add more items" @tap="addMoreItems" row="0"/>
                    
                    <StackLayout class="total-cost" row="1">
                        <Label class="font-weight-bold" :text="'Total Price: Rp ' + invoice.total_price"/>
                    </StackLayout>      
                </GridLayout>       
            </StackLayout>               
        </ScrollView>
         
  


    </Page>
</template>

<script>
import * as camera from "nativescript-camera";
import { Image } from "tns-core-modules/ui/image";
import * as http from "http";
import SaveInvoiceDialog from '../components/modals/SaveInvoiceDialog';
const bghttp = require("nativescript-background-http");
import App from './App';

export default {
    data() {
        return {            
            invoice: {
                client_name: '',
                client_email: '',
                project_name: '',
                project_description: '',
                items: [{item_name: 'Web Design', item_price: 1250000}],
                invoice_status: 1,
                due_date: '',
                total_price: 0
            },
            images: [],
            counter: 500
        }
    },

    methods: {
        addMoreItems() {            
            this.invoice.items.push({item_name: '', item_price: 0});
        },

        deleteItem(index) {
            this.invoice.items.splice(index, 1);
        },
        saveInvoice() {
            confirm({
                title: 'Save New Invoice',
                message: 'Do you wish to save this invoice? New Look will automatically send an email to the client.',
                okButtonText: 'Yes, I am sure.',
                cancelButtonText: 'Wait, I want to re-check the fields.'
            }).then(res => {                                
                if(res == true) {
                    this.saveInvoiceApi();
                    this.$navigateTo(App);
                    // this.saveInvoiceApi2();
                }
            });
        },

        attachPicture() {
            camera.requestPermissions()
            .then(() => {
                camera.takePicture({ width: 300, height: 300, keepAspectRatio: true, saveToGallery:true })
                .then(imageAsset => {
                    let img = new Image();
                    img.src = imageAsset;
                    this.images.push(img);
                    console.log('ive got '+this.images.length+' images now.');
                })
                .catch(e => {
                    console.log('error ', e);
                })
            })
            .catch(e => {
                console.log('error requesting permission');
            })
        },

        setClientName(name) {            
            this.invoice.client_name = name;
        },

        setClientEmail(email) {
            this.invoice.client_email = email;
        },

        setProjectName(name) {
            this.invoice.project_name = name;
        },

        setProjectDescription(desc) {
            this.invoice.project_description = desc;
        },

        countTotalPrice() {
            this.invoice.total_price = 0;
            this.invoice.items.map(el => {
                this.invoice.total_price += parseInt(el.item_price);
            });
        },

        saveInvoiceApi() {
            console.log('inside save invoice api');
            http.request({
                url: 'http://10.0.2.2:1337/api/invoices',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                content: JSON.stringify(this.invoice)
            })
            .then(res => {
                const invoice_response = res.content.toJSON();
                console.log(invoice_response);
            }, error => {
                console.error(error);
            });
        },

        saveInvoiceApi2() {
            console.log('here1')

            let session = bghttp.session('image-upload');
            let request = {
                url: 'http://httpbin.org/post',
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            let params = [
                {name: 'test', value: 'value'}
            ];

	        let counter = 0;
            this.images.forEach(i => {
                params.push(
                    {
                        name:'image' + (++counter),
                        filename: i.src.android, 
                        mimeType:'image/jpeg'
                    }
                );
            });

            console.log(this.images);

            console.log('here2')

            let task = session.multipartUpload(params, request);
            console.log('here')

            task.on('error', e => {
                console.log('error', e);
            });

            task.on('complete', e => {
                console.log('complete', JSON.stringify(e));
            });

        },

        checkInvoiceStatus(idx) {            
            // if(this.invoice.invoice_status == '0') {
            //     this.$showModal(SaveInvoiceDialog);
            //     this.counter++;
            // }
            // console.log(this.counter);
            // console.log(this.invoice.invoice_status);
        }
    }
}
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    GridLayout {
        padding: 10;
    }

    ListPicker {
        width: 150;
    }

    StackLayout.app {
        padding: 5;
    }

    .price {
        font-size: 14;
    }

    .delete-item {
        background-color: #c04040;
    }

    @keyframes show {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

    DatePicker {
        display: none !important;
    }


</style>

