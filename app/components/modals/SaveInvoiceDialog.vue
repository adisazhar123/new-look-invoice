<template>
	<StackLayout class="p-20" backgroundColor="white">
		<Label class="h2 text-center" text="This is a modal page." />
		<Button class="btn btn-outline" text="Close Modal" @tap="$modal.close()" />
	</StackLayout>
</template>

<script>
export default {
    data() {
        return {};
    }
};
</script>

<style scoped>
StackLayout {
    height: 200;
}
</style>
