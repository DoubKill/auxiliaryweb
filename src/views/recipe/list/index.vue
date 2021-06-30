<template>
  <div
    v-loading="loading"
    element-loading-text="加载中..."
  >
    <br>
    <el-form :inline="true">
      <el-form-item label="机台">
        <el-select
          v-model="SelectEquip"
          size="mini"
          style="width: 150px"
          clearable
          filterable
          placeholder="请选择"
          @visible-change="SelectEquipDisplay"
          @change="SelectEquipChange"
        >
          <el-option
            v-for="item in SelectEquipOptions"
            :key="item.id"
            :label="item.equip_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="SelectRecipeStatus"
          size="mini"
          style="width: 150px"
          clearable
          filterable
          placeholder="请选择"
          @change="SelectRecipeStatusChange"
        >
          <el-option
            v-for="item in SelectRecipeStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产地">
        <el-select
          v-model="SelectSite"
          size="mini"
          style="width: 150px"
          clearable
          filterable
          placeholder="请选择"
          @visible-change="SelectSiteDisplay"
          @change="SelectSiteChange"
        >
          <el-option
            v-for="item in SelectSiteOptions"
            :key="item.id"
            :label="item.global_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="段次">
        <el-select
          v-model="SelectStage"
          size="mini"
          style="width: 150px"
          clearable
          filterable
          placeholder="请选择"
          @visible-change="SelectStageDisplay"
          @change="SelectStageChange"
        >
          <el-option
            v-for="item in SelectStageOptions"
            :key="item.id"
            :label="item.global_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="胶料编码">
        <el-input
          v-model="input_rubber_no"
          size="mini"
          style="width: 200px"
          @input="input_rubber_noChanged"
        />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          v-if="permissionObj.recipe.productbatching && permissionObj.recipe.productbatching.indexOf('add')>-1"
          :disabled="!currentRow.id"
          @click="CopyRecipeButton"
        >复制新增</el-button>
      </el-form-item>
      <!-- <el-form-item style="float: right">
<el-button>删除</el-button>
</el-form-item> -->
      <el-form-item style="float: right">
        <!-- <el-button @click="AddRecipeButton">新增</el-button> -->
        <el-button
          v-if="permissionObj.recipe.productbatching && permissionObj.recipe.productbatching.indexOf('add')>-1"
          @click="AddRecipeButton"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="singleTable"
      highlight-current-row
      :data="tableData"
      border
      style="width: 100%"
      @row-click="handleCurrentChange"
    >

      <el-table-column
        align="center"
        type="index"
        width="50"
        label="No"
      />

      <el-table-column
        align="center"
        width="160%"
        prop="stage_product_batch_no"
        label="胶料配方编码"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="recipe_display_change(scope.row)"
          >
            {{ scope.row.stage_product_batch_no }}
          </el-link>
        </template>

      </el-table-column>
      <!-- <el-table-column align="center" prop="stage_product_batch_no" label="胶料编码" /> -->
      <el-table-column
        align="center"
        prop="product_name"
        label="胶料名称"
      />
      <el-table-column
        align="center"
        width="200%"
        prop="equip_name"
        label="机台名称"
      />
      <el-table-column
        align="center"
        width="100%"
        prop="equip_no"
        label="机台编号"
      />
      <el-table-column
        v-if="false"
        align="center"
        width="100%"
        prop="equip"
        label="机台id"
      />
      <el-table-column
        align="center"
        width="100%"
        prop="dev_type_name"
        label="炼胶机类型"
      />
      <el-table-column
        align="center"
        prop="used_type"
        label="状态"
        :formatter="usedTypeFormatter"
      />
      <el-table-column
        fixed="right"
        align="center"
        label="审核"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-if="scope.row.used_type === 1 && (permissionObj.recipe.prod && permissionObj.recipe.prod.indexOf('submit')>-1)"
              size="mini"
              @click="status_true(scope.row)"
            >
              提交
            </el-button>
            <el-button
              v-if="scope.row.used_type === 2 && (permissionObj.recipe.prod && permissionObj.recipe.prod.indexOf('using')>-1)"
              size="mini"
              @click="status_true(scope.row)"
            >
              启用
            </el-button>
            <el-button
              v-if="scope.row.used_type === 2 && (permissionObj.recipe.prod && permissionObj.recipe.prod.indexOf('using')>-1)"
              size="mini"
              @click="status_false(scope.row)"
            >
              驳回
            </el-button>
            <el-button
              v-if="scope.row.used_type === 5 && (permissionObj.recipe.prod && permissionObj.recipe.prod.indexOf('abandon')>-1)"
              size="mini"
              @click="status_true(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="(scope.row.used_type === 4 || scope.row.used_type === 5)&& (permissionObj.recipe.prod && permissionObj.recipe.prod.indexOf('abandon')>-1)"
              size="mini"
              @click="status_false(scope.row)"
            >
              废弃
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="batching_weight"
        label="配料重量"
      />
      <el-table-column
        align="center"
        prop="production_time_interval"
        label="炼胶时间"
      />
      <el-table-column
        align="center"
        prop="site_name"
        label="site"
      />
      <el-table-column
        align="center"
        prop="stage_name"
        label="段次"
      />
      <el-table-column
        align="center"
        width="100%"
        prop="sp_num"
        label="收皮(车/托)"
      />
      <el-table-column
        align="center"
        width="120%"
        prop="created_username"
        label="创建者"
      />
      <el-table-column
        align="center"
        prop="submit_username"
        label="提交人"
      />
      <el-table-column
        align="center"
        prop="used_username"
        label="启用人"
      />
      <el-table-column
        align="center"
        prop="reject_username"
        label="驳回人"
      />
      <!-- <el-table-column align="center" prop="obsolete_username" label="废弃人" /> -->
      <el-table-column
        align="center"
        width="180%"
        prop="created_date"
        label="创建时间"
      />
      <el-table-column
        align="center"
        width="180%"
        prop="last_updated_date"
        label="修改时间"
      />
      <el-table-column
        align="center"
        prop="batching_type"
        label="配方来源"
        :formatter="RecipeSourceFormatter"
      />
      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        width="140px"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-if="permissionObj.recipe.productbatching && permissionObj.recipe.productbatching.indexOf('change')>-1 && scope.row.batching_type !== 2"
              size="mini"
              :disabled="scope.row.used_type !== 1 && scope.row.used_type !== 4"
              @click="ModifyRecipeButton(scope.row)"
            >修改</el-button>
            <el-button
              v-if="permissionObj.recipe.productbatching && permissionObj.recipe.productbatching.indexOf('delete')>-1"
              size="mini"
              type="danger"
              @click.stop="handleRecipeDelete(scope.row)"
            >
              {{ scope.row.used_type===4?'停用':'启用' }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="currentPage"
      :page-size="pageSize"
      :total="tableDataTotal"
      layout="total, prev, pager, next"
      @current-change="pagehandleCurrentChange"
    />

    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="复制新增配方"
      :visible.sync="dialogCopyRecipeSync"
    >

      <el-form
        ref="copyForm"
        :model="copyForm"
        :inline="true"
        :rules="rules"
      >
        <el-form-item
          label="选择机台"
          prop="CopySelectEquip"
        >
          <el-select
            v-model="copyForm.CopySelectEquip"
            size="mini"
            clearable
            style="width: 300px"
            placeholder="请选择"
            @change="SelectCopyEquipChange"
          >
            <el-option
              v-for="item in SelectCopyEquipOptions"
              :key="item.id"
              :label="item.equip_no"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <br>
        <el-form-item
          v-show="isNormalRecipe"
          label="产地"
          prop="site"
        >
          <el-select
            v-model="copyForm.site"
            size="mini"
            style="width: 150px"
            clearable
            placeholder="请选择"
            :disabled="!isNormalRecipe"
            @visible-change="SelectSiteDisplay"
          >
            <el-option
              v-for="item in SelectSiteOptions"
              :key="item.id"
              :label="item.global_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-show="isNormalRecipe"
          label="SITE"
          prop="SITE"
        >
          <el-select
            v-model="copyForm.SITE"
            size="mini"
            style="width: 100px"
            clearable
            placeholder="请选择"
            :disabled="!isNormalRecipe"
            @visible-change="SelectGlobalSITEDisplay"
          >
            <el-option
              v-for="item in SelectSITEOptions"
              :key="item.id"
              :label="item.global_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-show="isNormalRecipe"
          label="段次"
          prop="selectStage"
        >
          <el-select
            v-model="copyForm.selectStage"
            size="mini"
            style="width: 150px"
            clearable
            placeholder="请选择"
            :disabled="!isNormalRecipe"
            @visible-change="SelectStageDisplay"
          >
            <el-option
              v-for="item in SelectStageOptions"
              :key="item.id"
              :label="item.global_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-show="isNormalRecipe"
          label="胶料编号"
          prop="selectRecipeNo"
        >
          <el-select
            v-model="copyForm.selectRecipeNo"
            filterable
            size="mini"
            style="width: 100px"
            clearable
            placeholder="请选择"
            :disabled="!isNormalRecipe"
            @visible-change="SelectRecipeNoDisplay"
          >
            <el-option
              v-for="item in SelectRecipeNoOptions"
              :key="item.id"
              :label="item.product_no"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-show="isNormalRecipe"
          label="版本"
          prop="version"
        >
          <el-input
            v-model="copyForm.version"
            :disabled="!isNormalRecipe"
            style="width: 90px"
            size="mini"
            placeholder="版本"
          />
        </el-form-item>
        <el-form-item
          v-show="isNormalRecipe"
          label="方案"
        >
          <el-input
            v-model="copyForm.scheme"
            :disabled="!isNormalRecipe"
            style="width: 90px"
            size="mini"
            placeholder="方案"
          />
        </el-form-item>
        <el-form-item
          v-show="!isNormalRecipe"
          label="胶料配方编码"
        >
          <el-input
            v-model="copyForm.stage_product_batch_no"
            :disabled="isNormalRecipe"
            style="width: 300px"
            size="mini"
            placeholder="胶料配方编码"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="dialogCopyRecipeSync = false"
        >取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="CopyRecipeConfirm('copyForm')"
        >确 定</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import { validate_versions, recipe_no_url, global_SITE_url, recipe_list, recipe_copy_list, equip_url, site_url, stage_url } from '@/api/recipe_fun'
// import { constantRoutes } from '@/router'
// import { dataTool } from 'echarts/lib/echarts'
import { mapGetters } from 'vuex'

export default {
  data: function() {
    return {
      loading: null,
      SelectEquipOptions: [],
      SelectCopyEquipOptions: [],
      SelectRecipeStatusOptions: [{
        value: 1, label: '编辑'
      }, {
        value: 2, label: '提交'
      }, {
        value: 4, label: '启用'
      }, {
        value: 7, label: '停用'
      }, {
        value: 5, label: '驳回'
      }
      ],
      // }, {
      //   value: 6, label: '废弃'
      // }

      SelectSITEOptions: [],
      SelectSiteOptions: [],
      SelectStageOptions: [],
      SelectRecipeNoOptions: [],
      category__category_name: null,
      SelectEquip: null,

      SelectRecipeStatus: null,
      SelectSite: null,
      SelectStage: null,
      input_rubber_no: null,
      tableData: [],
      currentRow: {
        product_name: null,
        stage_name: null
      },
      currentPage: 1,
      pageSize: 10,
      tableDataTotal: 0,

      dialogCopyRecipeSync: false,

      copyForm: {
        CopySelectEquip: '',
        site: '',
        SITE: '',
        selectStage: '',
        selectRecipeNo: '',
        version: '',
        scheme: '',
        stage_product_batch_no: ''
      },
      rules: {
        CopySelectEquip: [{ required: true, message: '请选择机台', trigger: 'change' }],
        site: [{ required: true, message: '请选择产地', trigger: 'change' }],
        SITE: [{ required: true, message: '请选择SITE', trigger: 'change' }],
        selectStage: [{ required: true, message: '请选择段次', trigger: 'change' }],
        selectRecipeNo: [{ required: true, message: '请选择胶料编号', trigger: 'change' }],
        version: [{ required: true, message: '请填写版本', trigger: 'change' }]
      },
      batch_no: ''
    }
  },
  computed: {
    ...mapGetters(['permission']),
    isNormalRecipe() {
      return !!this.currentRow.product_name
    }
  },
  created() {
    this.batch_no = this.$route.query.batch_no || ''

    this.permissionObj = this.permission
    this.site_list()
    this.global_SITE_list()
    this.stage_list()
    this.recipe_no_list()
    this.equip_list()

    if (localStorage.getItem('recipeGetParams')) {
      var recipeGetParams = JSON.parse(localStorage.getItem('recipeGetParams'))
      this.SelectEquip = recipeGetParams.equip_id
      this.SelectRecipeStatus = recipeGetParams.used_type
      this.SelectSite = recipeGetParams.factory_id
      this.SelectStage = recipeGetParams.stage_id
      this.input_rubber_no = recipeGetParams.stage_product_batch_no
    }

    //  加默认分页，传到要返回的界面，再传回来
    this.currentPage = this.$route.params.currentPage || 1
    this.get_recipe_list(this.currentPage)
  },
  methods: {
    async recipe_no_list() {
      try {
        const recipe_no_list = await recipe_no_url('get', {
          params: {}
        })
        if (recipe_no_list.results.length !== 0) {
          this.SelectRecipeNoOptions = recipe_no_list.results
        }
      } catch (e) { throw new Error(e) }
    },
    SelectRecipeNoDisplay: function(bool) {
      if (bool) {
        this.recipe_no_list()
      }
    },
    async global_SITE_list() {
      try {
        const global_SITE_list = await global_SITE_url('get', {
          params: {}
        })
        if (global_SITE_list.results.length !== 0) {
          this.SelectSITEOptions = global_SITE_list.results
        }
      } catch (e) { throw new Error(e) }
    },
    SelectGlobalSITEDisplay: function(bool) {
      if (bool) {
        this.global_SITE_list()
      }
    },
    async get_recipe_list(val = 1) {
      try {
        var v_SelectEquip = this.SelectEquip ? this.SelectEquip : ''
        var v_SelectRecipeStatus = this.SelectRecipeStatus ? this.SelectRecipeStatus : ''
        var v_SelectSite = this.SelectSite ? this.SelectSite : ''
        var v_SelectStage = this.SelectStage ? this.SelectStage : ''
        var v_input_rubber_no = this.input_rubber_no ? this.input_rubber_no : ''
        this.loading = true
        var params = {
          page: val,
          equip_id: v_SelectEquip,
          used_type: v_SelectRecipeStatus,
          factory_id: v_SelectSite,
          stage_id: v_SelectStage,
          stage_product_batch_no: v_input_rubber_no
        }
        var str = JSON.stringify(params)
        localStorage.setItem('recipeGetParams', str)
        const recipe_listData = await recipe_list('get', null, {
          params
        })
        this.tableData = recipe_listData.results
        this.tableDataTotal = recipe_listData.count
        this.loading = false
        this.currentRow = {
          product_name: null,
          stage_name: null
        }

        // 跳转过来的，默认选择某一个，一般为第一个
        const obj = this.tableData.filter(D => D.stage_product_batch_no === this.batch_no &&
        D.used_type === 4 && D.batching_type === 2)
        if (this.$refs.singleTable && obj[0]) {
          this.$refs.singleTable.setCurrentRow(obj[0])
          this.handleCurrentChange(obj[0])
        }
      } catch (e) {
        this.loading = false
        throw new Error(e)
      }
    },
    async status_recipe_fun(id, obj) {
      try {
        await recipe_list('patch', id, obj)
        this.$message('状态切换成功')
        this.get_recipe_list(this.currentPage)
      } catch (e) { throw new Error(e) }
    },
    async delete_recipe_fun(id) {
      try {
        await recipe_list('delete', id, {
          params: {}
        })
      } catch (e) { throw new Error(e) }
    },
    async copy_recipe_list(obj) {
      try {
        const copy_recipe_listData = await recipe_copy_list('post', null, obj)
        return copy_recipe_listData
      } catch (e) {
        return { 'error': e }
      }
    },
    async equip_list() {
      try {
        const equip_list = await equip_url('get', {
          params: { category_name: '密炼设备' }
        })
        if (equip_list.results.length !== 0) {
          this.SelectEquipOptions = equip_list.results
        }
      } catch (e) { throw new Error(e) }
    },
    async equip_copy_list(dev_type_param) {
      try {
        const equip_list = await equip_url('get', {
          params: { category_name: '密炼设备' }
        })
        // const equip_copy_list = await equip_copy_url('get', {
        //   params: { dev_type: dev_type_param }
        // })
        // console.log('aaaaaa------------')
        // console.log(equip_copy_list.results)
        this.SelectCopyEquipOptions = equip_list.results
      } catch (e) { throw new Error(e) }
    },
    async site_list() {
      try {
        const site_list = await site_url('get', {
          params: { all: 1, class_name: '产地' }
        })

        if (site_list.results.length !== 0) {
          this.SelectSiteOptions = site_list.results
        }
      } catch (e) { throw new Error(e) }
    },
    async stage_list() {
      try {
        const stage_list = await stage_url('get', {
          params: { all: 1, class_name: '胶料段次' }
        })
        if (stage_list.results.length !== 0) {
          this.SelectStageOptions = stage_list.results
        }
      } catch (e) { throw new Error(e) }
    },
    SelectEquipDisplay: function(bool) {
      if (bool) {
        this.equip_list()
      }
    },
    SelectSiteDisplay: function(bool) {
      if (bool) {
        this.site_list()
      }
    },
    SelectStageDisplay: function(bool) {
      if (bool) {
        this.stage_list()
      }
    },
    SelectCopyEquipChange: function() {
      for (var i = 0; i < this.SelectCopyEquipOptions.length; i++) {
        if (this.copyForm.CopySelectEquip === this.SelectCopyEquipOptions[i]['id']) { this.category__category_name = this.SelectCopyEquipOptions[i]['category__category_name'] }
      }
    },

    handleCurrentChange: function(val) {
      this.currentRow = val
    },
    pagehandleCurrentChange: function(val) {
      this.currentRow = val // ?
      this.currentPage = val
      this.get_recipe_list(val)
      this.currentRow = {
        product_name: null,
        stage_name: null
      }
    },

    usedTypeFormatter: function(row, column) {
      return this.usedTypeChoice(row.used_type)
    },
    usedTypeChoice: function(usedType) {
      switch (usedType) {
        case 1:
          return '编辑'
        case 2:
          return '提交'
        case 3:
          return '校对'
        case 4:
          return '启用'
        case 5:
          return '驳回'
        case 6:
          return '废弃'
      }
    },
    RecipeSourceFormatter: function(row, column) {
      return this.RecipeSourceChoice(row.batching_type)
    },
    RecipeSourceChoice: function(usedType) {
      switch (usedType) {
        case 1:
          return '上辅机'
        case 2:
          return 'MES'
      }
    },
    status_true: async function(check_row) {
      await this.status_recipe_fun(check_row['id'], { data: { pass_flag: true }})
    },
    status_false: async function(check_row) {
      await this.status_recipe_fun(check_row['id'], { data: { pass_flag: false }})
    },
    SelectEquipChange: function() {
      this.get_recipe_list()
    },
    SelectRecipeStatusChange: function() {
      this.get_recipe_list()
    },
    SelectSiteChange: function() {
      this.get_recipe_list()
    },
    SelectStageChange: function() {
      this.get_recipe_list()
    },
    input_rubber_noChanged: function() {
      this.get_recipe_list()
    },

    recipe_display_change: function(raw) {
      this.$router.push({ name: 'RecipeDisplay', params: { ...raw, currentPage: this.currentPage }})
      this.$route.params
    },
    AddRecipeButton: function() {
      this.$router.push({ name: 'RecipeCreate', params: {}})
      this.$route.params
    },
    ModifyRecipeButton: function(modify_row) {
      // console.log(modify_row)
      this.$router.push({ name: 'RecipeModify', params: { ...modify_row, currentPage: this.currentPage }})
      this.$route.params
    },
    handleRecipeDelete: function(delete_row) {
      const str = delete_row.used_type === 4 ? '停用' : '启用'

      this.$confirm('确定' + str + delete_row['stage_product_batch_no'] + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.delete_recipe_fun(delete_row['id'])
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        await this.get_recipe_list(this.currentPage)
      }).catch(() => {

      })
    },
    CopyRecipeButton: async function() {
      if (this.$refs['copyForm']) {
        this.$refs['copyForm'].resetFields()
      }
      this.copyForm.site = this.currentRow.factory_id
      this.copyForm.SITE = this.currentRow.site_id
      this.copyForm.selectStage = this.currentRow.stage_id
      this.copyForm.selectRecipeNo = this.currentRow.product_info_id
      this.copyForm.version = this.currentRow.versions
      this.copyForm.scheme = this.currentRow.precept
      this.copyForm.stage_product_batch_no = this.currentRow.stage_product_batch_no
      this.dialogCopyRecipeSync = true
      await this.equip_copy_list(this.currentRow['dev_type'])
    },
    routerToCopy() {
      this.dialogCopyRecipeSync = false
      var add_currentRow = Object.assign(this.currentRow, { ...this.copyForm, copy_equip_id: this.copyForm.CopySelectEquip, category__category_name: this.category__category_name })
      add_currentRow.isNormalRecipe = this.isNormalRecipe
      for (var i = 0; i < this.SelectCopyEquipOptions.length; i++) {
        if (this.copyForm.CopySelectEquip === this.SelectCopyEquipOptions[i]['id']) {
          add_currentRow.equip_no = this.SelectCopyEquipOptions[i]['equip_no']
        }
      }
      if (this.copyForm.CopySelectEquip !== this.currentRow.equip_id) {
        this.$notify({
          title: '提示',
          message: '选择机台与拷贝源机台不同, 炭黑和油料称量信息未被拷贝！',
          duration: 0
        })
      }
      // console.log(add_currentRow)
      this.$router.push({ name: 'RecipeCopy', params: add_currentRow })
    },
    CopyRecipeConfirm: async function(formName) {
      if (!this.isNormalRecipe) {
        this.$refs[formName].validateField('CopySelectEquip', error => {
          if (!error) {
            // this.routerToCopy()
            validate_versions({
              site: null,
              product_info: null,
              versions: null,
              equip: this.copyForm.CopySelectEquip,
              stage: null,
              stage_product_batch_no: this.copyForm.stage_product_batch_no
            }).then(response => {
              this.routerToCopy()
              // eslint-disable-next-line handle-callback-err
            }).catch(error => {
              // this.$message.error('配方已存在, 不可复制')
            })
          }
        })
        return
      }
      this.$refs[formName].validate(valide => {
        if (valide) {
          validate_versions({
            site: this.copyForm.SITE,
            product_info: this.copyForm.selectRecipeNo,
            versions: this.copyForm.version,
            equip: this.copyForm.CopySelectEquip,
            stage: this.copyForm.selectStage
          }).then(response => {
            this.routerToCopy()
            // eslint-disable-next-line handle-callback-err
          }).catch(error => {
            // this.$message.error('配方已存在, 不可复制')
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

