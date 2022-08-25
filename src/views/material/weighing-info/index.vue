<template>
  <div style="margin-top: 25px" class="weighing_width">
    <el-form style="margin-left: 10px" :inline="true">
      <el-form-item label="机台">
        <el-select v-model="equip" placeholder="请选择" @change="equipChange" @visible-change="equipVisibleChange">
          <el-option
            v-for="item in equipOptions"
            :key="item.equip_no"
            :label="item.equip_no"
            :value="item.equip_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button v-if="!disabled" type="info" @click="save">保存并下载</el-button>
      </el-form-item>
    </el-form>
    <el-form style="margin-left: 10px" :inline="true">
      <el-form-item label="当前机台">
        <el-input v-model="equip" type="text" :disabled="true" />
      </el-form-item>
    </el-form>
    <el-table :data="tableBinCbData" border style="width: 100%">
      <el-table-column label="炭黑称">
        <el-table-column prop="tank_name" label="炭黑罐" />
        <el-table-column prop="material_name1" label="物料名称">
          <template slot-scope="scope">{{ scope.row.material_name1 }}</template>
        </el-table-column>
        <el-table-column prop="low_value" label="慢称值">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.low_value" :disabled="disabled || !scope.row.use_flag" size="mini" :step="0.01" :max="99" :min="0" step-strictly @blur="low_value_change(scope.row, scope.row.low_value)" />
          </template>
        </el-table-column>
        <el-table-column prop="advance_value" label="提前量">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.advance_value" :disabled="disabled || !scope.row.use_flag" size="mini" :step="0.01" :max="99" :min="0" step-strictly @blur="advance_value_change(scope.row, scope.row.advance_value)" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="（单位0.1S）">
        <el-table-column prop="adjust_value" label="调整值">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.adjust_value" :disabled="disabled || !scope.row.use_flag" size="mini" :step="0.01" :max="99" :min="0" step-strictly @blur="adjust_value_change(scope.row, scope.row.adjust_value)" />
          </template>
        </el-table-column>
        <el-table-column prop="dot_time" label="点动时间">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.dot_time" :disabled="disabled || !scope.row.use_flag" size="mini" :step="1" :max="99" :min="0" step-strictly @blur="dot_time_change(scope.row, scope.row.dot_time)" />
          </template>
        </el-table-column>
        <el-table-column prop="fast_speed" label="快称速度">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.fast_speed" :disabled="disabled || !scope.row.use_flag" size="mini" :step="1" :max="99" :min="0" step-strictly @blur="fast_speed_change(scope.row, scope.row.fast_speed)" />
          </template>
        </el-table-column>
        <el-table-column prop="low_speed" label="慢称速度">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.low_speed" :disabled="disabled || !scope.row.use_flag" size="mini" :step="1" :max="99" :min="0" step-strictly @blur="low_speed_change(scope.row, scope.row.low_speed)" />
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-table :data="tableBinOilData" border style="width: 75%">
      <el-table-column label="油料称">
        <el-table-column prop="tank_name" label="油料罐" />
        <el-table-column prop="material_name1" label="物料名称">
          <template slot-scope="scope">{{ scope.row.material_name1 }}</template>
        </el-table-column>
        <el-table-column prop="low_value" label="慢称值">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.low_value" :disabled="disabled || !scope.row.use_flag" size="mini" :step="0.01" :max="99" :min="0" step-strictly @blur="low_value_change(scope.row, scope.row.low_value)" />
          </template>
        </el-table-column>
        <el-table-column prop="advance_value" label="提前量">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.advance_value" :disabled="disabled || !scope.row.use_flag" size="mini" :step="0.01" :max="99" :min="0" step-strictly @blur="advance_value_change(scope.row, scope.row.advance_value)" />
          </template>
        </el-table-column>
        <el-table-column prop="adjust_value" label="调整值">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.adjust_value" :disabled="disabled || !scope.row.use_flag" size="mini" :step="0.01" :max="99" :min="0" step-strictly @blur="adjust_value_change(scope.row, scope.row.adjust_value)" />
          </template>
        </el-table-column>
        <el-table-column prop="dot_time" label="点动时间">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.dot_time" :disabled="disabled || !scope.row.use_flag" size="mini" :step="1" :max="99" :min="0" step-strictly @blur="dot_time_change(scope.row, scope.row.dot_time)" />
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  weighCb,
  weighOil,
  equip
} from '@/api/weigh'
import { mapGetters } from 'vuex'
export default {
  data: function() {
    return {
      tableBinCbData: [],
      tableBinOilData: [],
      equip: '',
      equipOptions: [],
      disabled: true
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.getDisabled()
    this.getEquip()
  },
  methods: {
    getDisabled() {
      this.permissionObj = this.permission
      this.disabled = !(this.permissionObj.production.materialtankstatus && this.permissionObj.production.materialtankstatus.indexOf('change') > -1)
    },
    async getEquip() {
      const equipData = await equip('get')
      if (localStorage.getItem('addPlan:equip')) {
        const equipId = JSON.parse(localStorage.getItem('addPlan:equip'))
        for (var i = 0; i < equipData.results.length; i++) {
          if (equipData.results[i].id === Number(equipId)) {
            this.equip = equipData.results[i].equip_no
          }
        }
      } else {
        this.equip = equipData.results[0].equip_no
        localStorage.setItem('addPlan:equip', JSON.stringify(equipData.results[0].id))
      }
      this.getCbList()
      this.getOilList()
    },
    async getCbList() {
      try {
        const cbData = await weighCb('get', {
          params: { equip_no: this.equip }
        })
        this.tableBinCbData = cbData.results
      // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    async getOilList() {
      try {
        const oilData = await weighOil('get', {
          params: { equip_no: this.equip }
        })
        this.tableBinOilData = oilData.results
      // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    async putCbList() {
      try {
        const arr = JSON.parse(JSON.stringify(this.tableBinCbData))
        arr.forEach(d => {
          d.low_value = (d.low_value).toString()
          d.advance_value = (d.advance_value).toString()
          d.adjust_value = (d.adjust_value).toString()
          d.dot_time = (d.dot_time).toString()
          d.fast_speed = (d.fast_speed).toString()
          d.low_speed = (d.low_speed).toString()
        })
        console.log(arr)
        await weighCb('put', { data: arr })
        this.$message({
          showClose: true,
          message: '炭黑罐保存成功',
          type: 'success',
          center: true
        })
        this.putOilList()
      // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    async putOilList() {
      try {
        const arr = JSON.parse(JSON.stringify(this.tableBinOilData))
        arr.forEach(d => {
          d.low_value = (d.low_value).toString()
          d.advance_value = (d.advance_value).toString()
          d.adjust_value = (d.adjust_value).toString()
          d.dot_time = (d.dot_time).toString()
          d.fast_speed = (d.fast_speed).toString()
          d.low_speed = (d.low_speed).toString()
        })
        await weighOil('put', { data: arr })
        this.$message({
          showClose: true,
          message: '油料罐保存成功',
          type: 'success',
          center: true
        })
      // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    async getEquipList() {
      try {
        const equipData = await equip('get')
        this.equipOptions = equipData.results
      // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    equipVisibleChange(bool) {
      if (bool) {
        this.getEquipList()
      }
    },
    equipChange() {
      for (var i = 0; i < this.equipOptions.length; i++) {
        if (this.equipOptions[i].equip_no === this.equip) {
          localStorage.setItem('addPlan:equip', JSON.stringify(this.equipOptions[i].id))
        }
      }
      this.getCbList()
      this.getOilList()
    },
    async save() {
      await this.putCbList()
      // await this.putOilList()
    },
    low_value_change(row, value) {
      if (!value) {
        row.low_value = 0
      }
    },
    advance_value_change(row, value) {
      if (!value) {
        row.advance_value = 0
      }
    },
    adjust_value_change(row, value) {
      if (!value) {
        row.adjust_value = 0
      }
    },
    dot_time_change(row, value) {
      if (!value) {
        row.dot_time = 0
      }
    },
    fast_speed_change(row, value) {
      if (!value) {
        row.fast_speed = 0
      }
    },
    low_speed_change(row, value) {
      if (!value) {
        row.low_speed = 0
      }
    }
  }
}
</script>

<style lang="scss">
.weighing_width{
  .el-input-number{
    width: 90%;
  }
}
</style>
