<template>
    <Page>
        <ActionBar title="New Look Invoice" android:flat="true" class="page">
            <ActionItem
                ios.systemIcon="12" ios.position="left"
                android.systemIcon="ic_input_add" android.position="actionBar"
                color="white"
                @tap="openInvoicePage()" />
        </ActionBar>      
        <TabView android:tabBackgroundColor="#53ba82"
                android:tabTextColor="#c4ffdf"
                android:selectedTabTextColor="#ffffff"
                androidSelectedTabHighlightColor="#ffffff"
                androidTabsPosition="bottom"                
                :selectedIndex="selectedIndex"
                @selectedIndexChange="indexChange">
            <TabViewItem title="My Clients">
                <ClientsTab></ClientsTab>
<!--                <GridLayout columns="*" rows="*">-->
<!--                    <Label class="message" :text="msg" col="0" row="0"/>-->
<!--                </GridLayout>-->
            </TabViewItem>
            <TabViewItem title="Invoices" >
                <InvoicesTab></InvoicesTab>
            </TabViewItem>
            <TabViewItem title="Profile">
                
                <Profile></Profile>

            </TabViewItem>
        </TabView>    
    </Page>
</template>

<script>

    import InvoicesTab from '../components/InvoicesTab.vue';
    import NewInvoice from './NewInvoice.vue';
    import Profile from '../components/Profile.vue';
    import ClientsTab from '../components/ClientsTab.vue';



    export default {
    components: {
        InvoicesTab, Profile, ClientsTab
    },
    props: {
        index: {
            type: String
        }
    },
    data() {
      return {
        msg: 'Hello World!',       
        page: 'clients',
        selectedIndex: 1,
        NewInvoice,
  

      }
    },

    methods: {
        indexChange(args) {
               let newIndex = args.value;
                console.log('Current tab index: ' + newIndex);
        },

        openInvoicePage() {
            console.log("Here");
            this.$navigateTo(NewInvoice);
        },
     
    }
    
  }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #333333;
    }  

    .profile {
        padding: 20;
    }

    .profile Label.bold {
        font-weight: bold;
        font-size: 16;
    }

    .profile StackLayout {
        text-align: center;
    }
</style>
