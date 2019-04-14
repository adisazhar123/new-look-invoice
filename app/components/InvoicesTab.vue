<template>
    <TabView android:tabBackgroundColor="#53ba82"
        android:tabTextColor="#c4ffdf"
        android:selectedTabTextColor="#ffffff"
        androidSelectedTabHighlightColor="#ffffff"
        androidTabsPosition="top">
        <TabViewItem title="UNPAID">
            <ListView for="item in invoices">

                <v-template height="150">     
                    <GridLayout rows="55, 20" columns="160, 50, 100, *" class="invoice">
                        <Label row="0" col="0" class="invoice-title" :text="item.title"/>
                        <Label row="1" col="0" text="Adis Azhar" />

                        <Label row="0" col="2" text="Rp 200 500" />
                        <Label row="1" col="2" text="Paid" class="paid-label" />
                        <Label row="0" rowSpan="2" col="3" text="Edit" class="edit-label" />
                    </GridLayout>                                
                </v-template>

                <v-template height="150" if="item.invoice_status == 'unpaid'">     
                    <GridLayout rows="55, 20" columns="160, 50, 100, *" class="invoice">
                        <Label row="0" col="0" class="invoice-title" :text="item.title"/>
                        <Label row="1" col="0" text="Adis Azhar" />

                        <Label row="0" col="2" text="Rp 200 500" />
                        <Label row="1" col="2" text="Unpaid" class="unpaid-label" />
                        <Label row="0" rowSpan="2" col="3" text="Edit" class="edit-label" />
                    </GridLayout>                                
                </v-template>
  
            </ListView>                                                                                         
            
        </TabViewItem>
        <TabViewItem title="PAID">
            <GridLayout columns="*" rows="*">                      
              <!-- <SwipeActions row="0"></SwipeActions> -->
                <Label class="message" text="Tab 2 Content" col="0" row="0"/>
            </GridLayout>
        </TabViewItem>
        <TabViewItem title="ALL">
            <GridLayout columns="*" rows="*">
                <Label class="message" text="Tab 3 Content" col="0" row="0"/>
            </GridLayout>
        </TabViewItem>
    </TabView>       
</template>

<script>

// import NewInvoice from './NewInvoice.vue';
import SwipeActions from './SwipeActions.vue';


export default {
    components: {
        SwipeActions
    },
    data() {
        return {
            invoices: [
                {
                    title: 'Ne eum tota delicata. Quod placerat imperdiet eum eu. Ea vide ',
                    description: 'Cum eloquentiam intellegebat ut, deleniti voluptua ad quo. An natum nullam delenit vim. Ipsum consul assentior ei eum, suas justo facilisis id eos. Ut wisi velit congue pri. Alienum eligendi sea ei.',
                    invoice_status: 'paid'
                },
                {
                    title: 'Ne eum tota delicata. Quod placerat imperdiet eum eu. Ea vide ',
                    description: 'Cum eloquentiam intellegebat ut, deleniti voluptua ad quo. An natum nullam delenit vim. Ipsum consul assentior ei eum, suas justo facilisis id eos. Ut wisi velit congue pri. Alienum eligendi sea ei.',
                    invoice_status: 'paid'
                },
                {
            title: 'Ne eum tota delicata. Quod placerat imperdiet eum eu. Ea vide ',
                    description: 'Cum eloquentiam intellegebat ut, deleniti voluptua ad quo. An natum nullam delenit vim. Ipsum consul assentior ei eum, suas justo facilisis id eos. Ut wisi velit congue pri. Alienum eligendi sea ei.',
                    invoice_status: 'unpaid'
                },
                {
                    title: 'Ne eum tota delicata. Quod placerat imperdiet eum eu. Ea vide ',
                    description: 'Cum eloquentiam intellegebat ut, deleniti voluptua ad quo. An natum nullam delenit vim. Ipsum consul assentior ei eum, suas justo facilisis id eos. Ut wisi velit congue pri. Alienum eligendi sea ei.',
                    invoice_status: 'paid'
                },
                {
                    title: 'Ne eum tota delicata. Quod placerat imperdiet eum eu. Ea vide ',
                    description: 'Cum eloquentiam intellegebat ut, deleniti voluptua ad quo. An natum nullam delenit vim. Ipsum consul assentior ei eum, suas justo facilisis id eos. Ut wisi velit congue pri. Alienum eligendi sea ei.',
                    invoice_status: 'paid'
                },
                {
                    title: 'Ne eum tota delicata. Quod placerat imperdiet eum eu. Ea vide ',
                    description: 'Cum eloquentiam intellegebat ut, deleniti voluptua ad quo. An natum nullam delenit vim. Ipsum consul assentior ei eum, suas justo facilisis id eos. Ut wisi velit congue pri. Alienum eligendi sea ei.',
                    invoice_status: 'unpaid'
                },
                {
                    title: 'Ne eum tota delicata. Quod placerat imperdiet eum eu. Ea vide ',
                    description: 'Cum eloquentiam intellegebat ut, deleniti voluptua ad quo. An natum nullam delenit vim. Ipsum consul assentior ei eum, suas justo facilisis id eos. Ut wisi velit congue pri. Alienum eligendi sea ei.',
                    invoice_status: 'paid'
                },
            ],

                  itemList: [
        {name: 'Item 1', description: 'Item 1 description'},
        {name: 'Item 2', description: 'Item 2 description'},
        {name: 'Item 3', description: 'Item 3 description'},
      ],

            // NewInvoice
        }
    }
}
</script>



<style scoped>
  .invoice-title {
        font-weight: bold;
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

