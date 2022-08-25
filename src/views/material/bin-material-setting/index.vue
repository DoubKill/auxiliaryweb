<template>
  <div style="margin-top: 25px; margin:25px auto auto auto">
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
      <el-form-item label="最新修改人">
        <el-input v-model="last_updated_username" type="text" :disabled="true" />
      </el-form-item>
      <el-form-item label="最新修改日期">
        <el-input v-model="last_updated_date" type="text" :disabled="true" />
      </el-form-item>
    </el-form>
    <el-table :data="tableBinCbData" border style="width: 80%">
      <el-table-column label="炭黑称">
        <el-table-column prop="tank_name" width="150%" label="炭黑罐" />
        <el-table-column prop="material_no" label="物料名称">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.material_no"
              style="width:100%"
              filterable
              :disabled="!scope.row.use_flag"
              @change="masterialChange(scope.row,cbOptions)"
            >
              <el-option
                v-for="item in cbOptions"
                :key="item.material_no"
                :label="item._material_name1"
                :value="item.material_no"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="provenance" label="产地">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.provenance"
              style="width:100%"
              filterable
              :disabled="!scope.row.use_flag"
              @visible-change="getProvenanceOptions($event, scope.row.material_no)"
            >
              <el-option
                v-for="item in provenanceOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :formatter="formatter" prop="use_flag" label="使用状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.use_flag"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="停用"
              :disabled="disabled"
            />
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-table :data="tableBinOilData" border style="width: 80%">
      <el-table-column label="油料称">
        <el-table-column prop="tank_name" width="150%" label="油料罐" />
        <el-table-column prop="material_no" label="物料名称">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.material_no"
              filterable
              style="width:100%"
              :disabled="!scope.row.use_flag"
              @change="masterialChange(scope.row,oilOptions)"
            >
              <el-option
                v-for="item in oilOptions"
                :key="item.material_no"
                :label="item._material_name1"
                :value="item.material_no"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="provenance" label="产地">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.provenance"
              style="width:100%"
              filterable
              :disabled="!scope.row.use_flag"
              @visible-change="getProvenanceOptions($event, scope.row.material_no)"
            >
              <el-option
                v-for="item in provenanceOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :formatter="formatter" prop="use_flag" label="使用状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.use_flag"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="停用"
              :disabled="disabled"
            />
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
  materials,
  equip,
  getMaterialSuppliers
} from '@/api/weigh'
import { mapGetters } from 'vuex'
export default {
  data: function() {
    return {
      tableBinCbData: [],
      tableBinOilData: [],
      equip: '',
      equipOptions: [],
      materialsTypeId: '',
      cbOptions: [],
      oilOptions: [],
      disabled: true,
      provenanceOptions: [],
      last_updated_username: '',
      last_updated_date: ''
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.getDisabled()
    this.getEquip()
    this.getMaterialsCbList()
    this.getMaterialsOilList()
  },
  methods: {
    getProvenanceOptions(bool, material_no) {
      // console.log(bool, 'bool')
      // console.log(material_no, 'material_no')
      if (bool) {
        getMaterialSuppliers({ material_no: material_no })
          .then(response => {
            this.provenanceOptions = response
          })
      }
    },
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
        const cbData = await weighCb('get', { params: { equip_no: this.equip }})
        this.tableBinCbData = cbData.results
        if (this.tableBinCbData.length) {
          this.last_updated_username = this.tableBinCbData[0].last_updated_username
          this.last_updated_date = this.tableBinCbData[0].last_updated_date
        }

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
        await weighCb('put', { data: this.tableBinCbData })
        this.$message({
          showClose: true,
          message: '炭黑罐保存成功',
          type: 'success',
          center: true
        })
        this.putOilList()
        this.getCbList()
      // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    async putOilList() {
      try {
        await weighOil('put', { data: this.tableBinOilData })
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
    async getMaterialsCbList() {
      try {
        const materialsData = await materials('get', {
          params: { material_type_name: '炭黑', all: 1, mc_code: 1 }
        })
        this.cbOptions = materialsData.results
        this.cbOptions.forEach(d => {
          var reg = new RegExp('-C|-X', 'g')
          d._material_name1 = d.material_name.replace(reg, '')
        })
      // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    async getMaterialsOilList() {
      try {
        const materialsData = await materials('get', {
          params: { material_type_name: '油料', all: 1, mc_code: 1 }
        })
        this.oilOptions = materialsData.results
        this.oilOptions.forEach(d => {
          var reg = new RegExp('-C|-X', 'g')
          d._material_name1 = d.material_name.replace(reg, '')
        })
      // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    formatter: function(row, column) {
      return row.use_flag ? '使用' : '停用'
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
    masterialChange(row, list) {
      row.provenance = ''
      const arr = list.filter(d => d.material_no === row.material_no)
      row.material_name1 = arr[0].material_name
    },
    stateChange() {},
    save() {
      // console.log(this.tableBinCbData)
      // console.log(this.tableBinOilData)
      this.putCbList()
      // this.putOilList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
