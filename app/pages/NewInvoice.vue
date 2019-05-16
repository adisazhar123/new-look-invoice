<template>
    <Page>
        <ActionBar title="New Look Invoice" android:flat="true" class="page">  
            <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack"></NavigationButton>
            <ActionItem @tap="saveInvoice" text="Save" ios.systemIcon="3" android.systemIcon="ic_menu_save" ios.position="right" android.position="actionBar"></ActionItem>
        </ActionBar>   

        <ScrollView>
            <StackLayout class="app">   
                <GridLayout rows="auto, 100" columns="*">
                    <GridLayout rows="auto,auto,auto,auto,auto" columns="*" row="0">
                        <Label text="Project and Client Details" class="font-weight-bold label-client-name" row="0"></Label>
                        <FloatLabel placeholder="Client Name" @floatLabelValue="setClientName" row="1" />
                        <FloatLabel ref="clientEmail" placeholder="Client Email" @floatLabelValue="setClientEmail" row="2" />
                        <FloatLabel placeholder="Project Name" @floatLabelValue="setProjectName" row="3" />
                        <FloatTextView class="project-description" placeholder="Project Description" @floatTextViewValue="setProjectDescription" row="4" />
                    </GridLayout>   
                
                    <GridLayout rows="20, 80, auto" columns="*" row="1">
                        <Label class="font-weight-bold" text="Invoice Status" row="0"></Label>
                        <RadioGroup row="1"
                            @selected="radioButtonSelect">
                            <RadioButton key="1" text="Paid" checked></RadioButton>
                            <RadioButton key="0" text="Request for Payment"></RadioButton>
                        </RadioGroup>
                    </GridLayout>
                </GridLayout>

                <GridLayout row="10, auto" v-if="!this.invoice.invoice_status" style="padding: 20">
                    <Label class="font-weight-bold" text="Due Date"></Label>
                    <DatePicker @dateChange="setDueDate" />
                </GridLayout>

                <GridLayout rows="20, 80, auto" columns="*" style="padding: 20">
                    <Label class="font-weight-bold" text="Invoice Theme" row="0"></Label>
                    <RadioGroup row="1"
                                @selected="themeSelect">
                        <RadioButton key="0" text="Cyan" checked></RadioButton>
                        <RadioButton key="1" text="Teal"></RadioButton>
                        <RadioButton key="1" text="Magenta"></RadioButton>
                    </RadioGroup>
                </GridLayout>

                <GridLayout rows="auto, auto" columns="*">
                    <Label textDecoration="underline" text="Attach Picture" @tap="attachPicture" row="0" color="blue"></Label>
                    <WrapLayout row="1">
                        <Image :src="this.image.src" width="75" height="75"></Image>
                    </WrapLayout>
                </GridLayout>


                <GridLayout rows="auto" columns="*">
                    <Label class="font-weight-bold" text="Items for this Project" row="0"></Label>
                </GridLayout> 

                <StackLayout v-for="(item, index) in invoice.items">                        
                        <GridLayout rows="*, *", columns="220,115,*">
                            <TextField hint="Project Item" row="0" col="0" v-model="item.item_name"></TextField>
                            <TextField ref="itemPrice" @textChange="countTotalPrice" class="price" keyboardType="number" hint="Price in Rupiah" row="0" col="1" v-model="item.item_price" />
                            <Button class="delete-item" color="white" text="X" row="0" col="2" @tap="deleteItem(index)" />
                        </GridLayout>
                </StackLayout>                  
                     
                <GridLayout rows="auto, auto" columns="*">                    
                    <Button class="btn btn-primary" text="Add more items" @tap="addMoreItems" row="0"/>
                    
                    <StackLayout class="total-cost" row="1">
                        <Label class="font-weight-bold" :text="'Total Price: Rp ' + convertToRupiah(invoice.total_price)"/>
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
const appSettings = require("application-settings");
const user_id = appSettings.getString("user_id");
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
                total_price: 1250000,
                user_id: user_id,
                theme: ''
            },
            image: {},
            counter: 500,
            invoiceStatus: [{id: 1, text: 'Paid'}, {id:2, text: 'Request for Payment'}]
        }
    },

    mounted() {

    },

    methods: {
        initTextFields() {
            this.$refs['itemPrice'].keyboardType = 'number';
            this.$refs['clientEmail'].keyboardType = 'email';
        },

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
                cancelButtonText: 'Wait, re-check fields.'
            }).then(res => {                                
                if(res == true) {
                     if(Object.keys(this.image).length) {
                         this.saveInvoiceApi2();

                     } else {
                         this.saveInvoiceApi();                    
                     }
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

        setClientName(name) {
            console.log('set name!')
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

        convertToRupiah(angka)
        {
            var rupiah = '';		
            var angkarev = angka.toString().split('').reverse().join('');
            for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
            return rupiah.split('',rupiah.length-1).reverse().join('');
        },

        saveInvoiceApi() {
            console.log('inside save invoice api');
            http.request({
                url: 'http://209.97.167.184:8080/api/invoices',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                content: JSON.stringify({invoice: this.invoice})
            })
            .then(res => {
                const invoice_response = res.content.toJSON();
                console.log(invoice_response);
                this.$navigateTo(App);
            }, error => {
                console.error(error);
            });
        },

        saveInvoiceApi2() {
            console.log('okk')
            let session = bghttp.session('image-upload');
            let request = {
                url: 'http://209.97.167.184:8080/api/invoices',
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };


            let params = [
                {name: 'invoice', value: JSON.stringify(this.invoice)},
                {
                    name:'image',
                    filename: this.image.src.android, 
                    mimeType:'image/jpeg'
                }
            ];

            let task = session.multipartUpload(params, request); 
            
            console.log('omg')

            task.on('error', e => {
                console.log('error', e);
            });

            task.on('complete', e => {
                console.log('complete', JSON.stringify(e));
                this.$navigateTo(App);
            });

        },

        radioButtonSelect(e) {
            console.log(e.value);
            if(e.value == 'Paid')
                this.invoice.invoice_status = 1;
            else this.invoice.invoice_status = 0;
        },

        setDueDate(e) {
            const dueDate = e.value;
            this.invoice.due_date = dueDate.getDate() + "/" + (dueDate.getMonth() + 1) + "/" + dueDate.getFullYear();
            console.log(this.invoice.due_date);
        },

        themeSelect(e) {
            const theme = e.value;
            this.invoice.theme = theme;
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

</style>

