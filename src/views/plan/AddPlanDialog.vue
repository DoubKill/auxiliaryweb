<template>
  <el-dialog
    width="90%"
    :visible.sync="addPlanVisible"
    :before-close="handleClose"
    title="添加胶料日生产计划"
  >
    <div v-loading="loadingFrom">
      <div style="margin-bottom: 15px">
        <p>
          选择日期时，必须使用工厂时间！！！
        </p>
        <el-select
          v-model="equipIdForAdd"
          filterable
          placeholder="请选择机台"
          style="margin-right: 10px"
          @change="equipSelected"
        >
          <el-option
            v-for="equip in equips"
            :key="equip.id"
            :label="equip.equip_no"
            :value="equip.id"
          />
        </el-select>
        <el-date-picker
          v-model="day_time"
          style="margin-right: 10px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          disabled
          @change="getPlanSchedules"
        />
        <el-select v-model="planScheduleId" filterable placeholder="倒班规则">
          <el-option
            v-for="planSchedule in planSchedules"
            :key="planSchedule.id"
            :label="planSchedule.work_schedule__schedule_name"
            :value="planSchedule.id"
          />
        </el-select>

        <el-button style="float: right" :disabled="!saveEnable" @click="batchSave">保存</el-button>
        <el-button :loading="loadingBtn" @click="addOnePlan">添加</el-button>
        <el-button :loading="loadingBtn1" @click="addOnePlan1">从mes添加</el-button>
      </div>
      <p style="text-align: right; color: red"> {{ weightError }} </p>
      <p style="text-align: right; color: red"> {{ timeError }} </p>
      <el-table
        :data="plansForAdd"
        border
      >
        <el-table-column fixed prop="equip_.equip_no" label="机台" width="40" align="center" />
        <el-table-column fixed prop="work_schedule_name" label="倒班规则" width="40" align="center" />
        <el-table-column fixed prop="day_time" label="日期" width="60" align="center">
          <template v-if="row.planSchedule" slot-scope="{ row }">
            <el-popover trigger="hover" placement="top">
              <p v-for="schedule_plan in row.planSchedule.work_schedule_plan" :key="schedule_plan.id">
                {{ schedule_plan.classes_name + ':' + schedule_plan.start_time + '到' + schedule_plan.end_time }}
              </p>
              <div slot="reference">
                <span size="mini">{{ row.day_time }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="胶料配方编码" width="180" align="center">
          <template v-if="!scope.row.sum" slot-scope="scope">
            <el-select v-model="scope.row.product_batching" filterable @change="productBatchingChanged(scope.row)">
              <el-option
                v-for="productBatching in scope.row.productBatchings"
                :key="productBatching.id"
                :label="productBatching.stage_product_batch_no"
                :value="productBatching.id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="batching_weight" label="配料重量（吨）" width="70" align="center" />
        <el-table-column prop="production_time_interval" label="炼胶时间（秒）" width="70" align="center" />
        <el-table-column label="当前库存（吨）" width="70" align="center" />
        <el-table-column v-for="(item,i) in classesOptions" :key="i" :label="`${item.classes_name}计划`" align="center">
          <el-table-column label="顺序" width="210">
            <template v-if="!scope.row.sum && scope.row.pdp_product_classes_plan[item.no].enable" slot-scope="scope">
              <el-input-number
                v-model.number="scope.row.pdp_product_classes_plan[item.no].sn"
                :precision="0"
                :min="0"
                :disabled="item.classes_name!==currentFactory.classes"
                @blur="() => {
                  if (!scope.row.pdp_product_classes_plan[item.no].sn) {
                    scope.row.pdp_product_classes_plan[item.no].sn = 0
                  }
                }"
              />
            </template>
          </el-table-column>
          <el-table-column label="车次" width="210" align="center">
            <template v-if="scope.row.pdp_product_classes_plan[item.no].enable" slot-scope="scope">
              <el-input-number
                v-model.number="scope.row.pdp_product_classes_plan[item.no].plan_trains"
                :precision="0"
                :disabled="scope.row.sum||item.classes_name!==currentFactory.classes"
                :min="0"
                @blur="() => {
                  if (!scope.row.pdp_product_classes_plan[item.no].plan_trains) {
                    scope.row.pdp_product_classes_plan[item.no].plan_trains = 0
                    planTrainsChanged(scope.row, item.no)
                  }
                }"
                @change="planTrainsChanged(scope.row, item.no)"
              />
            </template>
          </el-table-column>
          <el-table-column :prop="`pdp_product_classes_plan[${item.no}].weight`" label="重量" align="center" />
          <el-table-column :prop="`pdp_product_classes_plan[${item.no}].time`" label="时间" align="center" />
        </el-table-column>
        <!-- <el-table-column label="早班计划" align="center">
          <el-table-column label="顺序" width="210">
            <template v-if="!scope.row.sum && scope.row.pdp_product_classes_plan[0].enable" slot-scope="scope">
              <el-input-number
                v-model.number="scope.row.pdp_product_classes_plan[0].sn"
                :precision="0"
                :min="0"
                @blur="() => {
                  if (!scope.row.pdp_product_classes_plan[0].sn) {
                    scope.row.pdp_product_classes_plan[0].sn = 0
                  }
                }"
              />
            </template>
          </el-table-column>
          <el-table-column label="车次" width="210" align="center">
            <template v-if="scope.row.pdp_product_classes_plan[0].enable" slot-scope="scope">
              <el-input-number
                v-model.number="scope.row.pdp_product_classes_plan[0].plan_trains"
                :precision="0"
                :disabled="scope.row.sum"
                :min="0"
                @blur="() => {
                  if (!scope.row.pdp_product_classes_plan[0].plan_trains) {
                    scope.row.pdp_product_classes_plan[0].plan_trains = 0
                    planTrainsChanged(scope.row, 0)
                  }
                }"
                @change="planTrainsChanged(scope.row, 0)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="pdp_product_classes_plan[0].weight" label="重量" align="center" />
          <el-table-column prop="pdp_product_classes_plan[0].time" label="时间" align="center" />
        </el-table-column> -->
        <!-- <el-table-column label="中班计划" align="center">
          <el-table-column label="顺序" width="210" align="center">
            <template v-if="!scope.row.sum && scope.row.pdp_product_classes_plan[1].enable" slot-scope="scope">
              <el-input-number
                v-model.number="scope.row.pdp_product_classes_plan[1].sn"
                :min="0"
                :precision="0"
                @blur="() => {
                  if (!scope.row.pdp_product_classes_plan[1].sn) {
                    scope.row.pdp_product_classes_plan[1].sn = 0
                  }
                }"
              />
            </template>
          </el-table-column>
          <el-table-column label="车次" width="210" align="center">
            <template v-if="scope.row.pdp_product_classes_plan[1].enable" slot-scope="scope">
              <el-input-number
                v-model.number="scope.row.pdp_product_classes_plan[1].plan_trains"
                :precision="0"
                :disabled="scope.row.sum"
                :min="0"
                @blur="() => {
                  if (!scope.row.pdp_product_classes_plan[1].plan_trains) {
                    scope.row.pdp_product_classes_plan[1].plan_trains = 0
                    planTrainsChanged(scope.row, 1)
                  }
                }"
                @change="planTrainsChanged(scope.row, 1)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="pdp_product_classes_plan[1].weight" label="重量" align="center" />
          <el-table-column prop="pdp_product_classes_plan[1].time" label="时间" align="center" />
        </el-table-column> -->
        <!-- <el-table-column label="夜班计划" align="center">
          <el-table-column label="顺序" width="210" align="center">
            <template v-if="!scope.row.sum && scope.row.pdp_product_classes_plan[2].enable" slot-scope="scope">
              <el-input-number
                v-model.number="scope.row.pdp_product_classes_plan[2].sn"
                :min="0"
                :precision="0"
                @blur="() => {
                  if (!scope.row.pdp_product_classes_plan[2].sn) {
                    scope.row.pdp_product_classes_plan[2].sn = 0
                  }
                }"
              />
            </template>
          </el-table-column>
          <el-table-column label="车次" width="210" align="center">
            <template v-if="scope.row.pdp_product_classes_plan[2].enable" slot-scope="scope">
              <el-input-number
                v-model.number="scope.row.pdp_product_classes_plan[2].plan_trains"
                :precision="0"
                :disabled="scope.row.sum"
                :min="0"
                @blur="() => {
                  if (!scope.row.pdp_product_classes_plan[2].plan_trains) {
                    scope.row.pdp_product_classes_plan[2].plan_trains = 0
                    planTrainsChanged(scope.row, 2)
                  }
                }"
                @change="planTrainsChanged(scope.row, 2)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="pdp_product_classes_plan[2].weight" label="重量" align="center" />
          <el-table-column prop="pdp_product_classes_plan[2].time" label="时间" align="center" />
        </el-table-column> -->
        <el-table-column label="操作" align="center">
          <template v-if="!scope.row.sum" slot-scope="scope">
            <el-button type="danger" @click="deleteOnePlan(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        width="900px"
        :visible.sync="addPlanVisible1"
        title="参考MES排程数据添加计划"
        append-to-body
        :before-close="handleClose1"
      >
        <el-form :inline="true">
          <el-form-item label="班次: ">
            <el-select
              v-model="classes_add"
              disabled
            >
              <el-option
                v-for="item in [{name:'早班',id:0},{name:'中班',id:1},{name:'夜班',id:2}]"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="机台: ">
            <el-select
              v-model="equipIdForAdd"
              disabled
            >
              <el-option
                v-for="equip in equips"
                :key="equip.id"
                :label="equip.equip_no"
                :value="equip.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="机型: ">
            <el-input v-model="category" type="text" :disabled="true" />
          </el-form-item>
        </el-form>
        <h3>参考MES排程数据添加计划</h3>
        <el-table
          ref="singleTable"
          :data="mesPlanList"
          border
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column
            prop="recipe_name"
            label="规格"
            min-width="20"
            align="center"
          />
          <el-table-column
            prop="plan_trains"
            label="车数"
            min-width="20"
            align="center"
          />
          <el-table-column
            prop="time_consume"
            label="耗时（小时）"
            min-width="20"
            align="center"
          />
          <el-table-column
            prop="desc"
            label="备注"
            min-width="20"
            align="center"
          />
          <el-table-column
            prop="status"
            label="状态"
            min-width="20"
            align="center"
          />
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose1(false)">取 消</el-button>
          <el-button type="primary" @click="submitAddOnePlan">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </el-dialog>
</template>

<script>
import {
  equip,
  getRubberMateria,
  getWorkSchedules,
  getPlanSchedules,
  getPlanSchedule,
  postProductDayPlanManyCreate,
  hfRecipeList,
  schedulingResult,
  schedulingResultPost,
  currentFactoryDate
} from '@/api/plan'

import dayjs from 'dayjs'

export default {
  data() {
    return {
      addPlanVisible: false,
      equipIdForAdd: null,
      equips: [],
      equipById: {},
      day_time: dayjs().format('YYYY-MM-DD'),
      planScheduleId: null,
      planSchedules: [],
      workSchedules: [],
      plansForAdd: [],
      productBatchingById: {},
      saveEnable: false,
      weightError: '',
      timeError: '',
      version: null,
      loadingBtn: false,
      loadingFrom: true,
      loadingBtn1: false,
      addPlanVisible1: false,
      formData: {},
      category: '',
      classes_add: 0,
      mesPlanList: [],
      equip_no: '',
      currentRowMes: null,
      classesOptions: [],
      currentFactory: {}
    }
  },
  watch: {
    plansForAdd: {
      handler(plans) {
        this.saveEnable = true
        this.weightError = ''
        this.timeError = ''
        plans.forEach(plan => {
          if (!plan.sum) {
            plan.pdp_product_classes_plan.forEach(class_plan => {
              if (class_plan.weight > 99999) {
                this.saveEnable = false
                this.weightError = '计划重量过大'
              }
              if (class_plan.time > 999999.99) {
                this.saveEnable = false
                this.timeError = '计划时间过大'
              }
            })
          }
        })
      },
      deep: true
    }
  },
  created() {
    // this.getEquipList()
    this.getCurrentFactoryDate()
    this.getRubberMateria()
    this.getWorkSchedules()
    this.getPlanSchedules()
  },
  methods: {
    equipSelected(equip) {
      const arr = this.equips.filter(D => D.id === Number(equip))
      this.version = arr[0].version
      this.category = arr[0].category__category_name
      this.equip_no = arr[0].equip_no
      localStorage.setItem('addPlan:equip', equip)
    },
    show() {
      this.plansForAdd = []
      this.addPlanVisible = true
      this.getEquipList()
    },
    async getEquipList() {
      try {
        const equipData = await equip('get', { params: { all: 1, category_name: '密炼设备' }})
        this.equips = equipData.results
        this.equips.forEach(equip => {
          this.equipById[equip.id] = equip
        })
        const equipId = localStorage.getItem('addPlan:equip')
        const arr = this.equips.filter(D => D.id === Number(equipId))
        this.version = arr[0].version
        this.category = arr[0].category__category_name
        this.equip_no = arr[0].equip_no
        if (equipId) {
          this.equipIdForAdd = Number(equipId)
        }
      // eslint-disable-next-line no-empty
      } catch (e) {}
      this.loadingFrom = false
    },
    async getRubberMateria() {
      try {
        const rubberMateriaData = await getRubberMateria({
          all: 1,
          used_type: 4
        })
        this.productBatchings = rubberMateriaData.results
        rubberMateriaData.results.forEach(function(batching) {
          this.productBatchingById[batching.id] = batching
        })
      // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    async getCurrentFactoryDate() {
      try {
        const data = await currentFactoryDate()
        this.currentFactory = data
        this.day_time = this.currentFactory.factory_date
        const obj = this.classesOptions.find(d => d.classes_name === this.currentFactory.classes)
        this.classes_add = obj.no
      // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    async getWorkSchedules() {
      try {
        const workSchedulesData = await getWorkSchedules({ all: 1, work_procedure: '密炼' })
        this.workSchedules = workSchedulesData.results
        this.classesOptions = workSchedulesData.results[0].classesdetail_set
        this.classesOptions.forEach(d => {
          if (d.classes_name === '早班') {
            d.no = 0
          } else if (d.classes_name === '中班') {
            d.no = 1
          } else if (d.classes_name === '夜班') {
            d.no = 2
          }
        })
      // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    async getPlanSchedules() {
      try {
        this.loadingFrom = true
        this.planSchedules = []
        this.planScheduleId = null
        if (this.day_time) {
          const planSchedulesData = await getPlanSchedules({
            all: 1,
            day_time: this.day_time
          })
          this.planSchedules = planSchedulesData.results
          this.planScheduleId = this.planSchedules[0] ? this.planSchedules[0].id : null
        }
      // eslint-disable-next-line no-empty
      } catch (e) {}
      this.loadingFrom = false
    },

    batchSave() {
      if (!this.plansForAdd.length) {
        this.$alert('请添加计划', '错误', {
          confirmButtonText: '确定'
        })
        return
      }
      var app = this
      var plansForAdd_ = []
      this.plansForAdd.forEach(plan => {
        if (!plan.sum) {
          var plan_ = JSON.parse(JSON.stringify(plan))
          if (!plan_.product_batching && plan_.product_batching !== 0) {
            this.$alert('请选择胶料配方编码', '错误', {
              confirmButtonText: '确定'
            })
            return
          }
          plan_.pdp_product_classes_plan = []
          if (plan.pdp_product_classes_plan.filter(class_plan => {
            return class_plan.plan_trains > 0
          }).length === 0) {
            this.$alert('至少一个班次的车次大于0', '错误', {
              confirmButtonText: '确定'
            })
            return
          }
          for (var i = 0; i < plan.pdp_product_classes_plan.length; i++) {
            if (plan.pdp_product_classes_plan[i].enable) {
              plan_.pdp_product_classes_plan.push(
                plan.pdp_product_classes_plan[i]
              )
            }
          }
          plansForAdd_.push(JSON.parse(JSON.stringify(plan_)))
        }
      })
      if (!plansForAdd_.length) return
      plansForAdd_.forEach(D => {
        if (D._version === 'v3') {
          delete D.product_batching
        }
      })
      const result_id = []
      plansForAdd_.forEach(d => {
        if (d.isMes) {
          result_id.push(d.isMes)
        }
      })
      postProductDayPlanManyCreate(plansForAdd_)
        .then(response => {
          app.addPlanVisible = false
          app.$message.success('创建成功')
          app.$emit('handleSuccessed')

          schedulingResultPost({ result_id: result_id })
            .then(response => {
            })
          // eslint-disable-next-line handle-callback-err
            .catch(error => {
            })
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
        })
    },
    async addOnePlan() {
      try {
        if (!this.equipIdForAdd || !this.planScheduleId) {
          this.$alert('请选择机台和排班规则', '错误', {
            confirmButtonText: '确定'
          })
          return
        }
        this.loadingBtn = true

        const planSchedule = await getPlanSchedule(this.planScheduleId)
        var workSchedule = this.workSchedules.find(workSchedule => {
          return workSchedule.id === planSchedule.work_schedule
        })
        if (!planSchedule.work_schedule_plan.length) {
          this.$alert(planSchedule.work_schedule_name + '无排班', '错误', {
            confirmButtonText: '确定'
          })
          return
        }
        const _api = this.version === 'v3' ? hfRecipeList : getRubberMateria
        // 获取胶料
        const rubberMateriaData = await _api({
          all: 1,
          used_type: 4,
          equip_id: this.equipIdForAdd
        })
        this.loadingBtn = false
        // 查找匹配的配方
        if (this.currentRowMes && this.currentRowMes.recipe_name) {
          const _obj = rubberMateriaData.results.find(d => d.stage_product_batch_no === this.currentRowMes.recipe_name)
          if (_obj) {
            this.currentRowMes.product_batching = _obj.id
          } else {
            this.currentRowMes = null
            throw new Error('该胶料配方编码不存在')
          }
        }

        var classesdetail_set_ = workSchedule.classesdetail_set
        var init_class_plan = {
          plan_trains: 0,
          sn: 0,
          unit: '吨',
          time: '',
          weight: '',
          classes: null,
          enable: false
        }
        var pdp_product_classes_plan = [init_class_plan, init_class_plan, init_class_plan]
        for (var i = 0; i < 3; i++) {
          var enable = !!planSchedule.work_schedule_plan[i]
          var classes = enable ? classesdetail_set_[i].classes : null
          var class_plan = {
            plan_trains: 0,
            sn: 0,
            unit: '吨',
            time: enable ? 0 : '',
            weight: enable ? 0 : '',
            classes,
            enable
          }
          if (enable && planSchedule.work_schedule_plan[i].classes_name === '早班') {
            class_plan.plan_trains = this.classes_add === 0 && this.currentRowMes ? this.currentRowMes.plan_trains : 0
            pdp_product_classes_plan[0] = class_plan
          } else if (enable && planSchedule.work_schedule_plan[i].classes_name === '中班') {
            class_plan.plan_trains = this.classes_add === 1 && this.currentRowMes ? this.currentRowMes.plan_trains : 0
            pdp_product_classes_plan[1] = class_plan
          } else if (enable && planSchedule.work_schedule_plan[i].classes_name === '夜班') {
            class_plan.plan_trains = this.classes_add === 2 && this.currentRowMes ? this.currentRowMes.plan_trains : 0
            pdp_product_classes_plan[2] = class_plan
          }
        }

        var plan = {
          equip_: this.equipById[this.equipIdForAdd],
          equip: this.equipIdForAdd,
          plan_schedule: this.planScheduleId,
          pdp_product_classes_plan,
          day_time: planSchedule.day_time,
          work_schedule_name: planSchedule.work_schedule_name,
          planSchedule: planSchedule,
          isMes: this.currentRowMes ? this.currentRowMes.id : false,
          product_batch_no: this.currentRowMes ? this.currentRowMes.recipe_name : '',
          product_batching: this.currentRowMes ? this.currentRowMes.product_batching : ''
        }
        //
        if (this.version === 'v3') {
          rubberMateriaData.results.forEach((D, i) => {
            D.batching_weight = 0
            D.production_time_interval = 0
            D.stage_product_batch_no = D.recipe_number
            D.id = i
          })
        }

        this.$set(plan, 'productBatchings', rubberMateriaData.results)

        rubberMateriaData.results.forEach(batching => {
          this.productBatchingById[batching.id] = batching
        })
        if (this.equipFirstIndexInPlansForAdd() === -1) {
          this.plansForAdd.push(plan)
          var planForSum = JSON.parse(JSON.stringify(plan))
          planForSum['sum'] = true
          planForSum['equip_'].equip_no = '小计'
          planForSum['day_time'] = planForSum['work_schedule_name'] = planForSum['planSchedule'] = null
          this.plansForAdd.push(planForSum)
        } else {
          var lastIndex = this.equipLastIndexInPlansForAdd()
          this.plansForAdd.splice(lastIndex, 0, plan)
        }
        if (this.currentRowMes) {
          this.productBatchingChanged(plan)
        }
        this.currentRowMes = null
      } catch (e) {
        console.log(e, 'e')
        this.$message.error(e + ',添加失败')
        this.loadingBtn = false
      }
    },
    async addOnePlan1() {
      if (!this.equipIdForAdd || !this.day_time || !this.planScheduleId) {
        this.$alert('请选择机台和时间、排班规则', '错误', {
          confirmButtonText: '确定'
        })
        return
      }
      if (this.$refs.singleTable) {
        this.$refs.singleTable.setCurrentRow()
      }
      this.addPlanVisible1 = true
      try {
        const data = await schedulingResult({ factory_date: this.day_time, equip_no: this.equip_no })
        this.mesPlanList = data || []
      } catch (e) {
        //
      }
    },
    submitAddOnePlan() {
      if (!this.currentRowMes) {
        this.$message('请选择计划')
        return
      }
      if (this.currentRowMes.status === '已下发') {
        this.$confirm(this.currentRowMes.recipe_name + '规格的计划已经下发, 是否继续下发?', '提示', {
          confirmButtonText: 'Y',
          cancelButtonText: 'N',
          type: 'warning'
        }).then(() => {
          this.handleClose1(false)
          this.addOnePlan()
        }).catch(function() {

        })
      } else {
        this.handleClose1(false)
        this.addOnePlan()
      }
    },
    equipLastIndexInPlansForAdd() {
      for (var i = 0; i < this.plansForAdd.length; i++) {
        if (this.plansForAdd[i].equip_.id === this.equipIdForAdd) {
          var last = true
          for (var j = i + 1; j < this.plansForAdd.length; j++) {
            if (this.plansForAdd[j] === this.equipIdForAdd) { last = false }
          }
          if (last) { return i }
        }
      }
      return -1
    },
    equipFirstIndexInPlansForAdd() {
      for (var i = 0; i < this.plansForAdd.length; i++) {
        if (this.plansForAdd[i].equip_.id === this.equipIdForAdd) { return i }
      }
      return -1
    },
    productBatchingChanged(planForAdd) {
      planForAdd['batching_weight'] = this.productBatchingById[planForAdd.product_batching].batching_weight
      planForAdd['production_time_interval'] = this.productBatchingById[planForAdd.product_batching].production_time_interval
      planForAdd['product_batch_no'] = this.productBatchingById[planForAdd.product_batching].stage_product_batch_no
      if (this.version === 'v3') {
        planForAdd['product_version'] = this.productBatchingById[planForAdd.product_batching].recipe_version
      }
      planForAdd['_version'] = this.version

      for (var i = 0; i < 3; i++) {
        this.planTrainsChanged(planForAdd, i, false)
      }
      this.statistic()
    },
    planTrainsChanged(planForAdd, columnIndex, sum = true) {
      if (!planForAdd['pdp_product_classes_plan'][columnIndex].enable) { return }

      planForAdd['pdp_product_classes_plan'][columnIndex]['time'] =
                    (planForAdd['production_time_interval'] *
                        planForAdd['pdp_product_classes_plan'][columnIndex]['plan_trains']).toFixed(2)

      planForAdd['pdp_product_classes_plan'][columnIndex]['weight'] =
                    (planForAdd['batching_weight'] *
                        planForAdd['pdp_product_classes_plan'][columnIndex]['plan_trains']).toFixed(2)
      if (sum) { this.statistic() }
    },
    async statistic() {
      var plansByEquip = {}
      var planSumByEquipId = {}
      this.plansForAdd.forEach(plan => {
        if (!plan.sum) {
          if (!plansByEquip[plan.equip]) {
            plansByEquip[plan.equip] = []
          }
          plansByEquip[plan.equip].push(plan)
        } else {
          planSumByEquipId[plan.equip] = plan
        }
      })
      for (var equipId in plansByEquip) {
        var plans = plansByEquip[equipId]
        var batching_weight = 0
        var production_time_interval = 0
        var pdp_product_classes_plan = []
        for (var j = 0; j < 3; j++) {
          pdp_product_classes_plan.push({
            plan_trains: 0,
            weight: 0,
            time: 0
          })
        }
        for (var k = 0; k < plans.length; k++) {
          var plan = plans[k]
          batching_weight += Number(plan.batching_weight)
          production_time_interval += Number(plan.production_time_interval)
          for (var i = 0; i < 3; i++) {
            var class_plan = plan.pdp_product_classes_plan[i]
            pdp_product_classes_plan[i].plan_trains += Number(class_plan.plan_trains)
            pdp_product_classes_plan[i].weight += Number(class_plan.weight)
            pdp_product_classes_plan[i].time += Number(class_plan.time)
          }
        }
        batching_weight = batching_weight.toFixed(3)
        production_time_interval = production_time_interval.toFixed(2)
        planSumByEquipId[equipId].batching_weight = batching_weight
        planSumByEquipId[equipId].production_time_interval = production_time_interval
        planSumByEquipId[equipId].pdp_product_classes_plan = pdp_product_classes_plan
      }
    },
    deleteOnePlan(plan) {
      this.plansForAdd.splice(this.plansForAdd.indexOf(plan), 1)
      var plans = this.plansForAdd.filter(plan_ => {
        return plan_.equip === plan.equip
      })
      if (plans.length === 1 && plans[0].sum) {
        this.plansForAdd.splice(this.plansForAdd.indexOf(plans[0]), 1)
      }
      this.statistic()
    },
    handleClose(done) {
      this.$parent.getEquip()
      done()
    },
    handleClose1(done) {
      this.addPlanVisible1 = false
      if (done) {
        done()
      }
    },
    handleCurrentChange(val) {
      this.currentRowMes = val
    }
  }
}
</script>
