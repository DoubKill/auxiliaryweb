<template>
  <div class="recipe_create">
    <el-form ref="generateRecipeForm" :inline="true" :model="generateRecipeForm" :rules="rules">
      <el-row>
        <el-col :span="6">
          <el-form-item label="机台" prop="SelectEquip">
            <el-select
              v-model="generateRecipeForm.SelectEquip"
              size="mini"
              style="width: 100px"
              clearable
              placeholder="请选择"
              :disabled="select_recipe_component"
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
          <el-form-item label="机型名称">
            <el-input v-model="category__category_name" size="mini" :disabled="true" style="width: 100px" />
          </el-form-item>
          <el-form-item label="预计炼胶时间">
            <el-input-number v-model="production_time_interval" :step="1" step-strictly :min="0" controls-position="right" size="mini" style="width: 90px" />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-row>
            <el-form-item>
              <el-radio v-model="normalReceipe" :label="true" @change="receipeTypeChange">
                常规配方
              </el-radio>
            </el-form-item>
            <el-form-item label="产地" prop="SelectSite">
              <el-select
                v-model="generateRecipeForm.SelectSite"
                size="mini"
                style="width: 100px"
                clearable
                placeholder="请选择"
                :disabled="select_recipe_component || !normalReceipe"
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
            <el-form-item label="SITE" prop="SelectSITE">
              <el-select
                v-model="generateRecipeForm.SelectSITE"
                size="mini"
                style="width: 100px"
                clearable
                placeholder="请选择"
                :disabled="select_recipe_component || !normalReceipe"
                @change="generateRecipeName"
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

            <el-form-item label="段次" prop="SelectStage">
              <el-select
                v-model="generateRecipeForm.SelectStage"
                size="mini"
                style="width: 100px"
                clearable
                placeholder="请选择"
                :disabled="select_recipe_component || !normalReceipe"
                @change="generateRecipeName"
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

            <el-form-item label="胶料编码" prop="SelectRecipeNo">
              <el-select
                v-model="generateRecipeForm.SelectRecipeNo"
                filterable
                size="mini"
                style="width: 100px"
                clearable
                placeholder="请选择"
                :disabled="select_recipe_component || !normalReceipe"
                @change="generateRecipeName"
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

            <el-form-item label="版本" prop="version">
              <el-input v-model="generateRecipeForm.version" :disabled="select_recipe_component || !normalReceipe" style="width: 90px" size="mini" placeholder="版本" @change="generateRecipeName" />
            </el-form-item>
            <el-form-item label="方案">
              <el-input v-model="generateRecipeForm.scheme" :disabled="select_recipe_component || !normalReceipe" style="width: 90px" size="mini" placeholder="方案" />
            </el-form-item>
            <!-- <el-form-item>
              <el-button :disabled="select_recipe_component" size="mini" type="primary" @click="generateMaterialButton('generateRecipeForm')">配料</el-button>
            </el-form-item> -->
          </el-row>
          <el-row>
            <el-form-item>
              <el-radio v-model="normalReceipe" :label="false" @change="receipeTypeChange">
                特殊配方
              </el-radio>
            </el-form-item>
            <el-form-item v-show="!normalReceipe" label="配方编号" prop="stage_product_batch_no">
              <el-input v-model="generateRecipeForm.stage_product_batch_no" maxlength="19" size="mini" :disabled="normalReceipe" @input="recipeNameChange" />
            </el-form-item>
            <el-form-item v-show="normalReceipe" label="配方编号" required>
              <el-input :disabled="true" size="mini" />
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>

    </el-form>

    <br>
    <el-form :inline="true">
      <el-form-item label="机台">
        <el-input v-model="equip" size="mini" :disabled="true" style="width: 100%" />
      </el-form-item>
      <el-form-item label="配方编号">
        <el-input v-model="stage_product_batch_no" size="mini" :disabled="true" style="width: 100%" />
      </el-form-item>
      <el-form-item v-show="false" label="配方id">
        <el-input v-model="product_batching" size="mini" :disabled="true" style="width: 100%" />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button @click="recipe_return_list">返回</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button @click="AddRecipeInfoStep">保存退出</el-button>
      </el-form-item>
    </el-form>

    <el-form :inline="true">
      <br>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <el-form-item label="超温最短时间">
              <el-input-number v-model="mini_time" :step="1" step-strictly :min="0" controls-position="right" size="mini" style="width: 70px" />
            </el-form-item>
            <el-form-item label="进胶最低温度">
              <el-input-number v-model="mini_temp" :step="1" step-strictly :min="0" controls-position="right" size="mini" style="width: 70px" />
            </el-form-item>
            <el-form-item label="超温温度">
              <el-input-number v-model="over_temp" :step="1" step-strictly :min="0" controls-position="right" size="mini" style="width: 70px" />
            </el-form-item>
            <el-form-item label="胶料总误差">
              <el-input-number
                v-model="batching_error"
                :step="1"
                :min="0"
                step-strictly
                controls-position="right"
                size="mini"
                style="width: 70px"
              />
            </el-form-item>
            <el-form-item label="转子水温">
              <el-input-number v-model="zz_temp" :step="1" step-strictly :min="0" controls-position="right" size="mini" style="width: 70px" />
            </el-form-item>
            <el-form-item label="卸料门水温">
              <el-input-number v-model="xlm_temp" :step="1" step-strictly :min="0" controls-position="right" size="mini" style="width: 70px" />
            </el-form-item>
            <el-form-item label="侧壁水温">
              <el-input-number v-model="cb_temp" :step="1" step-strictly :min="0" controls-position="right" size="mini" style="width: 70px" />
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
              <el-input-number v-model="over_time" :step="1" step-strictly :min="0" controls-position="right" size="mini" style="width: 70px" />
            </el-form-item>
            <el-form-item label="进胶最高温度">
              <el-input-number v-model="max_temp" :step="1" step-strictly :min="0" controls-position="right" size="mini" style="width: 70px" />
            </el-form-item>
            <el-form-item v-show="reuse_flag" label="回收时间">
              <el-input-number v-model="reuse_time" :step="1" step-strictly :min="0" controls-position="right" size="mini" style="width: 70px" />
            </el-form-item>
            <el-form-item label="是否回收">
              <template>
                <el-radio v-model="reuse_flag" :label="true">是</el-radio>
                <el-radio v-model="reuse_flag" :label="false">否</el-radio>
              </template>
            </el-form-item>
            <el-form-item label=" ">
              <el-radio v-model="temp_use_flag" :label="true">三区水温启动</el-radio>
              <el-radio v-model="temp_use_flag" :label="false">三区水温停用</el-radio>
            </el-form-item>
            <el-form-item label="收皮" prop="SelectEquip">
              <el-input-number
                v-model="sp_num"
                :max="99"
                controls-position="right"
                size="mini"
                style="width: 70px"
                :precision="1"
                :step="0.1"
              />
              <!-- <el-select v-model="sp_num" size="mini" style="width: 85px" placeholder="请选择">
                <el-option
                  v-for="item in sp_num_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select> -->
            </el-form-item>
            <el-form-item label="车/托" />
            <el-form-item v-show="false" label="配方停用">
              <el-checkbox v-model="use_flag" />
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
            <!-- <el-table-column prop="auto_flag" label="自动与否" /> -->
            <el-table-column align="center" width="230" prop="material_name" label="胶料名称">
              <template slot-scope="scope">
                <el-input v-model="scope.row.material_name" size="mini" class="input-with-select" :disabled="true">
                  <el-button slot="append" icon="el-icon-search" @click="selectMaterial(scope.row)" />
                </el-input>
              </template>
            </el-table-column>
            <el-table-column align="center" label="设定值(kg)">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.actual_weight" style="width: 70px" :precision="2" :step="0.1" :min="0.00" size="mini" :controls="false" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="误差值(kg)">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.standard_error" style="width: 70px" :precision="2" :step="0.1" :min="0" size="mini" :controls="false" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="removeRubberRow(scope.row)">删除</el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" width="50%" prop="sn" label="序号" /> -->
            <!-- <el-table-column prop="auto_flag" label="自动与否" /> -->
            <!-- <el-table-column align="center" prop="material_name" label="胶料名称" /> -->
            <!-- <el-table-column align="center" width="90%" :precision="2" :step="0.1" :min="0.00" prop="actual_weight" label="设定值(kg)" /> -->
            <!-- <el-table-column align="center" width="90%" :precision="2" :step="0.1" :min="0" prop="standard_error" label="误差值(kg)" /> -->
          </el-table>
          <el-form>
            <el-form-item style="text-align: center">
              <div>序号<el-input-number v-model="rubberSnForInsert" :min="1" style="margin-right: 6px;margin-left: 6px;" size="mini" :controls="false" />
                <el-button size="mini" :disabled="!insertRubberEnbale()" @click="insertBeforeSnOneRubber">前插入一行</el-button>
              </div>
              <el-button size="mini" @click="insertOneRubber">插入一行</el-button>
            </el-form-item>
          </el-form>
          <span class="font_custom">炭黑称量</span>
          <el-table
            highlight-current-row
            :data="carbon_tableData"
            border
            style="width: 100%"
          >
            <el-table-column align="center" width="40" prop="sn" label="序号" />
            <el-table-column align="center" prop="action_name" label="动作">投料</el-table-column>
            <!-- <el-table-column prop="auto_flag" label="自动与否" /> -->
            <el-table-column width="250" align="center" label="炭黑名称">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row._index"
                  style="width: 220px"
                  @change="materialChange($event,scope.$index,tankCarbons,carbon_tableData)"
                >
                  <el-option
                    v-for="(item,index) in tankCarbons"
                    :key="index"
                    :label="item.label"
                    :value="index"
                  >
                    <span>{{ item.tank_name }}</span>&nbsp;
                    <span>{{ item.material_name }}</span>
                    <!-- <span v-if="item.provenance" style="display:block;margin-top: -10px;">{{ item.provenance }}</span> -->
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="center" width="95" label="产地">
              <template slot-scope="scope">
                {{ scope.row.provenance?scope.row.provenance:'--' }}
              </template>
            </el-table-column>
            <el-table-column align="center" width="95" label="设定值(kg)">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.actual_weight" :precision="2" :step="0.1" :min="0.00" style="width: 70px" size="mini" :controls="false" />
              </template>
            </el-table-column>
            <el-table-column align="center" width="95" label="误差值(kg)">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.standard_error" :precision="2" :step="0.1" :min="0" style="width: 70px" size="mini" :controls="false" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="removeCarbonRow(scope.row)">删除</el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" width="50%" prop="sn" label="序号" /> -->
            <!-- <el-table-column align="center" width="60%" prop="action_name" label="动作">投料</el-table-column> -->
            <!-- <el-table-column prop="auto_flag" label="自动与否" /> -->
            <!-- <el-table-column align="center" prop="material_name" label="炭黑名称" /> -->
            <!-- <el-table-column align="center" width="90%" :precision="2" :step="0.1" :min="0.00" prop="actual_weight" label="设定值(kg)" /> -->
            <!-- <el-table-column align="center" width="90%" :precision="2" :step="0.1" :min="0" prop="standard_error" label="误差值(kg)" /> -->
          </el-table>
          <el-form>
            <el-form-item style="text-align: center">
              <div>序号<el-input-number v-model="carbonSnForInsert" :min="1" style="margin-right: 6px;margin-left: 6px;" size="mini" :controls="false" />
                <el-button size="mini" :disabled="!insertCarbonEnbale()" @click="insertBeforeSnOneCarbon">前插入一行</el-button>
              </div>
              <el-button size="mini" @click="insertOnecarbon">插入一行</el-button>
            </el-form-item>
          </el-form>
          <span class="font_custom">油料称量</span>
          <el-table
            highlight-current-row
            :data="oil_tableData"
            border
            style="width: 100%"
          >
            <el-table-column align="center" width="40" prop="sn" label="序号" />
            <el-table-column align="center" prop="action_name" label="动作">投料</el-table-column>
            <!-- <el-table-column prop="auto_flag" label="自动与否" /> -->
            <el-table-column width="250" align="center" label="油脂名称">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row._index"
                  style="width: 220px"
                  class="setOption"
                  @change="materialChange($event,scope.$index,tankOils,oil_tableData)"
                >
                  <el-option
                    v-for="(item,index) in tankOils"
                    :key="index"
                    :label="item.label"
                    :value="index"
                  >
                    <span>{{ item.tank_name }}</span>&nbsp;
                    <span>{{ item.material_name }}</span>
                    <!-- <span v-if="item.provenance" style="display:block;margin-top: -10px;">{{ item.provenance }}</span> -->
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="center" width="95" label="产地">
              <template slot-scope="scope">
                {{ scope.row.provenance?scope.row.provenance:'--' }}
              </template>
            </el-table-column>
            <el-table-column align="center" width="95" label="设定值(kg)">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.actual_weight" :precision="2" :step="0.1" :min="0.00" style="width: 70px" size="mini" :controls="false" />
              </template>
            </el-table-column>
            <el-table-column align="center" width="95" label="误差值(kg)">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.standard_error" :precision="2" :step="0.1" :min="0" style="width: 70px" size="mini" :controls="false" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="removeOilRow(scope.row)">删除</el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" width="50%" prop="sn" label="序号" /> -->
            <!-- <el-table-column align="center" width="60%" prop="action_name" label="动作">投料</el-table-column> -->
            <!-- <el-table-column prop="auto_flag" label="自动与否" /> -->
            <!-- <el-table-column align="center" prop="material_name" label="油脂名称" /> -->
            <!-- <el-table-column align="center" width="90%" :precision="2" :step="0.1" :min="0.00" prop="actual_weight" label="设定值(kg)" /> -->
            <!-- <el-table-column align="center" width="90%" :precision="2" :step="0.1" :min="0" prop="standard_error" label="误差值(kg)" /> -->
          </el-table>
          <el-form>
            <el-form-item style="text-align: center">
              <div>序号<el-input-number v-model="oilSnForInsert" :min="1" style="margin-right: 6px;margin-left: 6px;" size="mini" :controls="false" />
                <el-button size="mini" :disabled="!insertOilEnbale()" @click="insertBeforeSnOneOil">前插入一行</el-button>
              </div>
              <el-button size="mini" @click="insertOneOil">插入一行</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>

      <el-col :span="15">
        <div class="grid-content bg-purple">
          <span class="font_custom">密炼规程</span>
          <table
            class="table table-bordered"
            border="1"
            bordercolor="#ebeef4"
            style="width: 100%; color: #909399; font-size: 14px; border-collapse:collapse"
          >
            <thead>
              <tr>
                <th style="text-align: center; height: 48px">序号</th>
                <th style="text-align: center; height: 48px">条件</th>
                <th style="text-align: center; height: 48px">时间</th>
                <th style="text-align: center; height: 48px">温度</th>
                <td style="text-align: center; height: 48px">能量</td>
                <td style="text-align: center; height: 48px">功率</td>
                <th style="text-align: center; height: 48px">动作</th>
                <th style="text-align: center; height: 48px">压力</th>
                <th style="text-align: center; height: 48px">转速</th>
                <th style="text-align: center; height: 48px">操作</th>
              </tr>
            </thead>
            <tbody style="color: #606266;">
              <tr v-for="(step_ele, index) in RecipeMaterialList" :key="index">
                <td style="text-align: center; height: 48px">{{ step_ele.sn }}</td>
                <td style="text-align: center; height: 48px">

                  <el-select v-model="step_ele.condition" size="mini" style="width: 100px" clearable placeholder="请选择" @visible-change="SelectConditionDisplay">
                    <el-option
                      v-for="item in SelectConditionOptions"
                      :key="item.id"
                      :label="item.condition"
                      :value="item.id"
                    />
                  </el-select>

                </td>
                <td style="text-align: center; height: 48px">
                  <el-input-number v-model="step_ele.time" :step="1" step-strictly :min="0" :controls="false" style="width: 60px" size="mini" />
                </td>
                <td style="text-align: center; height: 48px">
                  <el-input-number v-model="step_ele.temperature" :step="1" step-strictly :min="0" :controls="false" style="width: 60px" size="mini" />
                </td>
                <td style="text-align: center; height: 48px">
                  <el-input-number v-model="step_ele.energy" :precision="1" :step="0.1" :min="0.0" :controls="false" style="width: 60px" size="mini" />
                </td>
                <td style="text-align: center; height: 48px">
                  <el-input-number v-model="step_ele.power" :precision="1" :step="0.1" :min="0.0" :controls="false" style="width: 60px" size="mini" />
                </td>
                <td style="text-align: center; height: 48px">

                  <el-select v-model="step_ele.action" size="mini" style="width: 100px" clearable placeholder="请选择" @visible-change="SelectActionDisplay">
                    <el-option
                      v-for="item in SelectActionOptions"
                      :key="item.id"
                      :label="item.action"
                      :value="item.id"
                    />
                  </el-select>

                </td>
                <td style="text-align: center; height: 48px">
                  <el-input-number v-model="step_ele.pressure" :precision="1" :step="0.1" :min="0.0" :controls="false" style="width: 60px" size="mini" />
                </td>
                <td style="text-align: center; height: 48px">
                  <el-input-number v-model="step_ele.rpm" :step="1" step-strictly :min="0" :controls="false" style="width: 60px" size="mini" />
                </td>
                <td style="text-align: center; height: 48px">
                  <el-button size="mini" @click="del_recipe_step_row(step_ele, index)">删除</el-button>
                </td>
              </tr>
            </tbody>
          </table>
          <el-form>
            <el-form-item style="text-align: center">
              <div>序号<el-input-number v-model="recipeStepSnForInsert" :min="1" style="margin-right: 6px;margin-left: 6px;" size="mini" :controls="false" />
                <el-button size="mini" :disabled="!insertRecipeStepEnbale()" @click="insert_before_sn_recipe_step">前插入一行</el-button>
              </div>
              <el-button size="mini" @click="insert_recipe_step">插入一行</el-button>
            </el-form-item>
          </el-form>

        </div>
      </el-col>
    </el-row>

    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="90%"
      title="胶料配料标准"
      :visible.sync="dialogRubberMaterialStandard"
    >

      <el-form :inline="true">
        <el-form-item label="预计炼胶时间">
          <el-input-number v-model="production_time_interval" :step="1" step-strictly :min="0" controls-position="right" size="mini" style="width: 100%" />
        </el-form-item>
        <el-form-item style="float: right">
          <el-button @click="saveMaterialClicked">确定</el-button>
        </el-form-item>
      </el-form>
      <br>

      <table
        class="table table-bordered"
        border="1"
        bordercolor="#ebeef4"
        style="width: 100%; color: #909399; font-size: 14px; border-collapse:collapse"
      >
        <thead>
          <tr>
            <th style="text-align: center; height: 48px">No</th>
            <th style="text-align: center; height: 48px">类别</th>
            <!-- <th style="text-align: center; height: 48px">自动与否</th> -->
            <th style="text-align: center; height: 48px">原材料</th>
            <td style="text-align: center; height: 48px">设定值(kg)</td>
            <td style="text-align: center; height: 48px">误差值(kg)</td>
            <th style="text-align: center; height: 48px">操作</th>
          </tr>
        </thead>
        <tbody style="color: #606266;">
          <tr v-for="(material_ele, index) in ProductRecipe" :key="index">
            <!--<td>{{ new_material_ele.sn }}</td>-->
            <td v-show="false">{{ material_ele.material }}</td>
            <td style="text-align: center; height: 48px">{{ index + 1 }}</td>
            <td style="text-align: center; height: 48px">{{ material_ele.material_type }}</td>
            <!-- <td style="text-align: center; height: 48px">
              <template>
                <el-radio v-model="material_ele.auto_flag" :label="1">自动</el-radio>
                <el-radio v-model="material_ele.auto_flag" :label="2">手动</el-radio>
                <el-radio v-model="material_ele.auto_flag" :label="0">其他</el-radio>
              </template>
            </td> -->
            <td style="text-align: center; height: 48px">
              <!-- <div style="margin-top: 12px;"> -->
              <el-input v-model="material_ele.material_name" size="mini" style="width: 70%" class="input-with-select" :disabled="true">
                <el-button slot="append" icon="el-icon-search" @click="pop_up_raw_material(material_ele, index)" />
              </el-input>
              <!-- </div> -->
            </td>
            <td style="text-align: center; height: 48px">
              <el-input-number v-model.number="material_ele.actual_weight" :precision="2" :step="0.1" :min="0.00" size="mini" controls-position="right" />
            </td>
            <td style="text-align: center; height: 48px">
              <el-input-number v-model.number="material_ele.standard_error" :precision="2" :step="0.1" :min="0" size="mini" controls-position="right" />
            </td>
            <td style="text-align: center; height: 48px">
              <el-button size="mini" @click="del_material_row(material_ele, index)">删除</el-button>
            </td>
          </tr>

        </tbody>

      </table>
      <el-form>
        <el-form-item style="text-align: center; margin-top: 10px">
          <el-button @click="insert_material_changed">插入一行</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="70%"
      title="原材料选择"
      :visible.sync="dialogRawMaterialSync"
    >

      <el-form :inline="true">
        <el-form-item label="原材料类别">
          <el-select
            v-model="materialType"
            clearable
            placeholder="请选择"
            @visible-change="materialTypeDisplay"
            @change="materialTypeChange"
          >
            <el-option
              v-for="item in materialTypeOptions"
              :key="item.id"
              :label="item.global_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        原材料编号:<el-input v-model="search_material_no" style="width: 20%" @input="search_material_no_Change" />
        原材料名称:<el-input v-model="search_material_name" style="width: 20%" @input="search_material_name_Change" />
      </el-form>

      <el-table
        highlight-current-row
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          align="center"
          label="S"
          width="30"
        />
        <el-table-column
          align="center"
          prop="material_no"
          label="原材料代码"
        />
        <el-table-column
          align="center"
          prop="material_name"
          label="原材料名称"
        />
        <el-table-column
          align="center"
          prop="material_type_name"
          label="原材料类别"
        />
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                size="mini"
                @click="handleMaterialSelect(scope.row)"
              >选中
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

    </el-dialog>

  </div>
</template>

<script>
import { tank_materials, recipe_list, rubber_process_url, equip_url, site_url, recipe_no_url, stage_url, dev_type_url, global_SITE_url, raw_material_url, material_type_url, condition_url, action_url } from '@/api/recipe_fun'
// import { constantRoutes } from '@/router'
// import { dataTool } from 'echarts/lib/echarts'

export default {
  data: function() {
    return {
      SelectEquipOptions: [],
      SelectSiteOptions: [],
      SelectSITEOptions: [],
      SelectRecipeNoOptions: [],
      SelectStageOptions: [],
      SelectConditionOptions: [],
      SelectActionOptions: [],
      materialTypeOptions: [],
      category__category_name: null,
      materialType: null,
      search_material_no: null,
      search_material_name: null,
      select_recipe_component: false,
      sp_num_options: [{
        value: 1,
        label: '1'
      }, {
        value: 2,
        label: '2'
      }, {
        value: 3,
        label: '3'
      }, {
        value: 4,
        label: '4'
      }, {
        value: 5,
        label: '5'
      }],
      generateRecipeForm: {
        SelectEquip: '',
        SelectSite: '',
        SelectSITE: '',
        SelectRecipeNo: '',
        SelectStage: '',
        version: '',
        scheme: '',
        stage_product_batch_no: ''
      },
      rules: {
        SelectEquip: [{ required: true, message: '请选择机台', trigger: 'change' }],
        SelectSite: [{ required: true, message: '请选择产地', trigger: 'change' }],
        SelectSITE: [{ required: true, message: '请选择SITE', trigger: 'change' }],
        SelectRecipeNo: [{ required: true, message: '请选择胶料编码', trigger: 'change' }],
        SelectStage: [{ required: true, message: '请选择段次', trigger: 'change' }],
        version: [{ required: true, message: '请输入版本', blur: 'change' }],
        stage_product_batch_no: [{ required: true, message: '请输入配方编号', blur: 'change' }]
      },
      generateRecipeFormError: {
        SelectEquip: '',
        SelectSite: '',
        SelectSITE: '',
        SelectRecipeNo: '',
        SelectStage: '',
        version: '',
        scheme: ''
      },
      // 配料弹框
      dialogRubberMaterialStandard: false,
      ProductRecipe: [],
      RecipeMaterialList: [
        {
          sn: 1,
          //     condition:"",
          time: undefined,
          temperature: undefined,
          energy: undefined,
          power: undefined,
          //     action:"",
          pressure: undefined,
          rpm: undefined
        }
      ],
      raw_material_index: null,
      auto_flag: 0,
      // 原材料弹框
      dialogRawMaterialSync: false,
      tableData: [],
      rubber_tableData: [],
      carbon_tableData: [],
      oil_tableData: [],
      currentRow: {},
      currentPage: 1,
      pageSize: 10,
      tableDataTotal: 0,
      // 机台、配方编号
      equip: null,
      stage_product_batch_no: null,
      product_batching: null,
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
      use_flag: true,
      production_time_interval: undefined,
      // 密炼步序字段
      time: undefined,
      temperature: undefined,
      energy: undefined,
      power: undefined,
      pressure: undefined,
      rpm: undefined,
      condition: null,
      standard_error: null,
      batching_details_list: [],
      normalReceipe: true,
      tankOils: [],
      tankCarbons: [],
      recipeStepSnForInsert: 1,
      rubberSnForInsert: 1,
      carbonSnForInsert: 1,
      oilSnForInsert: 1
    }
  },
  created() {
  },
  methods: {
    recipeNameChange() {
      this.stage_product_batch_no = this.generateRecipeForm.stage_product_batch_no
    },
    removeOilRow(row) {
      this.oil_tableData.splice(this.oil_tableData.indexOf(row), 1)
    },
    removeCarbonRow(row) {
      this.carbon_tableData.splice(this.carbon_tableData.indexOf(row), 1)
    },
    insertRubberEnbale() {
      return this.rubber_tableData.some(rb => {
        return rb.sn === this.rubberSnForInsert
      })
    },
    insertBeforeSnOneRubber() {
      var t_r = this.rubber_tableData.find(rb => {
        return rb.sn === this.rubberSnForInsert
      })
      var index = this.rubber_tableData.indexOf(t_r)
      for (var i = index; i < this.rubber_tableData.length; ++i) {
        this.rubber_tableData[i].sn += 1
      }
      this.rubber_tableData.splice(index, 0, {
        sn: this.rubberSnForInsert,
        actual_weight: 0,
        standard_error: 0,
        material_name: ''
      })
    },
    insertOneRubber() {
      var sn = this.rubber_tableData.length + 1
      if (this.rubber_tableData[this.rubber_tableData.length - 1]) {
        sn = this.rubber_tableData[this.rubber_tableData.length - 1].sn + 1
      }
      this.rubber_tableData.push({
        sn,
        actual_weight: 0,
        standard_error: 0,
        material_name: ''
      })
    },
    insertCarbonEnbale() {
      return this.carbon_tableData.some(cb => {
        return cb.sn === this.carbonSnForInsert
      })
    },
    insertBeforeSnOneCarbon() {
      var t_c = this.carbon_tableData.find(cb => {
        return cb.sn === this.carbonSnForInsert
      })
      var index = this.carbon_tableData.indexOf(t_c)
      for (var i = index; i < this.carbon_tableData.length; ++i) {
        this.carbon_tableData[i].sn += 1
      }
      this.carbon_tableData.splice(index, 0, {
        sn: this.carbonSnForInsert,
        actual_weight: 0,
        standard_error: 0,
        material_name: ''
      })
    },
    insertOnecarbon() {
      var sn = this.carbon_tableData.length + 1
      if (this.carbon_tableData[this.carbon_tableData.length - 1]) {
        sn = this.carbon_tableData[this.carbon_tableData.length - 1].sn + 1
      }
      this.carbon_tableData.push({
        sn,
        actual_weight: 0,
        standard_error: 0,
        material_name: ''
      })
    },
    insertOilEnbale() {
      return this.oil_tableData.some(oil => {
        return oil.sn === this.oilSnForInsert
      })
    },
    insertBeforeSnOneOil() {
      var t_o = this.oil_tableData.find(oil => {
        return oil.sn === this.oilSnForInsert
      })
      var index = this.oil_tableData.indexOf(t_o)
      for (var i = index; i < this.oil_tableData.length; ++i) {
        this.oil_tableData[i].sn += 1
      }
      this.oil_tableData.splice(index, 0, {
        sn: this.oilSnForInsert,
        actual_weight: 0,
        standard_error: 0,
        material_name: ''
      })
    },
    insertOneOil() {
      var sn = this.oil_tableData.length + 1
      if (this.oil_tableData[this.oil_tableData.length - 1]) {
        sn = this.oil_tableData[this.oil_tableData.length - 1].sn + 1
      }
      this.oil_tableData.push({
        sn,
        actual_weight: 0,
        standard_error: 0,
        material_name: ''
      })
    },
    removeRubberRow(row) {
      this.rubber_tableData.splice(this.rubber_tableData.indexOf(row), 1)
    },
    selectMaterial(rubberRow) {
      this.rubberRow = rubberRow
      this.dialogRawMaterialSync = true
      this.raw_material_list()
    },
    //   以下6个函数用于初始化下拉框的接口(密炼机类型暂时不用)
    async equip_list() {
      try {
        const equip_list = await equip_url('get', {
          params: { category_name: '密炼设备' }
        })
        if (equip_list.results.length !== 0) {
          this.SelectEquipOptions = equip_list.results
          // console.log('=============')
          // console.log(this.SelectEquipOptions)
        }
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
    async recipe_no_list() {
      try {
        const recipe_no_list = await recipe_no_url('get', {
          params: { }
        })
        if (recipe_no_list.results.length !== 0) {
          this.SelectRecipeNoOptions = recipe_no_list.results
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
    async dev_type_list() {
      // 暂无使用
      try {
        const dev_type_list = await dev_type_url('get', {
          params: { all: 1, class_name: '炼胶机类型' }
        })
        this.RubberStageOptions = dev_type_list.results
      } catch (e) { throw new Error(e) }
    },
    async global_SITE_list() {
      try {
        const global_SITE_list = await global_SITE_url('get', {
          params: { }
        })
        if (global_SITE_list.results.length !== 0) {
          this.SelectSITEOptions = global_SITE_list.results
        }
      } catch (e) { throw new Error(e) }
    },
    async condition_list() {
      try {
        const condition_list = await condition_url('get', {
          params: { }
        })
        this.SelectConditionOptions = condition_list.results
      } catch (e) { throw new Error(e) }
    },
    async action_list() {
      try {
        const action_list = await action_url('get', {
          params: { }
        })
        this.SelectActionOptions = action_list.results
      } catch (e) { throw new Error(e) }
    },

    //   原材料接口
    async raw_material_list(val = 1) {
      try {
        var v_materialType = this.materialType ? this.materialType : ''
        var v_search_material_no = this.search_material_no ? this.search_material_no : ''
        var v_search_material_name = this.search_material_name ? this.search_material_name : ''
        const raw_material_list = await raw_material_url('get', null, {
          params: {
            page: val,
            material_type_id: v_materialType,
            material_no: v_search_material_no,
            material_name: v_search_material_name,
            use_flag: true
          }
        })
        this.tableData = raw_material_list.results
        this.tableDataTotal = raw_material_list.count
      } catch (e) { throw new Error(e) }
    },
    async material_type_list() {
      try {
        const material_type_list = await material_type_url('get', {
          params: { all: 1, class_name: '原材料类别' }
        })
        if (material_type_list.results.length !== 0) {
          this.materialTypeOptions = material_type_list.results
        }
      } catch (e) { throw new Error(e) }
    },
    async post_recipe_list(obj) {
      try {
        const recipe_listData = await recipe_list('post', null, obj)
        return recipe_listData
      } catch (e) {
        this.select_recipe_component = false
        this.equip = null
        this.stage_product_batch_no = null
        throw new Error(e)
      }
    },
    async post_recipe_info_step_list(obj) {
      try {
        const recipe_info_step_list = await rubber_process_url('post', null, obj)
        console.log(recipe_info_step_list)
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
    SelectGlobalSITEDisplay: function(bool) {
      if (bool) {
        this.global_SITE_list()
      }
    },
    SelectRecipeNoDisplay: function(bool) {
      if (bool) {
        this.recipe_no_list()
      }
    },
    SelectStageDisplay: function(bool) {
      if (bool) {
        this.stage_list()
      }
    },
    SelectConditionDisplay: function(bool) {
      if (bool) {
        this.condition_list()
      }
    },
    SelectActionDisplay: function(bool) {
      if (bool) {
        this.action_list()
      }
    },
    materialTypeDisplay: function(bool) {
      if (bool) {
        this.material_type_list()
      }
    },
    SelectEquipChange: function() {
      this.rubber_tableData = []
      this.carbon_tableData = []
      this.oil_tableData = []
      for (var i = 0; i < this.SelectEquipOptions.length; i++) {
        if (this.generateRecipeForm['SelectEquip'] === this.SelectEquipOptions[i]['id']) {
          this.category__category_name = this.SelectEquipOptions[i]['category__category_name']
          tank_materials(this.SelectEquipOptions[i].equip_no, 1).then(response => {
            this.tankCarbons = response.results
            this.tankCarbons = this.tankCarbons.map(ret => {
              return {
                ...ret,
                label: `${ret.tank_name}  ${ret.material_name}`
              }
            })
          })
          tank_materials(this.SelectEquipOptions[i].equip_no, 2).then(response => {
            this.tankOils = response.results
            this.tankOils = this.tankOils.map(ret => {
              return {
                ...ret,
                label: `${ret.tank_name}  ${ret.material_name}`
              }
            })
          })
        }
      }
      for (var j = 0; j < this.SelectEquipOptions.length; ++j) {
        if (this.SelectEquipOptions[j]['id'] === this.generateRecipeForm['SelectEquip']) {
          this.equip = this.SelectEquipOptions[j]['equip_name']
        }
      }
    },
    pagehandleCurrentChange: function(val) {
      this.currentRow = val
      this.raw_material_list(val)
    },
    handleMaterialSelect(row) {
      if (this.rubberRow) {
        if (row.material_type_name === '炭黑' || row.material_type_name === '油料') {
          this.$message('非法选择')
          return
        }
        this.$set(this.rubberRow, 'material_name', row.material_name)
        this.rubberRow.material = row.id
        this.dialogRawMaterialSync = false
      } else {
        var app = this
        // 胶料配料post
        app.ProductRecipe[app.raw_material_index].material_name = row.material_name
        app.ProductRecipe[app.raw_material_index].material = row.id
        app.ProductRecipe[app.raw_material_index].material_type = row.material_type_name
        app.dialogRawMaterialSync = false
      }
    },

    saveMaterialClicked: async function() {
      // if (app.production_time_interval == null) {
      //   this.$message({
      //     message: '预计炼胶时间不能为空',
      //     type: 'error'
      //   })
      //   return
      // }
      // var batching_details_list = []
      // 循环整个表格
      // console.log('------------------b------------')
      // console.log(this.ProductRecipe)
      this.batching_details_list = []
      for (var i = 0; i < this.ProductRecipe.length; ++i) {
        // 只有原材料和实际重量两个必选项都填写时，才能往batching_details_list中push
        if (this.ProductRecipe[i].material_name) {
          var now_stage_material = {
            sn: i + 1,
            // auto_flag: app.ProductRecipe[i].auto_flag,
            auto_flag: 0,
            material: this.ProductRecipe[i].material,
            actual_weight: this.ProductRecipe[i].actual_weight.toFixed(2),
            standard_error: this.ProductRecipe[i].standard_error.toFixed(2),
            material_name: this.ProductRecipe[i].material_name,
            material_type: this.ProductRecipe[i].material_type
          }
          this.batching_details_list.push(now_stage_material)
        } else {
          this.$message({
            message: '必填字段不能为空',
            type: 'error'
          })
          return
        }
      }
      this.rubber_tableData = []
      this.carbon_tableData = []
      this.oil_tableData = []
      this.select_recipe_component = true
      this.dialogRubberMaterialStandard = false
      // console.log('------------------c------------')
      // console.log(this.batching_details_list)
      for (var j = 0; j < this.batching_details_list.length; ++j) {
        var v_auto_falg = ''
        if (this.batching_details_list[j]['auto_flag'] === 1) {
          v_auto_falg = '自动'
        } else if (this.batching_details_list[j]['auto_flag'] === 2) {
          v_auto_falg = '手动'
        } else {
          v_auto_falg = '其他'
        }
        if (this.batching_details_list[j]['material_type'] === '炭黑') {
          this.carbon_tableData.push({
            sn: this.carbon_tableData.length + 1,
            auto_flag: v_auto_falg,
            material_name: this.batching_details_list[j]['material_name'],
            actual_weight: this.batching_details_list[j]['actual_weight'],
            standard_error: this.batching_details_list[j]['standard_error']
          })
        } else if (this.batching_details_list[j]['material_type'] === '油料') {
          this.oil_tableData.push({
            sn: this.oil_tableData.length + 1,
            action_name: '投料',
            auto_flag: v_auto_falg,
            material_name: this.batching_details_list[j]['material_name'],
            actual_weight: this.batching_details_list[j]['actual_weight'],
            standard_error: this.batching_details_list[j]['standard_error']
          })
        } else {
          this.rubber_tableData.push({
            sn: this.rubber_tableData.length + 1,
            action_name: '投料',
            auto_flag: v_auto_falg,
            material_name: this.batching_details_list[j]['material_name'],
            actual_weight: this.batching_details_list[j]['actual_weight'],
            standard_error: this.batching_details_list[j]['standard_error']
          })
        }
      }

      // var post_material_Data = await this.post_recipe_list(
      //   { data: {
      //     'factory': this.generateRecipeForm['SelectSite'],
      //     'site': this.generateRecipeForm['SelectSITE'],
      //     'product_info': this.generateRecipeForm['SelectRecipeNo'],
      //     'precept': this.generateRecipeForm['scheme'],
      //     'stage_product_batch_no': this.stage_product_batch_no,
      //     'stage': this.generateRecipeForm['SelectStage'],
      //     'versions': this.generateRecipeForm['version'],
      //     'production_time_interval': this.production_time_interval,
      //     'batching_details': batching_details_list,
      //     'equip': this.generateRecipeForm['SelectEquip']
      //   }}
      // )
      // console.log('=====================xxx')
      // console.log(post_material_Data)
      // console.log('=====================xxx')
      // if (post_material_Data.non_field_errors !== undefined) {
      //   this.select_recipe_component = false
      //   this.dialogRubberMaterialStandard = false
      //   this.ProductRecipe = []
      //   return
      // }
      // this.select_recipe_component = true
      // this.dialogRubberMaterialStandard = false
      // // 新建的配方的id，用于密炼步序的保存
      // // this.product_batching = post_material_Data['id']
      // for (var j = 0; j < post_material_Data['batching_details'].length; ++j) {
      //   var v_auto_falg = ''
      //   if (post_material_Data['batching_details'][j]['auto_flag'] === 1) {
      //     v_auto_falg = '自动'
      //   } else if (post_material_Data['batching_details'][j]['auto_flag'] === 2) {
      //     v_auto_falg = '手动'
      //   } else {
      //     v_auto_falg = '其他'
      //   }
      //   if (post_material_Data['batching_details'][j]['material_type'] === '炭黑') {
      //     this.carbon_tableData.push({
      //       sn: this.carbon_tableData.length + 1,
      //       auto_flag: v_auto_falg,
      //       material_name: post_material_Data['batching_details'][j]['material_name'],
      //       actual_weight: post_material_Data['batching_details'][j]['actual_weight'],
      //       standard_error: post_material_Data['batching_details'][j]['standard_error']
      //     })
      //   } else if (post_material_Data['batching_details'][j]['material_type'] === '油料') {
      //     this.oil_tableData.push({
      //       sn: this.oil_tableData.length + 1,
      //       action_name: '投料',
      //       auto_flag: v_auto_falg,
      //       material_name: post_material_Data['batching_details'][j]['material_name'],
      //       actual_weight: post_material_Data['batching_details'][j]['actual_weight'],
      //       standard_error: post_material_Data['batching_details'][j]['standard_error']

      //     })
      //   } else {
      //     this.rubber_tableData.push({
      //       sn: this.rubber_tableData.length + 1,
      //       action_name: '投料',
      //       auto_flag: v_auto_falg,
      //       material_name: post_material_Data['batching_details'][j]['material_name'],
      //       actual_weight: post_material_Data['batching_details'][j]['actual_weight'],
      //       standard_error: post_material_Data['batching_details'][j]['standard_error']
      //     })
      //   }
      // }
    },
    generateRecipeName() {
      var SITE_name = ''
      var stage_name = ''
      var product_name = ''
      for (var i = 0; i < this.SelectSITEOptions.length; ++i) {
        if (this.SelectSITEOptions[i]['id'] === this.generateRecipeForm['SelectSITE']) {
          SITE_name = this.SelectSITEOptions[i]['global_name']
        }
      }
      for (var m = 0; m < this.SelectStageOptions.length; ++m) {
        if (this.SelectStageOptions[m]['id'] === this.generateRecipeForm['SelectStage']) {
          stage_name = this.SelectStageOptions[m]['global_name']
        }
      }
      for (var n = 0; n < this.SelectRecipeNoOptions.length; ++n) {
        if (this.SelectRecipeNoOptions[n]['id'] === this.generateRecipeForm['SelectRecipeNo']) {
          product_name = this.SelectRecipeNoOptions[n]['product_no']
        }
      }
      this.stage_product_batch_no = SITE_name + '-' + stage_name + '-' + product_name + '-' + this.generateRecipeForm['version']
      this.generateRecipeForm.stage_product_batch_no = this.stage_product_batch_no
    },
    generateRecipeButton(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 点击生成之后要显示的信息
          for (var j = 0; j < this.SelectEquipOptions.length; ++j) {
            // console.log(this.SelectEquipOptions[j]['id'], this.generateRecipeForm['SelectEquip'])
            if (this.SelectEquipOptions[j]['id'] === this.generateRecipeForm['SelectEquip']) {
              this.equip = this.SelectEquipOptions[j]['equip_name']
            }
          }
          var SITE_name = ''
          var stage_name = ''
          var product_name = ''
          for (var i = 0; i < this.SelectSITEOptions.length; ++i) {
            if (this.SelectSITEOptions[i]['id'] === this.generateRecipeForm['SelectSITE']) {
              SITE_name = this.SelectSITEOptions[i]['global_name']
            }
          }
          for (var m = 0; m < this.SelectStageOptions.length; ++m) {
            if (this.SelectStageOptions[m]['id'] === this.generateRecipeForm['SelectStage']) {
              stage_name = this.SelectStageOptions[m]['global_name']
            }
          }
          for (var n = 0; n < this.SelectRecipeNoOptions.length; ++n) {
            if (this.SelectRecipeNoOptions[n]['id'] === this.generateRecipeForm['SelectRecipeNo']) {
              product_name = this.SelectRecipeNoOptions[n]['product_no']
            }
          }
          this.stage_product_batch_no = SITE_name + '-' + stage_name + '-' + product_name + '-' + this.generateRecipeForm['version']
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showRubberMaterialStandard() {
      this.raw_material_list()
      this.dialogRubberMaterialStandard = true
      for (var j = 0; j < this.SelectEquipOptions.length; ++j) {
        if (this.SelectEquipOptions[j]['id'] === this.generateRecipeForm['SelectEquip']) {
          this.equip = this.SelectEquipOptions[j]['equip_name']
        }
      }
      var SITE_name = ''
      var stage_name = ''
      var product_name = ''
      for (var i = 0; i < this.SelectSITEOptions.length; ++i) {
        if (this.SelectSITEOptions[i]['id'] === this.generateRecipeForm['SelectSITE']) {
          SITE_name = this.SelectSITEOptions[i]['global_name']
        }
      }
      for (var m = 0; m < this.SelectStageOptions.length; ++m) {
        if (this.SelectStageOptions[m]['id'] === this.generateRecipeForm['SelectStage']) {
          stage_name = this.SelectStageOptions[m]['global_name']
        }
      }
      for (var n = 0; n < this.SelectRecipeNoOptions.length; ++n) {
        if (this.SelectRecipeNoOptions[n]['id'] === this.generateRecipeForm['SelectRecipeNo']) {
          product_name = this.SelectRecipeNoOptions[n]['product_no']
        }
      }
      this.stage_product_batch_no = SITE_name + '-' + stage_name + '-' + product_name + '-' + this.generateRecipeForm['version']
    },
    receipeTypeChange() {
      if (!this.normalReceipe) {
        // this.generateRecipeForm = {
        //   SelectEquip: this.generateRecipeForm.SelectEquip,
        //   SelectSite: '',
        //   SelectSITE: '',
        //   SelectRecipeNo: '',
        //   SelectStage: '',
        //   version: '',
        //   scheme: ''
        // }
        var equip = this.generateRecipeForm.SelectEquip
        this.$refs['generateRecipeForm'].resetFields()
        this.generateRecipeForm.SelectEquip = equip
      }
      this.stage_product_batch_no = ''
    },
    generateMaterialButton(formName) {
      // generateRecipeForm
      if (this.normalReceipe) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.showRubberMaterialStandard()
          } else {
            // console.log('error submit!!')
            return false
          }
        })
      } else {
        this.$refs[formName].validateField('SelectEquip', (error) => {
          if (!error) {
            this.raw_material_list()
            this.dialogRubberMaterialStandard = true
            for (var j = 0; j < this.SelectEquipOptions.length; ++j) {
              if (this.SelectEquipOptions[j]['id'] === this.generateRecipeForm['SelectEquip']) {
                this.equip = this.SelectEquipOptions[j]['equip_name']
              }
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    materialTypeChange: function() {
      this.raw_material_list()
    },
    search_material_no_Change: function() {
      this.raw_material_list()
    },
    search_material_name_Change: function() {
      this.raw_material_list()
    },

    insert_material_changed: function() {
      this.ProductRecipe.push({
        material: '',
        material_type: '',
        auto_flag: 0,
        material_name: '',
        actual_weight: null,
        standard_error: null

      })
    },
    del_material_row: function(material_ele, index) {
      this.ProductRecipe.splice(index, 1)
    },
    insertRecipeStepEnbale() {
      return this.RecipeMaterialList.some(rm => {
        return rm.sn === this.recipeStepSnForInsert
      })
    },
    insert_before_sn_recipe_step() {
      var t_rm = this.RecipeMaterialList.find(rm => {
        return rm.sn === this.recipeStepSnForInsert
      })
      var index = this.RecipeMaterialList.indexOf(t_rm)
      for (var i = index; i < this.RecipeMaterialList.length; ++i) {
        this.RecipeMaterialList[i].sn += 1
      }
      this.RecipeMaterialList.splice(index, 0, {
        sn: this.recipeStepSnForInsert,
        time: undefined,
        temperature: undefined,
        energy: undefined,
        power: undefined,
        //     action:"",
        pressure: undefined,
        rpm: undefined
      })
    },
    insert_recipe_step: function() {
      var sn = this.RecipeMaterialList[this.RecipeMaterialList.length - 1]
        ? this.RecipeMaterialList[this.RecipeMaterialList.length - 1].sn + 1 : 1
      this.RecipeMaterialList.push({
        sn,
        //     condition:"",
        time: undefined,
        temperature: undefined,
        energy: undefined,
        power: undefined,
        //     action:"",
        pressure: undefined,
        rpm: undefined
      })
    },
    del_recipe_step_row: function(step_ele, index) {
      this.RecipeMaterialList.splice(index, 1)
    },
    pop_up_raw_material: function(material_ele, index) {
      this.raw_material_index = index
      this.dialogRawMaterialSync = true
    },
    postRecipeList() {
      if (this.sp_num) {
        var batching_details_list = []
        for (var j = 0; j < this.rubber_tableData.length; ++j) {
          if (this.rubber_tableData[j].material) {
            var now_stage_material = {
              sn: this.rubber_tableData[j].sn,
              auto_flag: 0,
              material: this.rubber_tableData[j].material,
              actual_weight: this.rubber_tableData[j].actual_weight ? this.rubber_tableData[j].actual_weight : 0,
              standard_error: this.rubber_tableData[j].standard_error,
              type: 1
            }
            batching_details_list.push(now_stage_material)
          }
        }
        for (j = 0; j < this.carbon_tableData.length; ++j) {
          if (!this.carbon_tableData[j].material) {
            continue
          }
          var now_stage_material_ = {
            sn: this.carbon_tableData[j].sn,
            auto_flag: 0,
            material: this.carbon_tableData[j].material,
            actual_weight: this.carbon_tableData[j].actual_weight ? this.carbon_tableData[j].actual_weight : 0,
            standard_error: this.carbon_tableData[j].standard_error,
            tank_no: this.carbon_tableData[j].tank_no,
            type: 2
          }
          batching_details_list.push(now_stage_material_)
        }
        for (j = 0; j < this.oil_tableData.length; ++j) {
          if (!this.oil_tableData[j].material) {
            continue
          }
          var now_stage_material__ = {
            sn: this.oil_tableData[j].sn,
            auto_flag: 0,
            material: this.oil_tableData[j].material,
            actual_weight: this.oil_tableData[j].actual_weight ? this.oil_tableData[j].actual_weight : 0,
            standard_error: this.oil_tableData[j].standard_error,
            tank_no: this.oil_tableData[j].tank_no,
            type: 3
          }
          batching_details_list.push(now_stage_material__)
        }
        var step_details_list = []
        // 循环整个表格
        if (this.RecipeMaterialList.length === 0) {
          this.$message({
            message: '密炼步序不能为空',
            type: 'error'
          })
          return
        }
        for (var i = 0; i < this.RecipeMaterialList.length; ++i) {
          // 只有步序的所有字段都填时，才能往step_details_list中push
          // if (this.RecipeMaterialList[i].temperature && this.RecipeMaterialList[i].energy && this.RecipeMaterialList[i].power && this.RecipeMaterialList[i].action && this.RecipeMaterialList[i].pressure && this.RecipeMaterialList[i].rpm) {
          if (this.RecipeMaterialList[i].action) {
            var now_recipe_step = {
              sn: i + 1,
              condition: this.RecipeMaterialList[i].condition,
              time: (this.RecipeMaterialList[i].time === undefined) ? 0 : this.RecipeMaterialList[i].time,
              temperature: (this.RecipeMaterialList[i].temperature === undefined) ? 0 : this.RecipeMaterialList[i].temperature,
              energy: (this.RecipeMaterialList[i].energy === undefined) ? 0 : this.RecipeMaterialList[i].energy,
              power: (this.RecipeMaterialList[i].power === undefined) ? 0 : this.RecipeMaterialList[i].power,
              action: this.RecipeMaterialList[i].action,
              pressure: (this.RecipeMaterialList[i].pressure === undefined) ? 0 : this.RecipeMaterialList[i].pressure,
              rpm: (this.RecipeMaterialList[i].rpm === undefined) ? 0 : this.RecipeMaterialList[i].rpm
            }
            step_details_list.push(now_recipe_step)
          } else {
            this.$message({
              message: '密炼步序动作字段不能为空',
              type: 'error'
            })
            return
          }
        }

        recipe_list('post', null, { data: {
          'factory': this.generateRecipeForm['SelectSite'],
          'site': this.normalReceipe ? this.generateRecipeForm['SelectSITE'] : null,
          'product_info': this.normalReceipe ? this.generateRecipeForm['SelectRecipeNo'] : null,
          'precept': this.generateRecipeForm['scheme'],
          'stage_product_batch_no': this.normalReceipe ? null : this.stage_product_batch_no,
          'stage': this.normalReceipe ? this.generateRecipeForm['SelectStage'] : null,
          'versions': this.normalReceipe ? this.generateRecipeForm['version'] : null,
          'production_time_interval': this.production_time_interval,
          'batching_details': batching_details_list,
          'equip': this.generateRecipeForm['SelectEquip'],
          // 密炼步序list
          'process_details': step_details_list,
          'processes': {
            // 配方基础信息中第一行
            'mini_time': (this.mini_time === undefined) ? 0 : this.mini_time,
            'mini_temp': (this.mini_temp === undefined) ? 0 : this.mini_temp,
            'over_temp': (this.over_temp === undefined) ? 0 : this.over_temp,
            'batching_error': (this.batching_error === undefined) ? 0 : this.batching_error,
            'zz_temp': (this.zz_temp === undefined) ? 0 : this.zz_temp,
            'xlm_temp': (this.xlm_temp === undefined) ? 0 : this.xlm_temp,
            'cb_temp': (this.cb_temp === undefined) ? 0 : this.cb_temp,
            // 配方基础信息中第二行
            'over_time': (this.over_time === undefined) ? 0 : this.over_time,
            'max_temp': (this.max_temp === undefined) ? 0 : this.max_temp,
            'reuse_time': (this.reuse_time === undefined) ? 0 : this.reuse_time,
            'reuse_flag': this.reuse_flag,
            'temp_use_flag': this.temp_use_flag,
            'sp_num': this.sp_num,
            'use_flag': this.use_flag,
            // 设备id与配方id
            'equip': this.generateRecipeForm['SelectEquip'],
            'product_batching': this.product_batching
          }
        }}).then(response => {
          this.$message({
            message: this.stage_product_batch_no + '配方步序添加成功',
            type: 'success'
          })
          this.$router.push({ name: 'RecipeList' })
        })
        // try {
        //   // console.log('------------------d--------')
        //   // console.log(this.generateRecipeForm['SelectEquip'], this.generateRecipeForm['SelectSite'], this.generateRecipeForm['SelectRecipeNo'], this.generateRecipeForm['SelectStage'], this.generateRecipeForm['version'])
        //   this.post_recipe_list(
        //     { data: {
        //       'factory': this.generateRecipeForm['SelectSite'],
        //       'site': this.generateRecipeForm['SelectSITE'],
        //       'product_info': this.generateRecipeForm['SelectRecipeNo'],
        //       'precept': this.generateRecipeForm['scheme'],
        //       'stage_product_batch_no': this.stage_product_batch_no,
        //       'stage': this.generateRecipeForm['SelectStage'],
        //       'versions': this.generateRecipeForm['version'],
        //       'production_time_interval': this.production_time_interval,
        //       'batching_details': batching_details_list,
        //       'equip': this.generateRecipeForm['SelectEquip'],
        //       // 密炼步序list
        //       'process_details': step_details_list,
        //       'processes': {
        //       // 配方基础信息中第一行
        //         'mini_time': (this.mini_time === undefined) ? 0 : this.mini_time,
        //         'mini_temp': (this.mini_temp === undefined) ? 0 : this.mini_temp,
        //         'over_temp': (this.over_temp === undefined) ? 0 : this.over_temp,
        //         'batching_error': (this.batching_error === undefined) ? 0 : this.batching_error,
        //         'zz_temp': (this.zz_temp === undefined) ? 0 : this.zz_temp,
        //         'xlm_temp': (this.xlm_temp === undefined) ? 0 : this.xlm_temp,
        //         'cb_temp': (this.cb_temp === undefined) ? 0 : this.cb_temp,
        //         // 配方基础信息中第二行
        //         'over_time': (this.over_time === undefined) ? 0 : this.over_time,
        //         'max_temp': (this.max_temp === undefined) ? 0 : this.max_temp,
        //         'reuse_time': (this.reuse_time === undefined) ? 0 : this.reuse_time,
        //         'reuse_flag': this.reuse_flag,
        //         'temp_use_flag': this.temp_use_flag,
        //         'sp_num': this.sp_num,
        //         'use_flag': this.use_flag,
        //         // 设备id与配方id
        //         'equip': this.generateRecipeForm['SelectEquip'],
        //         'product_batching': this.product_batching
        //       }
        //     }}
        //   )
        //   this.$message({
        //     message: this.stage_product_batch_no + '配方步序添加成功',
        //     type: 'success'
        //   })
        //   this.$router.push({ name: 'RecipeList' })
        // } catch (e) {
        //   console.log(e, 'e')
        // }
      } else {
        this.$message({
          message: '收皮信息不能为空',
          type: 'error'
        })
      }
    },
    AddRecipeInfoStep: async function() {
      if (this.normalReceipe) {
        this.$refs['generateRecipeForm'].validate(valid => {
          if (valid) {
            this.postRecipeList()
          } else {
            return false
          }
        })
      } else {
        var validateTimes = 0
        this.$refs['generateRecipeForm'].validateField(['SelectEquip', 'stage_product_batch_no'], error => {
          if (!error) {
            validateTimes++
            if (validateTimes === 2) {
              this.postRecipeList()
            }
          } else {
            return false
          }
        })
      }
    },
    recipe_return_list: function() {
      this.$router.push({ name: 'RecipeList' })
    },
    materialChange(id, index, materialList, arrList) {
      const Obj = materialList[id]
      this.$set(arrList[index], 'tank_no', Obj.tank_no)
      this.$set(arrList[index], 'provenance', Obj.provenance)
      this.$set(arrList[index], 'material', Obj.id)
    }
  }
}
</script>

<style lang="scss">
.recipe_create{
  .el-select-dropdown__item{
      height:auto !important;
      min-height: 30px;
  }
.font_custom{
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    font-weight: 700;
}

.el-input-number.is-controls-right .el-input__inner {
    padding-left: 0px;
    padding-right: 0px;
}
.el-input-number--mini .el-input-number__decrease, .el-input-number--mini .el-input-number__increase {
    width: 13px;
    font-size: 12px;
}
}
</style>
