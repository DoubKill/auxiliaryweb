<template>
  <div style="margin-top: 25px">
    <el-row>
      <el-form
        style="margin-left: 10px"
        :inline="true"
      >
        <el-col :span="12">
          <el-form-item label="机台">
            <el-select
              v-model="equip"
              placeholder="请选择"
              @change="equipChange"
            >
              <!-- @visible-change="equipVisibleChange" -->
              <el-option
                v-for="item in equipOptions"
                :key="item.equip_no"
                :label="item.equip_no"
                :value="item.equip_no"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间: ">
            <el-date-picker
              v-model="beginTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
              @change="searchChange"
            />
          </el-form-item>
          <el-form-item label="结束时间: ">
            <el-date-picker
              v-model="endTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
              @change="searchChange"
            />
          </el-form-item>
          <el-form-item label="班次: ">
            <el-select
              v-model="classes"
              clearable
              placeholder="请选择"
              @visible-change="classesVisibleChange"
              @change="searchChange"
            >
              <el-option
                v-for="item in classesOptions"
                :key="item.global_name"
                :label="item.global_name"
                :value="item.global_name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="配方: ">
            <el-select
              v-model="recipe"
              filterable
              clearable
              placeholder="请选择"
              @visible-change="recipeVisibleChange"
              @change="searchChange"
            >
              <el-option
                v-for="(item, index) in recipeOptions"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <div style="width:100%;text-align:center;background: #e99d2a;color:#fff;display:inline-block;font-size:100px;word-wrap:break-word;padding:8px 0;">
            {{ equip }}
          </div>
        </el-col>
        <el-col :span="7">
          <el-form-item style="float: right;margin-left:10px">
            <el-button
              v-if="permissionObj.plan.productclassesplan.indexOf('view')>-1"
              type="info"
              @click="refreshPlan"
            >刷新</el-button>
            <el-button
              v-if="permissionObj.plan.productclassesplan.indexOf('add')>-1"
              type="info"
              @click="showAddPlanDialog"
            >新增</el-button>
            <el-button
              v-if="permissionObj.plan.productclassesplan.indexOf('change')>-1&&version!=='v3'"
              type="info"
              :disabled="disabled"
              @click="stopPlan"
            >停止</el-button>
            <el-button
              v-if="permissionObj.plan.productclassesplan.indexOf('delete')>-1"
              type="info"
              :disabled="disabled"
              @click="delPlan"
            >删除</el-button>
            <el-button
              v-if="permissionObj.plan.productclassesplan.indexOf('change')>-1"
              type="info"
              :disabled="disabled"
              @click="issuedPlan"
            >下达</el-button>
          </el-form-item>

          <el-form-item style="float: right;margin-left:10px">
            <el-button
              v-if="permissionObj.plan.productclassesplan.indexOf('change')>-1"
              type="info"
              :disabled="disabled"
              @click="upPlan"
            >上调</el-button>
            <el-button
              v-if="permissionObj.plan.productclassesplan.indexOf('change')>-1"
              type="info"
              :disabled="disabled"
              @click="downPlan"
            >下调</el-button>
            <el-button
              v-if="permissionObj.plan.productclassesplan.indexOf('change')>-1"
              type="info"
              :disabled="disabled"
              @click="showAlterTrainNumberDialog"
            >修改车次</el-button>
            <el-button
              v-if="permissionObj.plan.productclassesplan.indexOf('change')>-1&&version!=='v3'"
              type="info"
              style="width: 120px"
              :disabled="disabled"
              @click="retransmissionpPlan"
            >重传</el-button>
          </el-form-item>
        </el-col>
        <!-- </el-form> -->
        <!-- </el-row>
    <el-row>
      <el-form
        style="margin-left: 10px"
        :inline="true"
      > -->
      </el-form>
    </el-row>
    <div style="border-radius: 2px; border:.5px solid #000; padding:10px">
      <el-row>
        <el-form
          style="margin-left: 10px"
          :inline="true"
        >
          <el-form-item label="机台">
            <el-input
              v-model="equip"
              type="text"
              disabled
            />
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-form
          style="margin-left: 10px"
          :inline="true"
        >
          <el-form-item label="开始">
            <el-input
              v-model="currentAlive.begin_time"
              type="text"
              style="float: left"
              disabled
            />
          </el-form-item>
          <el-form-item label="配方">
            <span style="float: right; margin-left: 60px" />
            <el-input
              v-model="currentAlive.product_no"
              type="text"
              style="float: right"
              disabled
            />
          </el-form-item>
          <el-form-item label="设定车次">
            <el-input
              v-model="currentAlive.plan_trains"
              type="text"
              style="float: left"
              disabled
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-input
              v-model="currentAlive.status"
              type="text"
              style="float: left"
              disabled
            />
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-form
          style="margin-left: 10px"
          :inline="true"
        >
          <el-form-item label="结束">
            <el-input
              v-model="currentAlive.end_time"
              type="text"
              disabled
            />
          </el-form-item>
          <el-form-item label="当前计划">
            <span style="float: right; margin-left: 30px" />
            <el-input
              v-model="currentAlive.plan_classes_uid"
              type="text"
              disabled
            />
          </el-form-item>
          <el-form-item label="当前车次">
            <el-input
              v-model="currentAlive.actual_trains"
              type="text"
              disabled
            />
          </el-form-item>
        </el-form>
      </el-row>
    </div>
    <el-table
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%"
      @current-change="handleCurrentChange"
    >
      <el-table-column
        type="index"
        label="No"
        width="55"
      />
      <el-table-column
        prop="plan_classes_uid"
        label="计划编号"
        width="180"
      />
      <el-table-column
        prop="sn"
        label="序号"
        width="55"
      />
      <el-table-column
        prop="stage_product_batch_no"
        label="配方名称"
        width="150"
      />
      <el-table-column
        prop="begin_time"
        label="开始时间"
        width="160"
      />
      <el-table-column
        prop="end_time"
        label="结束时间"
        width="160"
      />
      <el-table-column
        prop="equip_name"
        label="机台"
        width="100"
      />
      <el-table-column
        prop="classes"
        label="班次"
        width="80"
      />
      <el-table-column
        prop="plan_trains"
        label="设定"
        width="80"
      />
      <el-table-column
        prop="actual_trains"
        label="完成"
        width="80"
      >
        <template slot-scope="scope">
          <div v-if="scope.row && scope.row.actual_trains">{{ scope.row.actual_trains }}</div>
          <div v-else>{{ 0 }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_username"
        label="操作员"
        width="120"
      />
      <el-table-column
        prop="status"
        label="状态"
      />
    </el-table>
    <page
      :total="total"
      :current-page="page"
      @currentChange="currentChange"
    />
    <alter-train-number-dialog
      ref="alterTrainNumberDialog"
      @handleSuccessed="getPlanList"
    />

    <add-plan-dialog
      ref="addPlanDialog"
      @handleSuccessed="getEquip"
    />
  </div>
</template>

<script>
import {
  equip,
  palletFeedBacks,
  delPalletFeedBacks,
  issuedPlan,
  stopPlan,
  retransmissionpPlan,
  upRegulation,
  downRegulation,
  globalCodes,
  productbatching,
  getPlanStatusList
} from '@/api/plan'
import AlterTrainNumberDialog from './AlterTrainNumberDialog'
import AddPlanDialog from './AddPlanDialog'
import page from '@/components/page'
import { mapGetters } from 'vuex'

export default {
  components: { page, AlterTrainNumberDialog, AddPlanDialog },
  data: function() {
    return {
      equip: '',
      equipOptions: [],
      params: {
        page: 1
      },
      tableData: [],
      currentRow: {},
      currentAlive: {},
      total: 0,
      page: 1,

      beginTime: '',
      endTime: '',
      // yesterday: '',
      recipe: '',
      recipeOptions: [],
      classes: '',
      classesOptions: [],
      findForm: {},
      formError: {},

      updateTrainsId: '',
      disabled: true,
      version: null
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.permissionObj = this.permission
    this.getEquip()
  },
  methods: {
    async getEquip() {
      const equipData = await equip('get')
      this.equipOptions = equipData.results
      if (localStorage.getItem('addPlan:equip')) {
        const equipId = JSON.parse(localStorage.getItem('addPlan:equip'))
        for (var i = 0; i < equipData.results.length; i++) {
          if (equipData.results[i].id === Number(equipId)) {
            this.equip = equipData.results[i].equip_no
            this.version = equipData.results[i].version
          }
        }
      } else {
        this.equip = equipData.results[0].equip_no
        this.version = equipData.results[0].version
        localStorage.setItem('addPlan:equip', JSON.stringify(equipData.results[0].id))
      }
      this.clearFindForm()
      // this.beginTime = this.yesterday
      this.getPlanStatusList()
      this.getPlanList()
    },
    async getPlanStatusList() {
      const planStatusListData = await getPlanStatusList({ equip_no: this.equip })
      this.currentAlive = planStatusListData.results
    },
    async getPlanList() {
      this.params['page'] = this.page
      this.params['equip_no'] = this.equip
      // if (this.beginTime) {
      this.params['begin_time'] = this.beginTime
      // }
      // if (this.endTime) {
      this.params['end_time'] = this.endTime
      // }
      try {
        const Data = await palletFeedBacks('get', { params: this.params })
        this.tableData = Data.results
        this.total = Data.count
        // for (var i = 0; i < this.tableData.length; i++) {
        //   if (this.tableData[i].status === '运行中') {
        //     var data1 = this.tableData[i]
        //     this.tableData.unshift(data1)
        //     this.tableData.splice(i, 1)
        //   }
        // }
        // this.tableData.splice(0, 0, data1)
        // eslint-disable-next-line no-empty
      } catch (e) { }
    },
    async getEquipList() {
      try {
        const equipData = await equip('get')
        this.equipOptions = equipData.results
        // eslint-disable-next-line no-empty
      } catch (e) { }
    },
    refreshPlan() {
      this.getPlanStatusList()
      this.getPlanList()
    },
    classesVisibleChange(bool) {
      if (bool) {
        this.getClassList()
      }
    },
    recipeVisibleChange(bool) {
      if (bool) {
        this.getRecipeList()
      }
    },
    equipVisibleChange(bool) {
      if (bool) {
        this.getEquipList()
      }
    },
    equipChange() {
      this.params = {}
      this.page = 1
      for (var i = 0; i < this.equipOptions.length; i++) {
        if (this.equipOptions[i].equip_no === this.equip) {
          localStorage.setItem('addPlan:equip', JSON.stringify(this.equipOptions[i].id))
          this.version = this.equipOptions[i].version
        }
      }
      this.clearFindForm()
      // this.beginTime = this.yesterday
      this.getPlanStatusList()
      this.getPlanList()
    },

    async getClassList() {
      try {
        const classData = await globalCodes('get', {
          params: { all: 1, class_name: '班次' }
        })
        this.classesOptions = classData.results
        // eslint-disable-next-line no-empty
      } catch (e) { }
    },
    async getRecipeList() {
      try {
        const recipeData = await productbatching('get', { params: { all: 1, distinct: 1 }})
        this.recipeOptions = recipeData.results
        // eslint-disable-next-line no-empty
      } catch (e) { }
    },
    getBeginTime(myDate) {
      const Y = myDate.getFullYear()
      const m = myDate.getMonth() + 1
      const M = m < 10 ? '0' + m : m
      const d = myDate.getDate()
      const D = d < 10 ? ('0' + d) : d
      return Y + '-' + M + '-' + D + ' 00:00:00'
    },
    getEndTime(myDate) {
      const Y = myDate.getFullYear()
      const m = myDate.getMonth() + 1
      const M = m < 10 ? '0' + m : m
      const d = myDate.getDate()
      const D = d < 10 ? ('0' + d) : d
      const h = myDate.getHours()
      const H = h < 10 ? ('0' + h) : h
      const minute = myDate.getMinutes()
      const Minute = minute < 10 ? ('0' + minute) : minute
      const second = myDate.getSeconds()
      const Second = second < 10 ? ('0' + second) : second
      return Y + '-' + M + '-' + D + ' ' + H + ':' + Minute + ':' + Second
    },
    clearFindForm() {
      const myDate = new Date()
      this.endTime = this.getEndTime(myDate)
      const yesterday = myDate.getTime() - 1000 * 60 * 60 * 24
      myDate.setTime(yesterday)
      this.beginTime = this.getBeginTime(myDate)
      this.classes = ''
      this.recipe = ''
      this.params = {
        page: 1
      }
    },
    searchChange() {
      // if (this.beginTime) {
      //   this.params['begin_time'] = this.beginTime
      // }
      // if (this.endTime) {
      //   this.params['end_time'] = this.endTime
      // }
      this.params['classes'] = this.classes
      this.params['product_no'] = this.recipe
      this.page = 1
      this.getPlanList()
      // this.findDialogVisible = false
    },

    delPlan() {
      this.$confirm(
        '此操作将永久删除' + this.currentRow.plan_classes_uid + '计划, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        delPalletFeedBacks(this.currentRow.id).then((response) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getPlanList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    upPlan() {
      upRegulation(this.params, this.currentRow.id).then((response) => {
        this.$message({
          type: 'success',
          message: '上调成功!'
        })
        this.getPlanList()
      })
    },

    downPlan() {
      try {
        downRegulation(this.params, this.currentRow.id).then((response) => {
          this.$message({
            type: 'success',
            message: '下调成功!'
          })
          this.getPlanList()
        })
      } catch (error) {
        this.$message.error(error)
      }
    },

    stopPlan() {
      this.$alert('机台： ' + this.equip + '<br>计划编号： ' + this.currentRow.plan_classes_uid + '<br>配方名称： ' + this.currentRow.stage_product_batch_no,
        '停止计划', {
          showCancelButton: true,
          dangerouslyUseHTMLString: true,
          confirmButtonText: '停止',
          cancelButtonText: '取消'
        }
      ).then(() => {
        stopPlan({ id: this.currentRow.id, equip_no: this.equip }).then(
          (response) => {
            this.$message({
              type: 'success',
              message: '停止成功!'
            })
            this.getPlanStatusList()
            this.getPlanList()
          }
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消停止'
        })
      })
    },

    retransmissionpPlan() {
      retransmissionpPlan(this.currentRow).then((response) => {
        this.$message({
          type: 'success',
          message: '重传成功!'
        })
        this.getPlanStatusList()
        this.getPlanList()
      })
    },

    issuedPlan() {
      const currentTime = new Date().getTime()
      const a = new Date(this.currentRow.classes_begin_time).getTime()
      const b = new Date(this.currentRow.classes_end_time).getTime()
      const bool = !!(currentTime < a || currentTime > b) // true不在时间里面
      const str = bool ? '<h2 v-if="" style="color:red;">注意：当前时间不在' + this.currentRow.classes + '时间范围内,是否继续?</h2>'
        : '机台： ' + this.equip + '<br>计划编号： ' + this.currentRow.plan_classes_uid + '<br>配方名称： ' + this.currentRow.stage_product_batch_no

      this.$alert(str,
        '下达计划', {
          showCancelButton: true,
          dangerouslyUseHTMLString: true,
          confirmButtonText: '',
          cancelButtonText: '取消'
        }
      ).then(() => {
        if (bool) {
          this.$alert('机台： ' + this.equip + '<br>计划编号： ' + this.currentRow.plan_classes_uid + '<br>配方名称： ' + this.currentRow.stage_product_batch_no,
            '下达计划', {
              showCancelButton: true,
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }
          ).then(() => {
            issuedPlan(this.currentRow).then((response) => {
              this.$message({
                type: 'success',
                message: '下达成功!'
              })
              this.getPlanStatusList()
              this.getPlanList()
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消下达'
            })
          })
        } else {
          issuedPlan(this.currentRow).then((response) => {
            this.$message({
              type: 'success',
              message: '下达成功!'
            })
            this.getPlanStatusList()
            this.getPlanList()
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消下达'
        })
      })
    },
    showAlterTrainNumberDialog() {
      this.$refs.alterTrainNumberDialog.show(this.currentRow)
    },
    showAddPlanDialog() {
      this.$refs.addPlanDialog.show()
    },
    handleCurrentChange(val) {
      this.currentRow = val
      if (val) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    currentChange(page) {
      this.page = page
      this.getPlanList()
    }
  }
}
</script>

<style scoped>
 /* @media screen and (max-width: 700px) {
        } */
</style>
