<template>
  <el-select
    v-if="!showColor"
    v-model="productBatchingId"
    clearable
    filterable
    :loading="loading"
    @change="productBatchingChanged"
    @visible-change="visibleChange"
  >
    <el-option
      v-for="item in productBatchings"
      :key="item.stage_product_batch_no"
      :label="item.stage_product_batch_no"
      :value="item.stage_product_batch_no"
    />
  </el-select>
  <el-select
    v-else
    v-model="productBatchingId"
    clearable
    filterable
    :loading="loading"
    @change="productBatchingChanged"
    @visible-change="visibleChange"
  >
    <el-option
      v-for="item in productBatchings"
      :key="item.product_no"
      :label="item.product_no"
      :value="item.product_no"
    >
      <span :style="{color: item.used?'blue':''}">{{ item.product_no }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { getBatchingMaterials } from '@/api/product-batching'
import { productMaterials } from '@/api/plan'
export default {
  props: {
    // 根据stage_product_batch_no去重
    isStageProductbatchNoRemove: {
      type: Boolean,
      default: false
    },
    // 过滤出启用和弃用的胶料
    makeUseBatch: {
      type: Boolean,
      default: false
    },
    showColor: { // 是否显示启用的 颜色区分
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      productBatchings: [],
      productBatchingId: '',
      productBatchingById: {},
      loading: true
    }
  },
  created() {
  },
  methods: {
    productBatchingChanged() {
      this.$emit('productBatchingChanged', this.productBatchingId)
    },
    visibleChange(bool) {
      if (bool && this.productBatchings.length === 0) {
        this.getProductBatchings()
      }
    },
    getProductBatchings() {
      if (this.showColor) {
        productMaterials('get').then(response => {
          this.loading = false
          this.productBatchings = response || []
        }).catch(() => {
          this.loading = false
        })
        return
      }
      getBatchingMaterials().then(response => {
        let productBatchings = response
        // productBatchings.forEach(productBatching => {
        //   this.productBatchingById[productBatching.id] = productBatching
        // })
        if (this.makeUseBatch) {
          let arr = []
          arr = productBatchings.filter(D => D.used_type === 4 || D.used_type === 6)
          productBatchings = arr
        }
        if (this.isStageProductbatchNoRemove) {
          var obj = {}
          var newArr = productBatchings.reduce((item, next) => {
            obj[next.stage_product_batch_no]
              ? ' '
              : (obj[next.stage_product_batch_no] = true && item.push(next))
            return item
          }, [])
          productBatchings = newArr || []
        }
        this.loading = false
        this.productBatchings = productBatchings
      })
    }
  }
}
</script>
