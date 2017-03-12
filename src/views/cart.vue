<template>
        <div class="container">
            <div class="cart">
                <div class="checkout-title">
                    <span>购物车</span>
                </div>

                <!-- table -->
                <div class="item-list-wrap">
                    <div class="cart-item">
                        <div class="cart-item-head">
                            <ul>
                                <li>商品信息</li>
                                <li>商品金额</li>
                                <li>商品数量</li>
                                <li>总金额</li>
                                <li>编辑</li>
                            </ul>
                        </div>
                        <ul class="cart-item-list">
                            <li v-for="product in productList">
                                <div class="cart-tab-1">
                                    <div class="cart-item-check">
                                        <a href="javascipt:;" class="item-check-btn" v-bind:class="{'check':product.checked}" v-on:click="selectedProduct(product)">
                                            <svg class="icon icon-ok"><use xlink:href="#icon-ok"></use></svg>
                                        </a>
                                    </div>
                                    <div class="cart-item-pic">
                                        <img v-bind:src="product.productImage" alt="{{product.productName}}">
                                    </div>
                                    <div class="cart-item-title">
                                        <div class="item-name" v-text="product.productName"></div>
                                    </div>
                                    <div class="item-include">
                                        <dl>
                                            <dt>赠送:</dt>
                                            <dd v-for="item in product.parts">{{item.partsName}}</dd>
                                        </dl>
                                    </div>
                                </div>
                                <div class="cart-tab-2">
                                    <div class="item-price" v-text="product.productPrice"></div>
                                </div>
                                <div class="cart-tab-3">
                                    <div class="item-quantity">
                                        <div class="select-self select-self-open">
                                            <div class="quentity">
                                                <a href="javascript:;" v-on:click="changeMoney(product,-1)">-</a>
                                                <input type="text" v-model="product.productQuentity" disabled>
                                                <a href="javascript:;" v-on:click="changeMoney(product,1)">+</a>
                                            </div>
                                        </div>
                                        <div class="item-stock">有货</div>
                                    </div>
                                </div>
                                <div class="cart-tab-4">
                                    <div class="item-price-total">{{product.productPrice | formatMoney(product.productQuentity)}}</div>
                                </div>
                                <div class="cart-tab-5">
                                    <div class="cart-item-opration">
                                        <a href="javascript:;" class="item-edit-btn" @click.stop="delConfirm(product)">
                                            <svg class="icon icon-del"><use xlink:href="#icon-del"></use></svg>
                                        </a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- footer -->
                <div class="cart-foot-wrap">
                    <div class="cart-foot-l">
                        <div class="item-all-check">
                            <a href="javascipt:;" @click="selectAll(true)">
                            <span class="item-check-btn" :class="{'check':checkAll}">
                                <svg class="icon icon-ok"><use xlink:href="#icon-ok"></use></svg>
                            </span>
                                <span>全选</span>
                            </a>
                        </div>
                        <div class="item-all-del">
                            <a href="javascipt:;" class="item-del-btn" @click="selectAll(false)">
                                取消全选
                            </a>
                        </div>
                    </div>
                    <div class="cart-foot-r">
                        <div class="item-total">
                            Item total: <span class="total-price">{{totalMoney|formatMoney}}</span>
                        </div>
                        <div class="next-btn-wrap">
                            <a href="address.html" class="btn btn--red">结账</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="md-modal modal-msg md-modal-transition" id="showModal" v-bind:class="{'md-show':showModal}" @click.stop="">
            <div class="md-modal-inner">
                <div class="md-top">
                    <button class="md-close" @click="showModal=false;">关闭</button>
                </div>
                <div class="md-content">
                    <div class="confirm-tips">
                        <p id="cusLanInfo" lan="Cart.Del.Confirm">你确认删除此订单信息吗?</p>
                    </div>
                    <div class="btn-wrap col-2">
                        <button class="btn btn--m" id="btnModalConfirm" @click="delCurrentProduct">Yes</button>
                        <button class="btn btn--m btn--red" id="btnModalCancel" @click="showModal=false;">No</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="md-overlay" id="showOverLay" v-show="showModal"></div>
</template>
<script>
	// require('../css/base2.scss');
	// require('../css/checkout.scss');
	// require('../css/modal.scss');
	// require('../js/cart.js');
	export default{
		data(){
	            	return{
	                		showModal:false,
				productList:[],
				totalMoney:0,
				checkAll:false,
				currentProduct:''
	            	}
	        	},
	        	mounted: function () {
			var _this = this;
			this.cartView();
		},
		filters: {
			formatMoney: function (value,quentity) {
				if(!quentity)quentity=1;
				return "¥ "+(value*quentity).toFixed(2) +"元";
			}
		},
		methods:{
			cartView: function () {
				this.$http.get("data/cartData.json").then(response=>{
					var res = response.data;
					console.log(res);
					if(res && res.status=="1"){
						this.productList = res.result.list;
						this.calcTotalMoney();
					}
				});
			},
			selectAll: function (isCheck) {
				this.checkAll=isCheck;
				this.productList.forEach(function (item) {
					if(typeof item.checked == "undefined"){
						Vue.set(item,"checked",isCheck);
					}else{
						item.checked = isCheck;
					}
				})
				this.calcTotalMoney();
			},
			selectedProduct: function (product) {
				if(typeof product.checked == "undefined"){
					//Vue.set(product,"checked",true);
					this.$set(product,"checked",true);
				}else{
					product.checked = !product.checked;
				}
				this.calcTotalMoney();
				this.isCheckAll();
			},
			isCheckAll: function () {
				let flag = true;
				this.productList.forEach(function (item) {
					if(!item.checked){
						flag = false;
					}
				})
				if(flag){
					this.checkAll = true;
				}else{
					this.checkAll = false;
				}

			},
			calcTotalMoney: function () {
				let totalMoney = 0;
				this.productList.forEach(function (item) {
					if(item.checked){
						totalMoney+=item.productPrice*item.productQuentity;
					}
				});
				this.totalMoney = totalMoney;
			},
			changeMoney: function (product,way) {
				if(way>0){
					product.productQuentity++;
				}else{
					product.productQuentity--;
					if(product.productQuentity<0){
						product.productQuentity=0;
					}
				}
				this.calcTotalMoney();
			},
			delConfirm: function (product) {
				this.showModal = true;
				this.currentProduct = product;
			},
			delCurrentProduct: function () {
				this.showModal = false;
				var index = this.productList.indexOf(this.currentProduct);
				this.productList.splice(index,1);
			}
		}
	}
</script>
