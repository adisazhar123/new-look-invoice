<template>
    <Page>
        <GridLayout orientation="vertical" rows="auto, *">
        <RadListView ref="listView"
                    for="item in itemList"
                    swipeActions="true"                    
                    @itemSwipeProgressStarted="onSwipeStarted">
            <v-template>
            <StackLayout class="item" orientation="vertical">
                <Label class="big" :text="item.name"></Label>
                <Label :text="item.description"></Label>
            </StackLayout>
            </v-template>

            <v-template name="itemswipe">
            <GridLayout columns="auto, *, auto" backgroundColor="White">
                <StackLayout id="mark-view" col="0" class="swipe-item left"
                            orientation="horizontal" @tap="onLeftSwipeClick">
                <Label text="mark" verticalAlignment="center" horizontalAlignment="center"/>
                </StackLayout>
                <StackLayout id="delete-view" col="2" class="swipe-item right"
                            orientation="horizontal" @tap="onRightSwipeClick">
                <Label text="delete" verticalAlignment="center" horizontalAlignment="center" />
                </StackLayout>
            </GridLayout>
            </v-template>
        </RadListView>
        </GridLayout>
  </Page>
</template>


<script>
import { ObservableArray } from 'tns-core-modules/data/observable-array';
export default {
    data () {
    return {
      itemList: [
        {name: 'Item 1', description: 'Item 1 description'},
        {name: 'Item 2', description: 'Item 2 description'},
        {name: 'Item 3', description: 'Item 3 description'},
      ],
    };
  },

  methods: {
    onSwipeStarted ({ data, object }) {
      console.log(`Swipe started`);
      const swipeLimits = data.swipeLimits;
      const swipeView = object;
      const leftItem = swipeView.getViewById('mark-view');
      const rightItem = swipeView.getViewById('delete-view');
      swipeLimits.left = leftItem.getMeasuredWidth();
      swipeLimits.right = rightItem.getMeasuredWidth();
      swipeLimits.threshold = leftItem.getMeasuredWidth() / 2;
    },
    onLeftSwipeClick (event) {
      console.log('left action tapped');
      this.$refs.listView.notifySwipeToExecuteFinished();
    },
    onRightSwipeClick ({ object }) {
      console.log('right action tapped');
      // remove item
      this.itemList.splice(this.itemList.indexOf(object.bindingContext), 1);
      this.$refs.listView.notifySwipeToExecuteFinished();
    },
    // onLoaded () {
    //   setTimeout(() => {
    //     this.itemList = getItemList(20);
    //   }, 0);
    // }
  }
};
</script>

<style scoped>

.item {
    padding: 5;
}

</style>

