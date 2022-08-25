<template>
  <div>
    <br>
    <el-form :inline="true">
      <el-form-item label="机台">
        <el-input v-model="equip_name" size="mini" :disabled="true" style="width: 120px" />
      </el-form-item>
      <el-form-item label="机型名称">
        <el-input v-model="category__category_name" size="mini" :disabled="true" style="width: 120px" />
      </el-form-item>
      <el-form-item label="胶料配方编码">
        <el-input v-model="stage_product_batch_no" size="mini" :disabled="true" style="width: 160px" />
      </el-form-item>
      <el-form-item label="胶料名称">
        <el-input v-model="product_name" size="mini" :disabled="true" style="width: 120px" />
      </el-form-item>
      <el-form-item label="预计炼胶时间">
        <el-input v-model="production_time_interval" :disabled="true" size="mini" style="width: 120px" />
      </el-form-item>

      <el-form-item style="float: right">
        <el-button @click="recipe_return_list">返回</el-button>
      </el-form-item>

    </el-form>

    <el-form :inline="true">
      <br>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <el-form-item label="超温最短时间">
              <el-input v-model="mini_time" size="mini" :disabled="true" style="width: 70px" />
            </el-form-item>
            <el-form-item label="进胶最低温度">
              <el-input v-model="mini_temp" size="mini" :disabled="true" style="width: 70px" />
            </el-form-item>
            <el-form-item label="超温温度">
              <el-input v-model="over_temp" size="mini" :disabled="true" style="width: 70px" />
            </el-form-item>
            <el-form-item label="胶料总误差">
              <el-input v-model="batching_error" size="mini" :disabled="true" style="width: 70px" />
            </el-form-item>
            <el-form-item label="转子水温">
              <el-input v-model="zz_temp" size="mini" :disabled="true" style="width: 70px" />
            </el-form-item>
            <el-form-item label="卸料门水温">
              <el-input v-model="xlm_temp" size="mini" :disabled="true" style="width: 70px" />
            </el-form-item>
            <el-form-item label="侧壁水温">
              <el-input v-model="cb_temp" size="mini" :disabled="true" style="width: 70px" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="0">
          <div class="grid-content bg-purple" />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="grid-content bg-purple">

            <el-form-item label="炼胶超时时间">
              <el-input v-model="over_time" size="mini" :disabled="true" style="width: 70px" />
            </el-form-item>
            <el-form-item label="进胶最高温度">
              <el-input v-model="max_temp" size="mini" :disabled="true" style="width: 70px" />
            </el-form-item>
            <el-form-item v-show="reuse_flag" label="回收时间">
              <el-input v-model="reuse_time" size="mini" :disabled="true" style="width: 70px" />
            </el-form-item>
            <el-form-item label="是否回收">
              <template>
                <el-radio v-show="reuse_flag" v-model="reuse_flag" :label="true">是</el-radio>
                <el-radio v-show="!reuse_flag" v-model="reuse_flag" :label="false">否</el-radio>
              </template>
            </el-form-item>
            <el-form-item label=" ">
              <el-radio v-show="temp_use_flag" v-model="temp_use_flag" :label="true">三区水温启动</el-radio>
              <el-radio v-show="!temp_use_flag" v-model="temp_use_flag" :label="false">三区水温停用</el-radio>
            </el-form-item>
            <el-form-item label="收皮">
              <el-input v-model="sp_num" size="mini" :disabled="true" style="width: 70px" />
            </el-form-item>
            <el-form-item label="车/托" />
            <el-form-item v-if="category__category_name==='GK255'" label="成环时间">
              <el-input v-model="ch_time" size="mini" :disabled="true" style="width: 70px" />
            </el-form-item>
            <el-form-item v-if="category__category_name==='GK255'" label="捣胶时间">
              <el-input v-model="dj_time" size="mini" :disabled="true" style="width: 70px" />
            </el-form-item>
            <el-form-item v-if="category__category_name==='GK255'" label="拉断时间">
              <el-input v-model="ld_time" size="mini" :disabled="true" style="width: 70px" />
            </el-form-item>
            <el-form-item v-if="category__category_name==='GK255'" label="是否启用">
              <el-checkbox v-model="use_flag" :disabled="true" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="0">
          <div class="grid-content bg-purple" />
        </el-col>
      </el-row>
    </el-form>

    <br>
    <el-row :gutter="20">
      <el-col :span="9">
        <div class="grid-content bg-purple">
          <span class="font_custom">胶料称量</span>
          <el-table
            highlight-current-row
            :data="rubber_tableData"
            border
            style="width: 100%"
          >
            <el-table-column align="center" width="50%" prop="sn" label="序号" />
            <!-- <el-table-column width="80%" prop="auto_flag" label="自动与否" /> -->
            <el-table-column align="center" prop="material_name" label="胶料名称" />
            <el-table-column align="center" width="90%" prop="actual_weight" label="设定值(kg)" />
            <el-table-column align="center" width="90%" prop="standard_error" label="误差值(kg)" />
          </el-table>
          <span class="font_custom">炭黑称量</span>
          <el-table
            highlight-current-row
            :data="carbon_tableData"
            border
            style="width: 100%"
          >
            <el-table-column align="center" width="50%" prop="sn" label="序号" />
            <el-table-column align="center" width="60%" prop="action_name" label="动作">投料</el-table-column>
            <!-- <el-table-column prop="auto_flag" label="自动与否" /> -->
            <el-table-column align="center" prop="material_name" label="炭黑名称">
              <template slot-scope="{row}">
                {{ row.material_name }} ({{ row.tank_no }}号罐)
              </template>
            </el-table-column>
            <el-table-column align="center" width="90%" label="产地">
              <template slot-scope="{row}">
                {{ row.provenance?row.provenance:'' }}
              </template>
            </el-table-column>
            <el-table-column align="center" width="90%" prop="actual_weight" label="设定值(kg)" />
            <el-table-column align="center" width="90%" prop="standard_error" label="误差值(kg)" />
          </el-table>
          <span class="font_custom">{{ equip_no==='Z07'?'油料称量1':'油料称量' }}</span>
          <el-table
            highlight-current-row
            :data="oil_tableData"
            border
            style="width: 100%"
          >
            <el-table-column align="center" width="50%" prop="sn" label="序号" />
            <el-table-column align="center" width="60%" prop="action_name" label="动作">投料</el-table-column>
            <!-- <el-table-column prop="auto_flag" label="自动与否" /> -->
            <el-table-column align="center" prop="material_name" label="油脂名称">
              <template slot-scope="{row}">
                {{ row.material_name }} ({{ row.tank_no }}号罐)
              </template>
            </el-table-column>
            <el-table-column align="center" width="90%" label="产地">
              <template slot-scope="{row}">
                {{ row.provenance?row.provenance:'' }}
              </template>
            </el-table-column>
            <el-table-column align="center" width="90%" prop="actual_weight" label="设定值(kg)" />
            <el-table-column align="center" width="90%" prop="standard_error" label="误差值(kg)" />

          </el-table>
          <span v-if="equip_no==='Z07'" class="font_custom">油料称量2</span>
          <el-table
            v-if="equip_no==='Z07'"
            highlight-current-row
            :data="oil_tableData1"
            border
            style="width: 100%"
          >
            <el-table-column align="center" width="50%" prop="sn" label="序号" />
            <el-table-column align="center" width="60%" prop="action_name" label="动作">投料</el-table-column>
            <!-- <el-table-column prop="auto_flag" label="自动与否" /> -->
            <el-table-column align="center" prop="material_name" label="油脂名称">
              <template slot-scope="{row}">
                {{ row.material_name }} ({{ row.tank_no }}号罐)
              </template>
            </el-table-column>
            <el-table-column align="center" width="90%" label="产地">
              <template slot-scope="{row}">
                {{ row.provenance?row.provenance:'' }}
              </template>
            </el-table-column>
            <el-table-column align="center" width="90%" prop="actual_weight" label="设定值(kg)" />
            <el-table-column align="center" width="90%" prop="standard_error" label="误差值(kg)" />
          </el-table>
        </div>
      </el-col>

      <el-col :span="15">
        <div class="grid-content bg-purple">
          <span class="font_custom">密炼规程</span>
          <el-table
            highlight-current-row
            :data="process_step_tableData"
            border
            style="width: 100%"
          >
            <el-table-column align="center" width="50%" prop="sn" label="序号" />
            <el-table-column align="center" prop="condition_name" label="条件" />
            <el-table-column align="center" width="60%" prop="time" label="时间" />
            <el-table-column align="center" width="60%" prop="temperature" label="温度" />
            <el-table-column align="center" width="60%" prop="energy" label="能量" />
            <el-table-column align="center" width="60%" prop="power" label="AI值" />
            <el-table-column align="center" width="148%" prop="action_name" label="动作" />
            <el-table-column align="center" width="60%" prop="pressure" label="压力" />
            <el-table-column align="center" width="60%" prop="rpm" label="转速" />

          </el-table>
        </div></el-col>
    </el-row>

  </div>
</template>

<script>
import { recipe_list, rubber_process_url } from '@/api/recipe_fun'
// import { constantRoutes } from '@/router'
// import { dataTool } from 'echarts/lib/echarts'

export default {
  data: function() {
    return {
      // 机台、配方编号、配方名称
      equip_name: null,
      equip_no: null,
      category__category_name: null,
      stage_product_batch_no: null,
      product_name: null,
      production_time_interval: null,
      // 超温最短时间、进胶最低温度...
      mini_time: undefined,
      mini_temp: undefined,
      over_temp: undefined,
      batching_error: undefined,
      zz_temp: undefined,
      xlm_temp: undefined,
      cb_temp: undefined,
      // 炼胶超时时间、进胶最高温度...
      over_time: undefined,
      max_temp: undefined,
      reuse_time: undefined,
      reuse_flag: true,
      temp_use_flag: true,
      sp_num: undefined,
      ch_time: undefined,
      dj_time: undefined,
      ld_time: undefined,
      use_flag: false,
      rubber_tableData: [],
      carbon_tableData: [],
      oil_tableData: [],
      process_step_tableData: [],
      oil_tableData1: []
    }
  },
  created() {
    //   rubber_process_url
    // console.log('====================')
    // console.log(this.$route.params)
    // 配方详情界面的三个表格的原材料展示接口访问
    this.recipe_material_list(this.$route.params['id'])
    // 配方详情界面的配方信息和密炼步序信息接口访问(已废弃)
    // this.recipe_process_step_list(this.$route.params['id'], this.$route.params['equip'])
  },
  methods: {

    async recipe_material_list(id) {
      try {
        const recipe_listData = await recipe_list('get', id, {
          params: { }
        })
        // 机台、配方编号、配方名称
        this.equip_name = this.$route.params['equip_name']
        this.equip_no = recipe_listData.equip_no
        this.category__category_name = recipe_listData.category__category_name
        this.stage_product_batch_no = this.$route.params['stage_product_batch_no']
        this.product_name = this.$route.params['product_name']
        this.production_time_interval = this.$route.params['production_time_interval']
        for (var j = 0; j < recipe_listData['batching_details'].length; ++j) {
          var v_auto_falg = ''
          if (recipe_listData['batching_details'][j]['auto_flag'] === 1) {
            v_auto_falg = '自动'
          } else if (recipe_listData['batching_details'][j]['auto_flag'] === 2) {
            v_auto_falg = '手动'
          } else {
            v_auto_falg = '其他'
          }
          if (recipe_listData['batching_details'][j]['type'] === 2) {
            this.carbon_tableData.push({
              sn: recipe_listData['batching_details'][j]['sn'],
              auto_flag: v_auto_falg,
              material_name: recipe_listData['batching_details'][j]['material_name'],
              actual_weight: recipe_listData['batching_details'][j]['actual_weight'],
              standard_error: recipe_listData['batching_details'][j]['standard_error'],
              provenance: recipe_listData['batching_details'][j]['provenance'],
              tank_no: recipe_listData['batching_details'][j]['tank_no']
            })
          } else if (recipe_listData['batching_details'][j]['type'] === 3) {
            this.oil_tableData.push({
              sn: recipe_listData['batching_details'][j]['sn'],
              action_name: '投料',
              auto_flag: v_auto_falg,
              material_name: recipe_listData['batching_details'][j]['material_name'],
              actual_weight: recipe_listData['batching_details'][j]['actual_weight'],
              standard_error: recipe_listData['batching_details'][j]['standard_error'],
              provenance: recipe_listData['batching_details'][j]['provenance'],
              tank_no: recipe_listData['batching_details'][j]['tank_no'],
              line_no: recipe_listData['batching_details'][j]['line_no']
            })
          } else {
            this.rubber_tableData.push({
              sn: recipe_listData['batching_details'][j]['sn'],
              action_name: '投料',
              auto_flag: v_auto_falg,
              material_name: recipe_listData['batching_details'][j]['material_name'],
              actual_weight: recipe_listData['batching_details'][j]['actual_weight'],
              standard_error: recipe_listData['batching_details'][j]['standard_error']
            })
          }
        }
        this.carbon_tableData = this.carbon_tableData.sort(this.compareSn)
        this.rubber_tableData = this.rubber_tableData.sort(this.compareSn)
        // 超温最短时间、进胶最低温度...
        this.mini_time = (recipe_listData['processes']['mini_time'])
        this.mini_temp = (recipe_listData['processes']['mini_temp'])
        this.over_temp = (recipe_listData['processes']['over_temp'])
        this.batching_error = this.batching_error_conversion(recipe_listData['processes']['batching_error'])
        this.zz_temp = (recipe_listData['processes']['zz_temp'])
        this.xlm_temp = (recipe_listData['processes']['xlm_temp'])
        this.cb_temp = (recipe_listData['processes']['cb_temp'])
        // 炼胶超时时间、进胶最高温度...
        this.over_time = (recipe_listData['processes']['over_time'])
        this.max_temp = (recipe_listData['processes']['max_temp'])
        this.reuse_time = (recipe_listData['processes']['reuse_time'])
        this.reuse_flag = recipe_listData['processes']['reuse_flag']
        this.temp_use_flag = recipe_listData['processes']['temp_use_flag']
        this.sp_num = recipe_listData['processes']['sp_num']
        this.ch_time = recipe_listData['processes']['ch_time']
        this.dj_time = recipe_listData['processes']['dj_time']
        this.ld_time = recipe_listData['processes']['ld_time']
        this.use_flag = recipe_listData['processes']['use_flag']
        for (var i = 0; i < recipe_listData['process_details'].length; ++i) {
          this.process_step_tableData.push({
            sn: recipe_listData['process_details'][i]['sn'],
            condition: recipe_listData['process_details'][i]['condition'],
            time: this.step_type_conversion(recipe_listData['process_details'][i]['time']),
            temperature: this.step_type_conversion(recipe_listData['process_details'][i]['temperature']),
            energy: this.step_type_conversion(recipe_listData['process_details'][i]['energy']),
            power: this.step_type_conversion(recipe_listData['process_details'][i]['power']),
            action: recipe_listData['process_details'][i]['action'],
            pressure: this.step_type_conversion(recipe_listData['process_details'][i]['pressure']),
            rpm: this.step_type_conversion(recipe_listData['process_details'][i]['rpm']),
            action_name: recipe_listData['process_details'][i]['action_name'],
            condition_name: recipe_listData['process_details'][i]['condition_name']
          })
        }
        this.process_step_tableData = this.process_step_tableData.sort(this.compareSn)

        if (this.equip_no === 'Z07') {
          this.oil_tableData1 = this.oil_tableData.filter(d => d.line_no === 2)
          this.oil_tableData = this.oil_tableData.filter(d => d.line_no === 1 || !d.line_no)
          return
        }
        this.oil_tableData = this.oil_tableData.sort(this.compareSn)
        this.oil_tableData1 = this.oil_tableData1.sort(this.compareSn)
      } catch (e) { e }
    },
    compareSn(o1, o2) {
      return Number(o1.sn) - Number(o2.sn)
    },
    step_type_conversion: function(param) {
      if (typeof (param) === 'object') {
        return undefined
      } else if (Number(param) === 0) {
        return undefined
      } else { return param }
    },
    batching_error_conversion: function(param) {
      if (typeof (param) === 'object') {
        return undefined
      } else {
        return Number(param).toFixed(0)
      }
    },
    async recipe_process_step_list(id, equip) {
      try {
        const process_step_listData = await rubber_process_url('get', null, {
          params: { product_batching: id, equip: equip }
        })
        // 超温最短时间、进胶最低温度...
        this.mini_time = process_step_listData.results[0]['mini_time']
        this.mini_temp = process_step_listData.results[0]['mini_temp']
        this.over_temp = process_step_listData.results[0]['over_temp']
        this.batching_error = process_step_listData.results[0]['batching_error']
        this.zz_temp = process_step_listData.results[0]['zz_temp']
        this.xlm_temp = process_step_listData.results[0]['xlm_temp']
        this.cb_temp = process_step_listData.results[0]['cb_temp']
        // 炼胶超时时间、进胶最高温度...
        this.over_time = process_step_listData.results[0]['over_time']
        this.max_temp = process_step_listData.results[0]['max_temp']
        this.reuse_time = process_step_listData.results[0]['reuse_time']
        this.reuse_flag = process_step_listData.results[0]['reuse_flag']
        this.temp_use_flag = process_step_listData.results[0]['temp_use_flag']
        this.sp_num = process_step_listData.results[0]['sp_num']
        this.use_flag = process_step_listData.results[0]['use_flag']
        // console.log('====================2222')
        // console.log(process_step_listData.results)
        // console.log('====================2222')
        for (var i = 0; i < process_step_listData.results[0]['process_details'].length; ++i) {
          // console.log('====================333333')
          // console.log(process_step_listData.results[0]['process_details'][i])
          this.process_step_tableData.push({
            sn: this.process_step_tableData.length + 1,
            condition_name: process_step_listData.results[0]['process_details'][i]['condition_name'],
            time: process_step_listData.results[0]['process_details'][i]['time'],
            temperature: process_step_listData.results[0]['process_details'][i]['temperature'],
            energy: process_step_listData.results[0]['process_details'][i]['energy'],
            power: process_step_listData.results[0]['process_details'][i]['power'],
            action_name: process_step_listData.results[0]['process_details'][i]['action_name'],
            pressure: process_step_listData.results[0]['process_details'][i]['pressure'],
            rpm: process_step_listData.results[0]['process_details'][i]['rpm']
          })
        }
      } catch (e) { e }
    },
    recipe_return_list: function() {
      this.$router.push({ name: 'RecipeList', params: { currentPage: this.$route.params.currentPage }})
    },
    sp_numFormatter: function() {
      return this.sp_numChoice(this.sp_num)
    },
    sp_numChoice: function(sp_num_ele) {
      switch (sp_num_ele) {
        case 1:
          return '1'
        case 2:
          return '2'
        case 3:
          return '3'
        case 4:
          return '4'
        case 5:
          return '5'
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.font_custom{
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    font-weight: 700;
}
</style>
