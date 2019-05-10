<template>
    <TabView android:tabBackgroundColor="#53ba82"
        android:tabTextColor="#c4ffdf"
        android:selectedTabTextColor="#ffffff"
        androidSelectedTabHighlightColor="#ffffff"
        androidTabsPosition="top">
        <TabViewItem title="UNPAID">
            <ListView for="item in unpaidInvoices" @itemTap="unpaidInvoiceTap" ref="unpaidListView">
                <v-template height="150">     
                    <GridLayout rows="35, auto, *" columns="160, 50, 100, *" class="invoice">
                        <Label row="0" col="0" class="invoice-title h3" :text="item.project_name"/>
                        <Label row="1" col="0" colSpan="2" :text="item.project_description" />
                        <Label row="2" col="0" :text="item.client_name" />

                        <Label row="0" col="2" :text="'Rp ' + item.total_price" />
                        <Label row="2" col="2" text="Unpaid" class="unpaid-label" />
                        <Label row="0" rowSpan="2" col="3" text="Edit" class="edit-label" />
                    </GridLayout>                                
                </v-template>
            </ListView>                                                                                         
        </TabViewItem>
        
        <TabViewItem title="PAID">
           <ListView for="item in paidInvoices" ref="paidListView" @itemTap="paidInvoiceTap" >
            <v-template height="150">
                <GridLayout rows="40, auto, *" columns="160, 50, 100, *" class="invoice">
                    <Label row="0" col="0" class="invoice-title h3" :text="item.project_name"/>
                    <Label row="1" col="0" colSpan="2" :text="item.project_description" />
                    <Label row="2" col="0" :text="item.client_name" />

                    <Label row="0" col="2" :text="'Rp ' + item.total_price" />
                    <Label row="2" col="2" text="Paid" class="paid-label" />
                    <Label row="0" rowSpan="2" col="3" text="Edit" class="edit-label" />
                </GridLayout>                                
            </v-template>
           </ListView>
        </TabViewItem>

        <TabViewItem title="ALL">
        <ListView for="item in invoices" ref="allListView">
            <v-template height="150">     
                <GridLayout rows="40, auto, *" columns="160, 50, 100, *" class="invoice">
                    <Label row="0" col="0" class="invoice-title h3" :text="item.project_name"/>
                    <Label row="1" col="0" colSpan="2" :text="item.project_description" />
                    <Label row="2" col="0" :text="item.client_name" />

                    <Label row="0" col="2" :text="'Rp ' + item.total_price" />
                    <Label row="2" col="2" text="Paid" class="paid-label" />
                    <Label row="0" rowSpan="2" col="3" text="Edit" class="edit-label" />
                </GridLayout>                                
            </v-template>

            <v-template height="150" if="item.invoice_status == 'unpaid'">     
                <GridLayout rows="40, auto, *" columns="160, 50, 100, *" class="invoice">
                    <Label row="0" col="0" class="invoice-title h3" :text="item.project_name"/>
                    <Label row="1" col="0" colSpan="2" :text="item.project_description" />
                    <Label row="2" col="0" :text="item.client_name" />

                    <Label row="0" col="2" :text="'Rp ' + item.total_price" />
                    <Label row="2" col="2" text="Unpaid" class="unpaid-label" />
                    <Label row="0" rowSpan="2" col="3" text="Edit" class="edit-label" />
                </GridLayout>                                
            </v-template>
        </ListView>   
    </TabViewItem>
    </TabView>       
</template>

<script>

import SwipeActions from './SwipeActions.vue';
import * as http from "http";
import * as Toast from 'nativescript-toast';

export default {
    components: {
        SwipeActions
    },
    mounted() {
        this.getAllInvoices();
    },
    props: {
        page: {
            type: String
        }
    },
    data() {
        return {
            invoices: [],
            paidInvoices: [],
            unpaidInvoice: [],
            itemList: [
                {name: 'Item 1', description: 'Item 1 description'},
                {name: 'Item 2', description: 'Item 2 description'},
                {name: 'Item 3', description: 'Item 3 description'},
            ],

            // NewInvoice
        }
    },

    methods: {
        getAllInvoices() {
            http.request({
                url: 'http://10.0.2.2:1337/api/invoices',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }                
            })
            .then(res => {
                this.invoices = res.content.toJSON();
                this.paidInvoices = this.invoices.filter(invoice => invoice.invoice_status == 'paid');
                this.unpaidInvoices = this.invoices.filter(invoice => invoice.invoice_status == 'unpaid');
            }, error => {
                console.error(error);
            });
        },

        unpaidInvoiceTap(event) {
            const invoice = event.item;
            action("Invoice Options", "Cancel", ["Email to Client", "Mark as Paid", "Delete Invoice"])
            .then(result => {
                if(result == 'Mark as Paid') {
                    this.markAsPaid(invoice);
                } else if(result == 'Delete Invoice') {
                    this.deleteInvoice(invoice);
                } else if(result == 'Email to Client') {
                    this.emailToClient(invoice);
                }
            });
        },

        paidInvoiceTap(event) {
            const invoice = event.item;
            action("Invoice Options", "Cancel", ["Email to Client", "Mark as Unpaid", "Delete Invoice"])
            .then(result => {
                console.log(result);
                if(result == 'Mark as Unpaid') {
                    this.markAsUnpaid(invoice);
                } else if(result == 'Delete Invoice') {
                    this.deleteInvoice(invoice);
                } else if(result == 'Email to Client') {
                    this.emailToClient(invoice);
                }
            });
        },

        markAsPaid(invoice) {
            http.request({
                url: `http://10.0.2.2:1337/api/invoices/${invoice.id}/paid`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }                
            })
            .then(res => {
                console.log(res.content.toJSON());
                // remove invocie from unpaidInvoice array
                this.unpaidInvoices.splice(this.unpaidInvoices.findIndex(function(i){
                    return i.id === invoice.id;
                }), 1);

                this.invoices.splice(this.invoices.findIndex(function(i){
                    return i.id === invoice.id;
                }), 1);

                invoice.invoice_status = 'paid';
                this.paidInvoices.push(invoice);
                this.invoices.push(invoice);


                this.$refs.unpaidListView.nativeView.refresh();
                this.$refs.paidListView.nativeView.refresh();
                this.$refs.allListView.nativeView.refresh();

                this.showToast("Invoice succesfully marked as paid!");
            }, error => {
                console.error(error);
            });
        },

        markAsUnpaid(invoice) {
            console.log("OEE")
            http.request({
                url: `http://10.0.2.2:1337/api/invoices/${invoice.id}/unpaid`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }                
            })
            .then(res => {

                console.log("yoi!");
                console.log(res.content.toJSON());

                // remove invocie from paid array
                this.paidInvoices.splice(this.unpaidInvoices.findIndex(function(i){
                    return i.id === invoice.id;
                }), 1);

                this.invoices.splice(this.invoices.findIndex(function(i){
                    return i.id === invoice.id;
                }), 1);

                invoice.invoice_status = 'unpaid';
                this.unpaidInvoices.push(invoice);
                this.invoices.push(invoice);
                
                this.$refs.unpaidListView.nativeView.refresh();
                this.$refs.paidListView.nativeView.refresh();
                this.$refs.allListView.nativeView.refresh();

                this.showToast("Invoice succesfully marked as unpaid!");

            }, error => {
                console.error(error);
            });
        },

        deleteInvoice(invoice) {
            http.request({
                url: `http://10.0.2.2:1337/api/invoices/${invoice.id}`,
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }                
            })
            .then(res => {
                console.log(res.content.toJSON());
                
                // remove invoice from arrays
                this.unpaidInvoices.splice(this.unpaidInvoices.findIndex(function(i){
                    return i.id === invoice.id;
                }), 1);

                this.paidInvoices.splice(this.paidInvoices.findIndex(function(i){
                    return i.id === invoice.id;
                }), 1);

                this.invoices.splice(this.invoices.findIndex(function(i){
                    return i.id === invoice.id;
                }), 1);

                this.$refs.unpaidListView.nativeView.refresh();
                this.$refs.paidListView.nativeView.refresh();
                this.$refs.allListView.nativeView.refresh();

                this.showToast("Invoice succesfully deleted!");
                
            }, error => {
                console.error(error);
            });
        },

        emailToClient(invoice) {
            http.request({
                url: `http://10.0.2.2:1337/api/invoices/${invoice.id}/email`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }                
            })
            .then(res => {
                console.log(res.content.toJSON());                
                this.showToast("Invoice succesfully emailed!");
                
            }, error => {
                console.error(error);
            });
        },

        showToast(message) {
            const toast = Toast.makeText(message);
            toast.show();
        }
    }
}
</script>



<style scoped>
  .invoice-title, .invoice-description {
        /* font-weight: bold; */
        white-space: normal;        
    }

    .invoice {
        padding: 10;
    }

    .invoice .paid-label {
        background-color: #53ba82;
        text-align: center;
        color: #fff;        
    }

    .invoice .unpaid-label {
        background-color: #b64343;
        text-align: center;
        color: #fff;        
    }

    .invoice .edit-label {
        padding-left: 15;
    }
</style>

