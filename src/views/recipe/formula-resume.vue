<template>
  <div>
    <!-- 配方变更履历 -->
    <el-form :inline="true">
      <el-form-item label="胶料名称">
        <el-input v-model="getParams.recipe_no" clearable @change="changeList" />
      </el-form-item>
      <el-form-item label="机台">
        <el-select v-model="getParams.equip_no" clearable placeholder="请选择" @change="changeList">
          <el-option
            v-for="item in SelectEquipOptions"
            :key="item.id"
            :label="item.equip_no"
            :value="item.equip_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="修改时间范围">
        <el-date-picker
          v-model="datePicker"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="配方状态">
        <el-select v-model="getParams.used_types" placeholder="请选择" clearable multiple @change="changeList">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      element-loading-background="transparent"
      :data="tableData"
      border
      :span-method="objectSpanMethod"
    >
      <el-table-column
        prop="recipe_no"
        label="胶料名称"
        fixed
      >
        <template slot-scope="{row,$index}">
          <div>
            <span v-if="row.recipe_no" @click="tableLoad($index,row)">
              <i v-if="row._show" class="el-icon-arrow-down" />
              <i v-if="!row._show" class="el-icon-arrow-up" />
            </span>
            {{ row.recipe_no }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="dev_type"
        label="机型"
        width="60"
        fixed
      />
      <el-table-column
        prop="equip_no"
        label="机台"
        width="60"
        fixed
      />
      <el-table-column
        prop="used_type"
        label="状态"
        width="60"
        fixed
        :formatter="usedTypeFormatter"
      />
      <el-table-column
        prop="created_time"
        label="创建时间"
        fixed
      />
      <el-table-column
        prop="created_username"
        label="创建人"
        fixed
      />
      <el-table-column
        prop="updated_username"
        label="修改人"
        fixed
      />
      <el-table-column
        prop="变更履历"
        label="变更履历"
        width="115"
        fixed
      />
      <el-table-column
        v-for="(item) in headNum"
        :key="item"
        :label="`变更${item}`"
      >
        <template slot-scope="{row}">
          <span
            v-if="row.change_desc&&row.change_desc[item-1]"
            v-html="row.change_desc[item-1].val"
          />
        </template>
      </el-table-column>
    </el-table>
    <page
      :total="total"
      :current-page.sync="getParams.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import { equip_url, recipeChangeHistory } from '@/api/recipe_fun'
import page from '@/components/page'
export default {
  name: 'FormulaResume',
  components: { page },
  data() {
    return {
      getParams: { used_types: [4] },
      datePicker: [],
      options: [{
        value: 1, label: '编辑'
      }, {
        value: 2, label: '提交'
      }, {
        value: 4, label: '启用'
      }, {
        value: 7, label: '停用'
      }, {
        value: 5, label: '驳回'
      }, {
        value: 6, label: '废弃'
      }
      ],
      tableData: [],
      total: 0,
      loading: false,
      SelectEquipOptions: [],
      headNum: 0,
      spanArr: [],
      pos: null
    }
  },
  created() {
    this.equip_list()
    this.getList()
  },
  mounted() {
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const obj = JSON.parse(JSON.stringify(this.getParams))
        obj.used_types = this.getParams.used_types ? this.getParams.used_types.join(',') : ''
        const data = await recipeChangeHistory('get', null, { params: obj })
        this.headNum = 0
        const arr = []
        if (data.results.length) {
          for (let i = 0; i < data.results.length; i++) {
            const D = data.results[i]
            if (D.change_desc.length > this.headNum) {
              this.headNum = D.change_desc.length
            }
            for (let index = 0; index < 2; index++) {
              const val = index === 0 ? '变更日期' : '变更内容'
              const arr1 = []
              D.change_desc.forEach(dd => {
                if (index === 0) {
                  arr1.push({
                    val: dd.changed_time__date
                  })
                }
                if (index === 1) {
                  arr1.push({
                    val: dd.desc
                  })
                }
              })
              arr.push({ ...D, change_desc: arr1, '变更履历': val, _id: D.id + val })
            }
          }
        }
        this.tableData = arr
        this.setData()
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    setData() {
      this.spanArr = []
      this.pos = null
      if (this.tableData.length) {
        for (let i = 0; i < this.tableData.length; i++) {
          if (i === 0) {
            // 如果是第一条记录（即索引是0的时候），向数组中加入１
            this.spanArr.push(1)
            this.pos = 0
          } else {
            if (this.tableData[i].recipe_no && this.tableData[i].recipe_no === this.tableData[i - 1].recipe_no && this.tableData[i].equip_no === this.tableData[i - 1].equip_no) {
              // 如果a相等就累加，并且push 0  这里是根据一样的a匹配
              this.spanArr[this.pos] += 1
              this.spanArr.push(0)
            } else {
              // 不相等push 1
              this.spanArr.push(1)
              this.pos = i
            }
          }
        }
      }
    },
    async equip_list() {
      try {
        const equip_list = await equip_url('get', {
          params: {}
        })
        this.SelectEquipOptions = equip_list.results
      } catch (e) {
        //
      }
    },
    changeList() {
      this.getParams.st = this.datePicker ? this.datePicker[0] : ''
      this.getParams.et = this.datePicker ? this.datePicker[1] : ''
      this.getParams.page = 1
      this.getList()
    },
    currentChange(page) {
      this.getParams.page = page
      this.getList()
    },
    async tableLoad(_index, row) {
      row._show = !row._show
      row._childNum = 5
      let current_index = _index
      if (row._show) {
        this.tableData = this.tableData.filter((d, _i) => {
          if (_index !== _i) {
            if (d._show) {
              if (_i < current_index) {
                current_index = current_index - 5
              }
            }
            d._show = false
          }
          return !d._listShow
        })
        try {
          const data = await recipeChangeHistory('get', row.id)
          const resumeName = ['配方配料', '工艺参数', '密炼步序', '新增/修改 人', '新增/修改 时间']
          const resumeList = []
          resumeName.forEach((d, i) => {
            resumeList[i] = {
              '变更履历': d,
              change_desc: [],
              _listShow: true
            }
          })
          for (let index = 0; index < data.change_details.length; index++) {
            const d = data.change_details[index]
            const object = d.details ? JSON.parse(d.details) : {}
            let str1 = '<span style="font-weight: 700;">胶料</span>：<br>'
            let str2 = '<span style="font-weight: 700;">炭黑</span>：<br>'
            let str3 = '<span style="font-weight: 700;">油料</span>：<br>'
            let strGY = ''
            let strBX = ''
            for (const key in object) {
              if (Object.hasOwnProperty.call(object, key)) {
                const element = object[key]
                element.forEach(dd => {
                  if (Number(key) === 1) {
                    if (dd.type === 1) {
                      str1 = this.seta(dd, str1)
                    }
                    if (dd.type === 2) {
                      str2 = this.seta(dd, str2)
                    }
                    if (dd.type === 3) {
                      str3 = this.seta(dd, str3)
                    }
                  }
                  if (Number(key) === 2) {
                    strGY = this.seta(dd, strGY, 2)
                  }
                  if (Number(key) === 3) {
                    strBX = this.seta(dd, strBX, 3)
                  }
                })
              }
            }
            if (index === 0) {
              resumeList[0].change_desc[index] = { val: '新增' }
              resumeList[1].change_desc[index] = { val: '新增' }
              resumeList[2].change_desc[index] = { val: '新增' }
            } else {
              resumeList[0].change_desc[index] = { val: str1 + '<br>' + str2 + '<br>' + str3 }
              resumeList[1].change_desc[index] = { val: strGY }
              resumeList[2].change_desc[index] = { val: strBX }
            }
            resumeList[3].change_desc[index] = { val: d.changed_username }
            resumeList[4].change_desc[index] = { val: d.changed_time }
          }
          this.tableData.splice(current_index + 2, 0, ...resumeList)
        } catch (e) {
        //
        }
      } else {
        this.tableData.splice(current_index + 2, row._childNum)
      }
      this.loading = true
      setTimeout(d => {
        this.setData()
        this.loading = false
      })
    },
    seta(dd, jiaoliao, type) {
      if (dd.flag === '新增') {
        jiaoliao += `${dd.flag}: ${dd.key}(${dd.cv}kg)<br>`
      }
      if (dd.flag === '删除') {
        jiaoliao += `${dd.flag}: ${dd.key}<br>`
      }
      if (dd.flag === '修改') {
        if (type === 3) {
          jiaoliao += `${dd.key}<br>`
        } else if (type === 2) {
          jiaoliao += `${dd.key}(${dd.pv}→${dd.cv})<br>`
        } else if (dd.pv || dd.pv === 0) {
          jiaoliao += `${dd.flag}: ${dd.key}(${dd.pv}→${dd.cv})<br>`
        } else {
          jiaoliao += `${dd.flag}: ${dd.key}<br>`
        }
      }
      return jiaoliao
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex < 7 && this.spanArr) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
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
        case 7:
          return '停用'
        case 6:
          return '废弃'
      }
    }
  }
}

</script>

<style>

</style>
