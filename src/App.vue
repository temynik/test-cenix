<template>
	<v-app>
		<v-app-bar
			app
			color="primary"
			dark
			>
			{{title}} ({{itemsTable.length}})
		</v-app-bar>
		<v-main>
			<tableComponents :labelText="labelText"/>
		</v-main>
	</v-app>
</template>

<script>
import tableComponents from './components/tableComponents'
import {mapActions, mapState} from 'vuex'
export default {
	name: 'App',
	components: {
		tableComponents,
	},
	data: () => ({
		title: 'Мои посты',
		labelText: 'Поиск по наименованию'
	}),
	created () {
		this.getItems()
	},
	computed: {
        ...mapState(['itemsTable'])
    },
	methods: {
		...mapActions(['editItems']),
		
		getItems() {
			this.$http({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                url: `/mocks/table.json`,
            }).then(res => {
                this.editItems(res.data.posts)
            })
		}
	}
}
</script>