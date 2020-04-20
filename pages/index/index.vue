<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true" :datas ="dataSouce" >
			<block slot="backText">退出</block>
			<block slot="content">见客扫描</block>
			<block slot="right" style="font-size: 14px;">{{fileName}}</block>
		</cu-custom>
		<scroll-view scroll-x class="bg-white nav text-center fixed base-info-wrap" :style="[{top:CustomBar + 'px'}]">
			<form @submit="formSubmit" @reset="formReset">

				<view class="sub-wrap">
					<view class="base-info-item">
						<view class="flex-sub flex-row">
							<view class="title">日期:</view>
							<picker mode="date" v-model="tran_date" name='tran_date' @change="DateChange">
								<view class="picker" style="background-color: yellow;">
									{{tran_date}}
								</view>
							</picker>
						</view>
						<view class="flex-sub flex-row">
							<view class="title">要求完成日:</view>
							<picker mode="date" v-model="req_date" name='req_date' @change="endDateChange">
								<view class="picker" style="background-color: yellow;">
									{{req_date}}
								</view>
							</picker>
						</view>


					</view>
					<view class="base-info-item">

						<view class="flex-sub flex-row">
							<view class="title">销售员:</view>
							<input placeholder="" v-model="salesman" name='salesman' style="background-color: yellow;"></input>
						</view>
						<view class="flex-sub flex-row">
							<view class="title">客户编号:</view>
							<input style="width: 100%;background-color: yellow;" placeholder="" v-model="customer_code" name='customer_code'></input>
						</view>



					</view>
					<view class="base-info-item">
						<view class="flex-row" style="width: 100px;">
							<view class="title">新客:</view>
							<switch class='radius' v-model="new_flag" name='new_flag' @change="SwitchD" :class="new_flag?'checked':''"
							 :checked="new_flag?true:false"></switch>
						</view>
						<view class="flex-sub flex-row">
							<view class="title">客户组:</view>
							<input  style="width: 100%;background-color: yellow;" placeholder="" v-model="team" name='team'></input>
						</view>
					</view>
					<view class="base-info-item">

						<view class="flex-sub flex-row">
							<view class="title">客户名称:</view>
							<input style="width: 100%;" placeholder="" v-model="customer_name" name='customer_name'></input>
						</view>


					</view>


				</view>

				<view class="base-info-item pd-rg-10">
					<view class="flex-sub flex-row">
						<view class="title">客户电话:</view>
						<input style="width: 100%;" placeholder="" v-model="tel_no" name='tel_no'></input>
					</view>
					<view class="flex-sub flex-row">
						<view class="title">联系人:</view>
						<input style="width: 100%;background-color: yellow;" v-model='contactman' placeholder="" name='contactman'></input>
					</view>

				</view>
				<view class="base-info-item pd-rg-10">

					<view class="flex-sub flex-row">
						<view class="title">客户地址:</view>
						<input style="width: 100%;" placeholder="" v-model='address' name="address"></input>
					</view>
					<button type="primary" @click="startBarCode()" style="margin-left:10px">{{startScanText}}</button>


				</view>
				<view class="base-info-item pd-rg-10" style="justify-content: flex-end;">
					<button type="ghost" class="bg-blue" @click="addTableItem()">Add</button>
					<button type="ghost" class="bg-red" @click="DeleteLast()">Delete</button>
					<button type="ghost" class="bg-red" @click="deleteAll()">DeleteAll</button>
					<button type="ghost" class="bg-green" form-type="submit">保存Save</button>
					<button type="ghost" class="bg-green" @click="createFile()">新建New</button>
					<button type="ghost" class="bg-green" @tap="openFile">读取open</button>
				</view>
			</form>


		</scroll-view>
		<block>
			<view class=" bg-white" style="margin-top:350px">
				<tki-file-manager ref="filemanager" @result="resultPath"></tki-file-manager>
				<v-table :key="tableKey" 
				:scrollTop='scrollTop'
				 :height ='(screenHeight-30)'
				 :columns="columns" 
				:fixed-checkbox="fixedCheckBox" 
				:list="dataSouce" 
				@dbhandler ='ediFn'
				@dele="DeleteOne"></v-table>
			</view>



		</block>
		<block>
			<view class="fix-bottom">
				<view style="width: 420px;border-right: 1px solid red;">{{dataSouce.length}}</view>
				<view style="width: 80px;border-right: 1px solid red;">{{totalusage}}</view>
				<view style="width: 80px;border-right: 1px solid red;">{{totalqty}}</view>
			</view>
		</block>
		 
		<view class="cu-modal bottom-modal"  :class="modalName=='Modal'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<form @submit="editClick" @reset="editReset">
				<view class="cu-bar bg-white">
					<button class="action text-blue"  @tap="hideModal()" style="font-size: 18px;">取消</button>
					<view>{{title}}</view>
					<button class="action text-green" form-type="submit" >确定</button>
				</view>
				<view class="grid col-3">
					<view class="modal_wrap" style="width: 100%;">
						<view class="cu-form-group margin-top">
							<view class="title">款号</view>
							<input placeholder="请输入款号" v-model="styleNo"  name="styleNo"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">颜色编号</view>
							<input placeholder="请输入颜色编号" v-model="colorCode"  name="colorCode"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">制办方式</view>
							<picker @change="PickerChange" :value="ta_pack_type" :range="picker">
								<view class="picker">
									{{picker[ta_pack_type]}}
								</view>
							</picker>
						</view>
						
						<view class="cu-form-group">
							<view class="title">单位</view>
							<picker @change="unitChange" :value="ta_pack_unit" :range="unit">
								<view class="picker">
									{{unit[ta_pack_unit]}}
								</view>
							</picker>
						</view>
						<view class="cu-form-group">
							<view class="title">数量</view>
								<yp-number-box v-model="tableUsage" :value='tableUsage' @change="usageChange"></yp-number-box>
							<!-- <input placeholder="请输入数量" v-model='tableQty' type="number"  name="tableQty"></input> -->
						</view>
						<view class="cu-form-group">
							<view class="title">份数</view>
							<yp-number-box v-model="tableQty"   :value='tableQty' @change="qtyChange">></yp-number-box>
							<!-- <input placeholder="请输入份数" v-model='tableUsage' type="number" name="tableUsage"></input> -->
						</view>
						<view class="cu-form-group">
							<view class="title">备注</view>
							<input placeholder="请输入备注" v-model='tableRemark' name="tableRemark"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">类型</view>
							<input placeholder="请输入类型" v-model='tableGroup1' name="tableGroup1"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">形态</view>
							<input placeholder="请输入形态" v-model='tableGroup2' name="tableGroup2"></input>
						</view>
					</view>
				</view>
				</form>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	import { DOMParser } from 'xmldom'
	import permision from "@/common/permission.js";
	import helper from "@/common/helper.js";
	import tkiFileManager from "@/components/tki-file-manager/tki-file-manager.vue"
	import vTable from "@/components/table.vue"
	import ypNumberBox from "@/components/yp-number-box/yp-number-box.vue"
	import Vue from 'vue'
	var currentWebview = null
	var embed = null
	var barcode = null
	export default {

		data() {
			return {
				title:"",
				tableKey:1,
				styleNo:'',
				colorCode:'',
				tableQty:1,
				tableUsage:1,
				tableGroup1:"",
				tableGroup2:"",
				tableRemark:"",
				unit:['DZ','GR','KG','M','PC','PR','YD'],
				ta_pack_type:0 ,
				ta_pack_unit:0,
				picker: ['Hanger', 'Yardage', 'PresentationBoard','A4','ProgramBook','Hanger-A'],
				dataSouce: [],
				scrollTop:0,
				fixedCheckBox: true,
				index:1,
				columns: [{
						title: '序号',
						key: 'index',
						$width:'50px'
					},{
						title: '款号',
						key: 'style_no',
						$width:'120px'
						
					},
					{
						title: '颜色编号',
						key: 'color_code',
						$width:'90px'
					},
					{
						title: '制办方式',
						key: 'pack_type',
						$width:'110px'
						
					},
					{
						title: '单位',
						key: 'unit',
						$width:'50px'
					},
					{
						title: '数量',
						key: 'usage',
						$width:'80px'
					},
					{
						title: '份数',
						key: 'qty',
						$width:'80px'
					},
					{
						title: '备注',
						key: 'remarks'
					},
					{
						title: '类型',
						key: 'group1'
					},
					{
						title: '形态',
						key: 'group2'
					}
				],

				tran_date: this.formatDate(),
				req_date: this.formatDate(),
				tel_no: "",
				new_flag:false,
				team: "",
				customer_code: "",
				customer_name: "",
				salesman: "",
				address: "",
				contactman: '',
				
				fileName: null,
				startScanText: '停止扫描',
				screenWidth: 0,
				screenHeight: 0,
				CustomBar: this.CustomBar,
				domain: "www.zunkr.com",
				callbackurl: '',
				confirmButton: true,
				cancelButton: true,
				count: 0,
				codeArrayRecord: [],
				isScan: false,
				modalName: null,
				selectItemId:null
			};
		},
		onLoad: function(option) {
			this.callbackurl = option.callbackurl; // 回调地址
			if (option.count) {
				this.count = option.count;
			}
			if (option.confirmButton) {
				this.confirmButton = option.confirmButton;
			}

			if (option.cancelButton) {
				this.cancelButton = option.cancelButton;
			}

		},
		components: {
			tkiFileManager,
			vTable,
			ypNumberBox
		},
		computed:{
			totalusage:function(){
				var s = 0;
				    for (var i=this.dataSouce.length-1; i>=0; i--) {
						
				        s += parseFloat(this.dataSouce[i].usage);
				    }
				    return s;
				
			},
			totalqty:function(){
				var s = 0;
				    for (var i=this.dataSouce.length-1; i>=0; i--) {
				        s += parseFloat(this.dataSouce[i].qty);
				    }
				    return s;
		
			}
		},
		created() {
			var _this = this
			uni.getSystemInfo({
				success: function(res) {
					
					_this.screenWidth = res.screenWidth;
					_this.screenHeight = res.screenHeight - 420
					_this.scanplus()
					
				}
			})
		},
		onShow() {
			
		},
		mounted() {
			var _this  = this
			 setTimeout(()=>{
			 	 this.startBarCode()
			 },1000)
			 uni.getStorage({
			     key: 'saleMan',
			     success: function (res) {
			         _this.salesman = res.data
			     }
			 });
		},
		methods: {
			addTableItem(){
				var arr = this.dataSouce
				if(arr.length>20){
					this.scrollTop = 100
				}
				 
				arr.push({
					index:this.index,
					style_no:"",
					color_code:"",
					pack_type:'Hanger',
					unit:'YD',
					qty: 1,
					usage: 1,
					remarks: "",
					group1: "",
					group2: ""
				 
				})
			  var index = this.index
			  index++
			  this.index = index
			   this.dataSouce = arr
			   // setTimeout(()=>{
				  //  this.modalName = 'Modal'
				  //  this.resetModalForm()
			   // },20)
			   
			},
			PickerChange(e) {
				this.ta_pack_type = e.detail.value
			},
			unitChange(e){
				this.ta_pack_unit = e.detail.value
			},
			editClick(e){	
			  const { tableRemark,styleNo,colorCode,tableGroup1,tableGroup2 } = e.target.value
			  let oldTableData = helper.deepCopy(this.dataSouce)
			  oldTableData[this.selectItemId] = {
				  index:this.selectItemId+1,
				  style_no:styleNo,
				  color_code:colorCode,
				  pack_type:this.picker[this.ta_pack_type],
				  unit:this.unit[this.ta_pack_unit],
				  qty: this.tableQty,
				  usage: this.tableUsage,
				  remarks: tableRemark,
				  group1: tableGroup1,
				  group2: tableGroup2,
			  }
			
			  this.dataSouce = oldTableData
			  this.$forceUpdate(); // 强制刷新
			  this.modalName = null
			  this.resetModalForm()
			},
			hideModal(e) {
				
				this.modalName = null
			},
			createFile(){
				var _this = this
					if(this.fileName){
						uni.showModal({
							title:'提示',
							content: "已读取文件未保存是否新建文件",
							 success: function (res) {
							     if (res.confirm) {
							 		 
							 		 uni.showModal({
							 		     title: '新建文件',
							 		     content: '新建文件将清空所有内容，是否继续',
							 		     success: function (res) {
							 		         if (res.confirm) {
							 		 			 
							 		 			_this.formReset()
							 		 			 
							 		 			
							 		             
							 		         } else if (res.cancel) {
							 		 				
							 		         }
							 		     }
							 		 });
							 		 
							 		
							         
							     } else if (res.cancel) {
							 				
							     }
							 }
						})
					}else{
						uni.showModal({
						    title: '新建文件',
						    content: '新建文件将清空所有内容，是否继续',
						    success: function (res) {
						        if (res.confirm) {
									 
									_this.formReset()
									 
									
						            
						        } else if (res.cancel) {
										
						        }
						    }
						});
					}
					
			},
			DeleteLast(){
				var _this = this
				uni.showModal({
					title: '是否删除',
					content: '是否删除最后一条数据',
					success: function (res) {
						if (res.confirm) {
							var list = _this.dataSouce
							list.pop()
							_this.dataSouce =  list
							_this.index  = _this.index -1
							_this.codeArrayRecord = []
						} else if (res.cancel) {
			
						}
					}
				});
			},
			DeleteOne(data){
				var _this = this
					uni.showModal({
					    title: '是否删除',
					    content: `是否删除第${data.row.index}行数据 `,
					    success: function (res) {
					        if (res.confirm) {
								var list = _this.dataSouce
								var arr = []
								 list.forEach((item,i)=>{
									 if(data.index !== i){
										 arr.push(item)
									 }else{
										 
									 }
								 })
								_this.dataSouce =  arr
								_this.codeArrayRecord = []
					        } else if (res.cancel) {
				
					        }
					    }
					});
			},
			deleteAll() {
				var _this = this
					uni.showModal({
					    title: '全部删除',
					    content: '是否确定删除所有录入信息',
					    success: function (res) {
					        if (res.confirm) {
								_this.dataSouce = []
								_this.index = 1
					            
					        } else if (res.cancel) {
				
					        }
					    }
					});
			},
			 
			ediFn(data) {
				// 编辑表格中的内容		
				this.title = `修改第${data.index+1}行`
				this.modalName = 'Modal'
				this.ta_pack_type = this.picker.findIndex((value, index, arr) => { return value === data.row.pack_type})
				this.ta_pack_unit = this.unit.findIndex((value, index, arr) => { return value === data.row.unit})
				this.selectItemId = data.index
				this.styleNo=data.row.style_no && data.row.style_no
				this.colorCode=data.row.color_code &&data.row.color_code
				this.tableQty=data.row.qty && data.row.qty
				this.tableUsage=data.row.usage &&data.row.usage
				this.tableGroup1=data.row.group1 && data.row.group1
				this.tableGroup2=data.row.group2 && data.row.group2
				this.tableRemark=data.row.remarks &&data.row.remarks
			},
			resetModalForm(){
				// 重置表格中的数据
				this.ta_pack_type = 0
				this.ta_pack_unit = 0
				this.styleNo=""
				this.colorCode=""
				this.tableQty=1
				this.tableUsage=1
				this.tableGroup1=""
				this.tableGroup2=""
				this.tableRemark=""
			    
			},
			  formatDate() {
			    var d = new Date(),
			        month = '' + (d.getMonth() + 1),
			        day = '' + d.getDate(),
			        year = d.getFullYear();
			
			    if (month.length < 2) 
			        month = '0' + month;
			    if (day.length < 2) 
			        day = '0' + day;
			
			    return [year, month, day].join('-');
			},
			formSubmit(e) {
				// 保存后的操作
				var _this = this
				var formdata = e.detail.value
				Object.assign(formdata, {
					tran_date: this.tran_date,
					req_date: this.req_date
				})
				if(this.dataSouce.length ===0){
					uni.showToast({
						title:'表格数据不能为空',
						icon:'none',
						duration: 1000
					})
					return 
				}
				if(formdata.tran_date==='' || formdata.req_date === '' || formdata.salesman===""  || formdata.customer_code===""  || formdata.team==="" ||formdata. contactman ===""){
					uni.showToast({
						title:'请填写必填项',
						icon:'none',
						duration: 1000
					})
					return 
				}
				 
				uni.setStorageSync('saleMan', this.salesman ||"");
				_this.fileWriter(formdata)
				// uni.showModal({
				// 	title: '确认保存',
				// 	content: '是否确认保存信息到本地',
				// 	success: function (res) {
				// 	    if (res.confirm) {
				// 			_this.fileWriter(formdata)
				// 	    } else if (res.cancel) {
									
				// 	    }
				// 	}
				// })
				

			},
			format(){

			},
			formReset(e) {
				// 重置基础信息
				this.tran_date = this.formatDate()
				this.req_date = this.formatDate()
				this.tel_no = ""
				this.new_flag = false
				this.team = ""
				this.customer_code = ""
				this.customer_name = ""
				this.address = ""
				this.contactman = ''
				this.dataSouce = []
				this.index = 1
				this.fileName = null
				this.codeArrayRecord = []
			},
			fileWriter(formdata) {
				// 写入xml至 客户端
				let that = this
				let dateText = this.fileName ? this.fileName :(formdata.salesman || 'noname')+'^'+(helper.CurentTime()+"").slice(2);
				let dateRow = this.fileName ? ((this.fileName.split('-')[0])).split('^')[1]:(helper.CurentTime()+"").slice(2)
				let tableData = ``
			   if(this.dataSouce.length === 0){
				   tableData =`<C1-${dateRow}_row><team>${formdata.team}</team><new_flag>${formdata.new_flag?1:0}</new_flag><customer_code>${formdata.customer_code}</customer_code><customer_name>${formdata.customer_name}</customer_name><address>${formdata.address}</address><tel_no>${formdata.tel_no}</tel_no><contactman>${formdata.contactman}</contactman><tran_date>${formdata.tran_date}</tran_date><req_date>${formdata.req_date}</req_date><salesman>${formdata.salesman}</salesman></C1-${dateRow}_row>`
			   }else{
				   this.dataSouce.forEach((item) => {
				   	tableData +=`<C1-${dateRow}_row><style_no>${item.style_no ? item.style_no : ''}</style_no><color_code>${item.color_code ? item.color_code:''}</color_code><pack_type>${item.pack_type ? item.pack_type:''}</pack_type><unit>${item.unit ? item.unit:''}</unit><usage>${item.usage ? item.usage:''}</usage><qty>${item.qty ? item.qty:''}</qty><remarks>${item.remarks ? item.remarks:''}</remarks><team>${formdata.team}</team><new_flag>${formdata.new_flag?1:0}</new_flag><customer_code>${formdata.customer_code}</customer_code><customer_name>${formdata.customer_name}</customer_name><address>${formdata.address}</address><tel_no>${formdata.tel_no}</tel_no><contactman>${formdata.contactman}</contactman><tran_date>${formdata.tran_date}</tran_date><req_date>${formdata.req_date}</req_date><salesman>${formdata.salesman}</salesman></C1-${dateRow}_row>`
				   })
			   }
				let xmlData =
`<?xml version="1.0" encoding="utf-8"?>
<C1-${dateRow}>${tableData}</C1-${dateRow}>`
				plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, function(fs) {
					// fs.root是根目录操作对象DirectoryEntry
					var directoryReader = fs.root.createReader();
					directoryReader.readEntries( function( entries ){
								var i;
								var indexs = 1
								var fileName = `${dateText}.xml`
								
								if(!that.fileName){
									// 修改
									for( i=0; i < entries.length; i++ ) {
										 if(`${(entries[i].name.split('.xml')[0]).split('-')[0]}.xml` ===`${dateText}.xml`){
											  fileName = `${dateText}-${indexs}.xml`
											   indexs++
										 }
									}
									 
								}
								that.fileName=dateText
							   
								fs.root.getFile(fileName, {
									create: true
								}, function(fileEntry) {
									fileEntry.remove(function(){
										console.log('remove success')
									})
									fileEntry.createWriter(function(writer) {
										writer.onloadstart = function(){
											writer.write(xmlData);
										}
										writer.onwrite = function(e) {
											uni.showToast({
												title: "保存成功",
												duration: 1000
											})
											// that.formReset()
										};
										writer.seek(writer.length);
										writer.write(xmlData);
										
									}, function(e) {
										alert(e.message);
									});
								});
							});
				});
			},
			openFile() {
				this.$refs.filemanager._openFile()
			},
			resultPath(e) {
				 
				this.fileReader(e) // 获取选取的文件路径
			},
			fileReader(url) {
				// 读取客户端存储的数据
				const self = this;
				// 请求本地系统文件对象 plus.io.PUBLIC_DOCUMENTS：  程序公用文档目录常量
				plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, function(fobject) {
					// fs.root是根目录操作对象DirectoryEntry
					console.log(url)
					let filename = url.split('/documents/')[1] //截取document后的文件名
				 
					fobject.root.getFile(filename, {}, function(fileEntry) {
						fileEntry.file(function(file) {
							
							var fileReader = new plus.io.FileReader();
							 
							fileReader.readAsText(file, 'utf-8');
							fileReader.onloadend = async function(evt) {
								const doc = new DOMParser().parseFromString(evt.target.result, 'text/xml')
								self.tran_date = doc.documentElement.getElementsByTagName('tran_date')[0].childNodes[0] && doc.documentElement.getElementsByTagName('tran_date')[0].childNodes[0].data.split(' ')[0];
								self.req_date = doc.documentElement.getElementsByTagName('req_date')[0].childNodes[0] && doc.documentElement.getElementsByTagName('req_date')[0].childNodes[0].data.split(' ')[0];
								self.tel_no = doc.documentElement.getElementsByTagName('tel_no')[0].childNodes[0]&& doc.documentElement.getElementsByTagName('tel_no')[0].childNodes[0].data;
								self.team = doc.documentElement.getElementsByTagName('team')[0].childNodes[0]&& doc.documentElement.getElementsByTagName('team')[0].childNodes[0].data;
								self.customer_code = doc.documentElement.getElementsByTagName('customer_code')[0].childNodes[0]&& doc.documentElement.getElementsByTagName('customer_code')[0].childNodes[0].data;
								self.address = doc.documentElement.getElementsByTagName('address')[0].childNodes[0] ? doc.documentElement.getElementsByTagName('address')[0].childNodes[0].data : "";
								self.customer_name = doc.documentElement.getElementsByTagName('customer_name')[0].childNodes[0] ? doc.documentElement.getElementsByTagName('customer_name')[0].childNodes[0].data : "";
								self.salesman = doc.documentElement.getElementsByTagName('salesman')[0].childNodes[0] && doc.documentElement.getElementsByTagName('salesman')[0].childNodes[0].data;
								self.contactman = doc.documentElement.getElementsByTagName('contactman')[0].childNodes[0]&& doc.documentElement.getElementsByTagName('contactman')[0].childNodes[0].data;;
								let tableData = []
								let fileName =filename.split('.xml')[0]
								self.fileName =  fileName
								let rowDate = (fileName.split('-')[0]).split('^')[1]
								let row = doc.documentElement.getElementsByTagName(`C1-${rowDate}_row`) || []
								 self.index = row.length+1; 
								for (let i = 0; i < row.length; i++) {
									tableData.push({
										index:i+1,
										style_no: row[i].getElementsByTagName('style_no')[0].childNodes[0]&& row[i].getElementsByTagName('style_no')[0].childNodes[0].data,
										color_code: row[i].getElementsByTagName('color_code')[0].childNodes[0] && row[i].getElementsByTagName('color_code')[0].childNodes[0].data,
										pack_type: row[i].getElementsByTagName('pack_type')[0].childNodes[0] && row[i].getElementsByTagName('pack_type')[0].childNodes[0].data,
										unit: row[i].getElementsByTagName('unit')[0].childNodes[0].data && row[i].getElementsByTagName('unit')[0].childNodes[0].data,
										usage: row[i].getElementsByTagName('usage')[0].childNodes[0] && row[i].getElementsByTagName('usage')[0].childNodes[0].data ,
										qty: row[i].getElementsByTagName('qty')[0].childNodes[0] && row[i].getElementsByTagName('qty')[0].childNodes[0].data,
										remarks: row[i].getElementsByTagName('remarks')[0].childNodes[0] && row[i].getElementsByTagName('remarks')[0].childNodes[0].data
									})
									// group1: row[i].getElementsByTagName('group1')[0].childNodes[0] && row[i].getElementsByTagName('group1')[0].childNodes[0].data,
									// group2: row[i].getElementsByTagName('group2')[0].childNodes[0] && row[i].getElementsByTagName('group2')[0].childNodes[0].data,
								}
						       var flag = doc.documentElement.getElementsByTagName('new_flag')[0].childNodes[0]&&  doc.documentElement.getElementsByTagName('new_flag')[0].childNodes[0].data 
							    if(flag === '1'){
									self.new_flag = true
								}else{
									self.new_flag = false									
								}
								self.dataSouce = tableData
								 
								setTimeout(()=>{
									uni.showToast({
										title: "导入成功",
										duration: 1000
									})
								},50)
							};
							fileReader.onerror = function(e) {
								console.log(e)
							}
						});
					});
				});
			},
			startBarCode() {
				// uni.navigateTo({
				// 	url:"../info/index"
				// })
				if (this.startScanText === '停止扫描') {
					barcode.cancel()
					this.startScanText = '开始扫描'
				} else {
					barcode.start()
					this.startScanText = '停止扫描'

				}
			},
			async closeBarCode() {
				currentWebview.remove('#barcode')
				barcode.cancel()
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			// #ifdef APP-PLUS
			async checkPermission(code) {
				let status = permision.isIOS ? await permision.requestIOS('camera') :
					await permision.requestAndroid('android.permission.CAMERA');
				if (status === null || status === 1) {
					status = 1;
				} else {
					uni.showModal({
						content: "需要相机权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}
				return status;
			},
			// #endif
			async scanplus() {
				var that = this
				let status = await this.checkPermission();
				if (status !== 1) {
					return;
				}
				barcode = await this.createBarcode();
				barcode.setFlash(false)
				barcode.start() //开始识别二维码  
				barcode.onmarked = function(type, code, file) { //扫码成功后进行的事件 
					var codeArray = that.dataSouce;
					console.log(code)
					var  postions = that.filterTableData(code)
					
					if(postions>-1){
							codeArray[postions].qty = codeArray[postions].qty*1 +1 ;
							that.dataSouce = codeArray;
							// 根据需要数量
							if (that.count == 0) {
								uni.showToast({
									title: "扫描成功",
									duration: 1000
								})
								// 减少性能损失，加入定时器控制扫描数量
								setTimeout(function() {
									barcode.start() //开始识别二维码 
								}, 1000)
							}
					
					}else{
						 
							let codes = (code+"").split('::')
							codeArray.push({
								index:that.index,
								style_no:codes[0].substring(1,codes[0].length),
								color_code:codes[1].substring(1,codes[1].length),
								pack_type:'Hanger',
								unit:'YD',
								qty: "1",
								usage: "1",
								remarks: "",
								group1: "",
								group2: "",
								 
							});
							 var index = that.index
							 index++
							 that.index = index
							 
							that.dataSouce = codeArray;
							// 根据需要数量
							if (that.count == 0) {
								uni.showToast({
									title: "扫描成功",
									duration: 1000
								})
								// 减少性能损失，加入定时器控制扫描数量
								setTimeout(function() {
									barcode.start() //开始识别二维码 
								}, 1000)
							}
						}
					}
					
			},
			filterTableData (code) {
				console.log(1111)
				if(!code) {
					uni.showToast({
						title:'未扫描到二位码',
						icon:'none'
					})
					return false
				}
				 let codes = (code+"").split('::')
				 
				 if(codes[0] && codes[1]){
					 var style_no = codes[0].substring(1,codes[0].length)
					  var color_code =  codes[1].substring(1,codes[1].length)
					 for(let i =0;i<this.dataSouce.length;i++){
					 	if(style_no === this.dataSouce[i].style_no && color_code === this.dataSouce[i].color_code){
					 		return i
					 	}
					 }
					 return -1
				 }else{
					 uni.showToast({
					 	title:'不合法的二维码'
					 })
					 setTimeout(()=>{
						 barcode.start() //开始识别二维码 
					 },1000)
					 
				 }
				
				
			},
			// 创建Barcode扫码控件
			async createBarcode() {
				currentWebview = this.$mp.page.$getAppWebview();
				// #ifdef APP-PLUS  
				let _this = this
				// if (!embed) {
				// 	embed = plus.barcode.create('barcode', [plus.barcode.QR], {
				// 		top: (_this.CustomBar) + 'px',
				// 		left: (_this.screenWidth - 200) + 'px',
				// 		width: '200px',
				// 		height: '200px',
				// 		position: 'absolute'
				// 	});

				// 	currentWebview.append(embed);
				// }
				if (!embed) {
					embed = plus.barcode.create('barcode', [plus.barcode.QR], {
						top: (_this.CustomBar) + 'px',
						left: '0px',
						width: '400px',
						height: '400px',
						position: 'absolute'
					});
				
					currentWebview.append(embed);
				}
				// #endif
				return embed;
			},
			toggleScan() {
				this.isScan = !this.isScan

			},
			getScanCode(val) {
				console.log(val)
			},
			SwitchD(e) {
				this.new_flag = e.detail.value
			},
			DateChange(e) {
				this.tran_date = e.detail.value
			},
			endDateChange(e) {
				this.req_date = e.detail.value
			},
			editReset(){
				console.log('reset')
			},
			qtyChange(e){
				this.tableQty = e
			},
			usageChange(e){
				this.tableUsage = e
			}
		}
	}
</script>

<style>
	.pd-rg-10 {
		padding-right: 10px;
	}

	.sub-wrap {

		left: 405px;
		height: 200px;
	}

	.title {
		padding: 0 5px;
		line-height: 38px;
	}

	.flex-row input {
		border: 1px solid #d6cfcf;
		text-align: left;
		padding-left: 5px;
		height: 38px;
	}

	.flex-row {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		font-size: 18px;
		margin: 10px 0;
	}

	.base-info-wrap {
		height: 400px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		background: #fefefe;
	}

	.base-info-item {
		height: 50px;

		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;

	}

	.base-info-item button {
		margin: 0 3px;
	}

	uni-switch::after,
	uni-switch::before {
		font: 20px;
	}

	page {
		padding-top: 45px;
	}
	.cu-modal{
		z-index: 9999;
	}
	.cu-form-group{
		min-height: 38px;
	}
	.cu-form-group uni-picker .picker{
		line-height: 38px;
	}
	.modal_wrap{
		height: 300px;
		overflow: scroll;
	}
	.modal_wrap .uni-input-input{
		text-align: right;
	}
	.modal_wrap .uni-input-placeholder{
		text-align: right;
		font-size: 16px;
	}
	.modal_wrap .cu-form-group uni-picker::after{
		line-height: 38px;
	}
	.modal_wrap .cu-form-group .title{
		font-size: 18px;
	}
	.fix-bottom{
		position: fixed;
		bottom:0;
		left:0;
		width: 100%;
		height: 30px;
		background: red;
		color: #fff;
		font-size: 20px;
		line-height: 30px;
		
	}
	.fix-bottom view{
		float: left;
		text-align: center;
	}
	
</style>
