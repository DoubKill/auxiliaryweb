<template>
  <div style="margin-top: 25px">
    <el-form
      style="margin-left: 10px"
      :inline="true"
    >
      <el-form-item label="原材料类别">
        <el-select
          v-model="params.material_type_id"
          clearable
          placeholder="请选择"
          @change="search"
        >
          <el-option
            v-for="item in materialTypes"
            :key="item.id"
            :label="item.global_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否使用">
        <el-select
          v-model="params.use_flag"
          clearable
          placeholder="请选择"
          @change="search"
        >
          <el-option
            v-for="(item, index) in [{label: 'Y', value: true}, {label: 'N', value: false}]"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="原材料名称">
        <el-input
          v-model="params.material_name"
          @input="search"
        />
      </el-form-item>
      <el-form-item
        v-if="permissionObj.production.material&&permissionObj.production.material.indexOf('add')>-1"
        style="float: right;"
      >
        <el-button @click="showCreateMaterialDialog">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        align="center"
        type="index"
        width="50"
        label="No"
      />
      <el-table-column
        prop="material_no"
        label="原材料代码"
        width="150"
      />
      <el-table-column
        prop="material_name"
        label="原材料名称"
        width="150"
      />
      <el-table-column
        prop="for_short"
        label="原材料简称"
        width="100"
      />
      <el-table-column
        prop="material_type_name"
        label="原材料类别"
        width="100"
      />
      <!-- <el-table-column
        prop="density"
        label="比重"
        width="50"
      /> -->
      <el-table-column
        prop="package_unit_name"
        label="包装单位"
      />
      <el-table-column
        :formatter="formatter"
        prop="use_flag"
        label="使用与否"
        width="50"
      />
      <el-table-column
        prop="created_username"
        label="创建人员"
      />
      <el-table-column
        width="160"
        prop="created_date"
        label="创建时间"
      />
      <el-table-column
        prop="update_user_name"
        label="更新人员"
      />
      <el-table-column
        prop="last_updated_date"
        width="160"
        label="更新时间"
      />
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <!-- <el-button-group> -->
          <el-button
            v-if="permissionObj.production.material&&permissionObj.production.material.indexOf('change')>-1"
            size="mini"
            @click="showUpdateMaterialDialog(scope.row)"
          >编辑
          </el-button>
          <el-button
            v-if="permissionObj.production.material&&permissionObj.production.material.indexOf('change')>-1"
            size="mini"
            type="danger"
            @click="deleteMaterial(scope.row)"
          >{{ scope.row.use_flag ? '停用':'启用' }}
            <!-- </el-button> -->
            <!-- </el-button-group> -->
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      :total="total"
      :current-page.sync="params.page"
      @currentChange="currentChange"
    />
    <create-material-dialog
      ref="createMaterialDialog"
      :material-types="materialTypes"
      :packing-units="packingUnits"
      @handleSuccessed="getMaterialList"
    />
    <update-material-dialog
      ref="updateMaterialDialog"
      :material-types="materialTypes"
      :packing-units="packingUnits"
      @handleSuccessed="getMaterialList"
    />

  </div>
</template>

<script>
import { getMaterials, getMaterialTypes, getPackingUnits, deleteMaterial } from '@/api/material'
import page from '@/components/page'
import CreateMaterialDialog from './CreateMaterialDialog'
import UpdateMaterialDialog from './UpdateMaterialDialog'
import { mapGetters } from 'vuex'

export default {
  components: { page, CreateMaterialDialog, UpdateMaterialDialog },
  data() {
    return {
      tableData: [],
      materialTypes: [],
      packingUnits: [],
      params: {
        page: 1,
        material_type_id: null,
        use_flag: true,
        material_name: ''
      },
      total: 0,
      currentPage: 1
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.permissionObj = this.permission
    this.getMaterialList()
    this.getMaterialTypes()
    this.getPackingUnits()
  },
  methods: {
    showCreateMaterialDialog() {
      this.$refs.createMaterialDialog.show()
    },
    showUpdateMaterialDialog(material) {
      this.$refs.updateMaterialDialog.show(JSON.parse(JSON.stringify(material)))
    },
    deleteMaterial(material) {
      var str = material.use_flag ? '停用' : '启用'
      this.$confirm('确定' + str + material.material_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMaterial(material.id).then(response => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getMaterialList()
        })
      })
    },
    getMaterialList() {
      getMaterials(this.params).then(response => {
        this.tableData = response.results || []
        this.total = response.count
      })
    },
    getMaterialTypes() {
      getMaterialTypes().then(response => {
        this.materialTypes = response.results
      })
    },
    getPackingUnits() {
      getPackingUnits().then(response => {
        this.packingUnits = response.results
      })
    },
    search() {
      this.params.page = 1
      this.getMaterialList()
    },
    formatter: function(row, column) {
      return row.use_flag ? 'Y' : 'N'
    },
    currentChange(page) {
      this.params.page = page
      this.getMaterialList()
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
