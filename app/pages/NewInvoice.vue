<template>
    <Page>
        <ActionBar title="New Look Invoice" android:flat="true" class="page">  
            <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
            <ActionItem @tap="saveInvoice" text="Save" ios.systemIcon="3" android.systemIcon="ic_menu_save" ios.position="right" android.position="actionBar" />
        </ActionBar>   

        <ScrollView>
            <StackLayout class="app">   
                <GridLayout rows="auto,auto,auto,auto,auto" columns="*">
                    <Label text="Project and Client Details" class="font-weight-bold label-client-name" row="0"/>
                    <!-- <FloatLabel placeholder="Client Name" :value=""/> -->

                    <TextField text="" hint="Client Name" v-model="invoice.client_name" row="1" />
                    <TextField text="" hint="Client Email" v-model="invoice.client_email" row="2" />
                    <TextField text="" hint="Project Name" v-model="invoice.project_name" row="3" />
                    <TextView hint="Project Description" class="project-description" v-model="invoice.project_description" row="4" />
                </GridLayout>   

                
                <GridLayout rows="20, 90" columns="*">
                    <Label class="font-weight-bold" text="Invoice Status" row="0" />
                    <ListPicker :items="['Paid', 'Request for Payment']" selectedIndex="0" row="1"/>
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
                            <GridLayout rows="*, *", columns="220,120,*"> 
                                <TextField hint="Project Item" row="0" col="0" v-model="item.item_name" />
                                <TextField class="price" keyboardType="number" hint="Price in Rupiah" row="0" col="1" v-model="item.item_price" />
                                <Button color="red" text="X" row="0" col="2" @tap="deleteItem(index)" />
                            </GridLayout>
                    </StackLayout>                  
                     

                <GridLayout rows="auto" columns="*">                    
                    <Button text="Add more items" @tap="addMoreItems" row="0"/>
                </GridLayout>       

                <StackLayout class="total-cost">
                    <Label class="font-weight-bold" text="Total Cost: "/>
                </StackLayout>             

            </StackLayout>   
        </ScrollView>
         
  


    </Page>
</template>

<script>
import * as camera from "nativescript-camera";
import { Image } from "tns-core-modules/ui/image";

export default {
    data() {
        return {            
            invoice: {
                client_name: '',
                client_email: '',
                project_name: '',
                project_description: '',
                items: [{item_name: 'dsf', item_price: '345'}]
            },

            images: []
        }
    },

    methods: {
        addMoreItems() {
            // console.log("Hi")
            this.invoice.items.push({item_name: '', item_price: ''});
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
                console.log(this.invoice);
                console.log(this.invoice.items[0].item_name);
                // console.log(res);
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

    .project-description {
        height: 100;
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

    /* Button {
        width: 10;
    } */
    





</style>

