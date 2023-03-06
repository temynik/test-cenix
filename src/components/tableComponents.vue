
<template>
	<div>
		<v-data-table
			:headers="headers"
			:items="itemsTable"
			sort-by="name"
			class="elevation-1 mt-5"
			no-data-text="Таблица пуста"
			no-results-text="По вашему критерию ничего не найдено"
			:page.sync="page"
			:items-per-page="itemsPerPage"
			hide-default-footer
			>
			<template v-slot:top>
				<v-toolbar flat>
					<v-text-field
						class="mt-4"
						v-model="name"
						:label="labelText"
					></v-text-field>
					<v-spacer></v-spacer>
					<v-dialog v-model="dialog" max-width="500px">
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								color="primary"
								dark
								class="mb-2"
								v-bind="attrs"
								v-on="on"
							>
								Добавить пост
							</v-btn>
						</template>
						<v-card>
							<v-card-title>
								<span class="text-h5">{{ formTitle }}</span>
							</v-card-title>
							<v-card-text>
								<v-container>
									<v-row>
										<v-col cols="12">
											<v-text-field
												v-model="editedItem.id"
												label="ID*"
											></v-text-field>
										</v-col>
										<v-col cols="12">
											<v-textarea
												v-model="editedItem.name"
												label="Наименование"
											></v-textarea>
										</v-col>
									</v-row>
								</v-container>
							</v-card-text>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="grey darken-1" text @click="close">Отмена</v-btn>
								<v-btn color="blue darken-1" :disabled="!editedItem.id" text @click="save">Сохранить</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
					<v-dialog v-model="dialogDelete" max-width="500px">
						<v-card>
							<v-card-title class="text-h5">Вы уверены, что хотите удалить пост?</v-card-title>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="grey darken-1" text @click="closeDelete">Отмена</v-btn>
								<v-btn color="error darken-1" text @click="deleteItemConfirm">Удалить</v-btn>
								<v-spacer></v-spacer>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-toolbar>
			</template>
			<template v-slot:[`item.actions`]="{ item }">
				<v-icon small class="mr-2" @click="editItem(item)">
					mdi-pencil
				</v-icon>
				<v-icon small @click="deleteItem(item)">
					mdi-delete
				</v-icon>
			</template>
		</v-data-table>
		<v-row class="text-center justify-end mt-5 mx-2" wrap>
			<v-col cols="4" md="1">
				<v-select
					dense
					outlined
					hide-details
					:value="itemsPerPage"
					label="Отображать по"
					@change="itemsPerPage = parseInt($event, 10)"
					:items="perPageChoices">
				</v-select>
			</v-col>
			<v-col cols="8" md="3">
				<v-pagination
					v-model="page"
					:length="pageCount">
				</v-pagination>
			</v-col>
		</v-row>
	</div>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		name: 'tableComponents',
		props: {
			labelText: {
				type: String,
				default: ''
			}
		},
		data: () => ({
			name: '',
			dialog: false,
			dialogDelete: false,
			editedIndex: -1,
			editedItem: {
				name: '',
				id: ''
			},
			defaultItem: {
				name: '',
				id: ''
			},
			page: 1,
			itemsPerPage: 10,
			perPageChoices: [
				{ text:'10', value: 10 },
				{ text:'50', value: 50 },
				{ text:'100', value: 100 }
			]
		}),
		computed: {
			...mapState(['itemsTable']),
			formTitle () {
				return this.editedIndex === -1 ? 'Создать пост' : 'Редактировать пост'
			},
			headers() {
				return [
					{ text: 'ID', value: 'id' },
					{ text: 'Наименование', sortable: true, value: 'name', filter: f => { return ( f + '' ).toLowerCase().includes( this[ 'name' ].toLowerCase() )} },
					{ text: 'Действия', value: 'actions', sortable: false },
				]
			},
			totalRecords() {
				return this.itemsTable.length
			},
			pageCount() {
				return this.totalRecords / this.itemsPerPage
			}
		},
		watch: {
			dialog(val) {
				val || this.close()
			},
			dialogDelete(val) {
				val || this.closeDelete()
			},
		},
		methods: {
			editItem(item) {
				this.editedIndex = this.itemsTable.indexOf(item)
				this.editedItem = Object.assign({}, item)
				this.dialog = true
			},
			deleteItem(item) {
				this.editedIndex = this.itemsTable.indexOf(item)
				this.editedItem = Object.assign({}, item)
				this.dialogDelete = true
			},
			deleteItemConfirm() {
				this.itemsTable.splice(this.editedIndex, 1)
				this.closeDelete()
			},
			close() {
				this.dialog = false
				this.$nextTick(() => {
					this.editedItem = Object.assign({}, this.defaultItem)
					this.editedIndex = -1
				})
			},
			closeDelete() {
				this.dialogDelete = false
				this.$nextTick(() => {
					this.editedItem = Object.assign({}, this.defaultItem)
					this.editedIndex = -1
				})
			},
			save() {
				if (this.editedIndex > -1) {
					Object.assign(this.itemsTable[this.editedIndex], this.editedItem)
				} else {
					this.itemsTable.push(this.editedItem)
				}
				this.close()
			},
		}
	}
</script>

<style lang="scss">
	.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) { 	
		transition: 0.3s;
		background: #8bc3fa;
	}
</style>