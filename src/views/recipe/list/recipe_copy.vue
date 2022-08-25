<template>
  <div
    v-loading="loading"
    element-loading-text="加载中..."
    class="recipe_modify"
  >
    <el-form
      ref="generateRecipeForm"
      :inline="true"
      :model="generateRecipeForm"
      :rules="rules"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="机台">
            <el-select
              v-model="generateRecipeForm.SelectEquip"
              size="mini"
              style="width: 100px"
              clearable
              :disabled="equip_display_bool"
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
            <el-input
              v-model="category__category_name"
              size="mini"
              :disabled="true"
              style="width: 100px"
            />
          </el-form-item>
          <el-form-item label="预计炼胶时间">
            <el-input-number
              v-model="production_time_interval"
              :step="1"
              step-strictly
              :min="0"
              controls-position="right"
              size="mini"
              style="width: 90px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-row>
            <el-form-item
              label="产地"
              prop="SelectSite"
            >
              <el-select
                v-model="generateRecipeForm.SelectSite"
                size="mini"
                style="width: 100px"
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
              label="SITE"
              prop="SelectSITE"
            >
              <el-select
                v-model="generateRecipeForm.SelectSITE"
                size="mini"
                style="width: 100px"
                clearable
                placeholder="请选择"
                :disabled="!isNormalRecipe"
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
            <el-form-item
              label="段次"
              prop="SelectStage"
            >
              <el-select
                v-model="generateRecipeForm.SelectStage"
                size="mini"
                style="width: 100px"
                clearable
                placeholder="请选择"
                :disabled="!isNormalRecipe"
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
            <el-form-item
              label="胶料编码"
              prop="SelectRecipeNo"
            >
              <el-select
                v-model="generateRecipeForm.SelectRecipeNo"
                filterable
                size="mini"
                style="width: 100px"
                clearable
                placeholder="请选择"
                :disabled="!isNormalRecipe"
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
            <el-form-item
              label="版本"
              prop="version"
            >
              <el-input
                v-model="generateRecipeForm.version"
                :disabled="!isNormalRecipe"
                style="width: 90px"
                size="mini"
                placeholder="版本"
                @change="generateRecipeName"
              />
            </el-form-item>
            <el-form-item label="方案">
              <el-input
                v-model="generateRecipeForm.scheme"
                :disabled="!isNormalRecipe"
                style="width: 90px"
                size="mini"
                placeholder="方案"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              label="配方编号"
              :disabled="isNormalRecipe"
              prop="stage_product_batch_no"
            >
              <el-input
                v-model="generateRecipeForm.stage_product_batch_no"
                maxlength="19"
                size="mini"
                :disabled="isNormalRecipe"
                @input="recipeNameChange"
              />
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <el-form :inline="true">
      <el-form-item label="配方编号">
        <el-input
          v-model="stage_product_batch_no"
          size="mini"
          :disabled="true"
          style="width: 100%"
        />
      </el-form-item>
      <!-- <el-form-item label="配方编号">
        <el-input v-model="stage_product_batch_no" size="mini" :disabled="true" style="width: 100%" />
      </el-form-item>
      <el-form-item label="配方名称">
        <el-input v-model="product_name" size="mini" :disabled="true" style="width: 100%" />
      </el-form-item> -->

      <el-form-item style="float: right">
        <el-button @click="recipe_return_list">返回</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button type="primary" @click="replicationProcessDialog">复制工艺参数</el-button>
        <el-button @click="recipe_save_return">确定保存</el-button>
      </el-form-item>
      <!-- <el-form-item style="float: right">
        <el-button @click="modify_material_button">修改配料</el-button>
      </el-form-item> -->

    </el-form>

    <el-form :inline="true">
      <br>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <el-form-item label="超温最短时间">
              <el-input-number
                v-model="mini_time"
                :step="1"
                step-strictly
                :min="0"
                controls-position="right"
                size="mini"
                style="width: 70px"
              />
            </el-form-item>
            <el-form-item label="进胶最低温度">
              <el-input-number
                v-model="mini_temp"
                :step="1"
                step-strictly
                :min="0"
                controls-position="right"
                size="mini"
                style="width: 70px"
              />
            </el-form-item>
            <el-form-item label="超温温度">
              <el-input-number
                v-model="over_temp"
                :step="1"
                step-strictly
                :min="0"
                controls-position="right"
                size="mini"
                style="width: 70px"
              />
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
              <el-input-number
                v-model="zz_temp"
                :step="1"
                step-strictly
                :min="0"
                controls-position="right"
                size="mini"
                style="width: 70px"
              />
            </el-form-item>
            <el-form-item label="卸料门水温">
              <el-input-number
                v-model="xlm_temp"
                :step="1"
                step-strictly
                :min="0"
                controls-position="right"
                size="mini"
                style="width: 70px"
              />
            </el-form-item>
            <el-form-item label="侧壁水温">
              <el-input-number
                v-model="cb_temp"
                :step="1"
                step-strictly
                :min="0"
                controls-position="right"
                size="mini"
                style="width: 70px"
              />
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
              <el-input-number
                v-model="over_time"
                :step="1"
                step-strictly
                :min="0"
                controls-position="right"
                size="mini"
                style="width: 70px"
              />
            </el-form-item>
            <el-form-item label="进胶最高温度">
              <el-input-number
                v-model="max_temp"
                :step="1"
                step-strictly
                :min="0"
                controls-position="right"
                size="mini"
                style="width: 70px"
              />
            </el-form-item>
            <el-form-item
              v-show="reuse_flag"
              label="回收时间"
            >
              <el-input-number
                v-model="reuse_time"
                :step="1"
                step-strictly
                :min="0"
                controls-position="right"
                size="mini"
                style="width: 70px"
              />
            </el-form-item>
            <el-form-item label="是否回收">
              <template>
                <el-radio
                  v-model="reuse_flag"
                  :label="true"
                >是</el-radio>
                <el-radio
                  v-model="reuse_flag"
                  :label="false"
                >否</el-radio>
              </template>
            </el-form-item>
            <el-form-item label=" ">
              <el-radio
                v-model="temp_use_flag"
                :label="true"
              >三区水温启动</el-radio>
              <el-radio
                v-model="temp_use_flag"
                :label="false"
              >三区水温停用</el-radio>
            </el-form-item>
            <el-form-item
              label="收皮"
              prop="SelectEquip"
            >
              <el-input-number
                v-model="sp_num"
                :max="99.9"
                controls-position="right"
                size="mini"
                style="width: 70px"
                :precision="1"
                :step="0.1"
              />
            </el-form-item>
            <el-form-item label="车/托" />
            <el-form-item
              v-if="category__category_name==='GK255'"
              label="成环时间"
              prop="ch_time"
            >
              <el-input-number
                v-model="ch_time"
                :step="1"
                step-strictly
                :min="0"
                :max="300"
                controls-position="right"
                size="mini"
                style="width: 70px"
              />
            </el-form-item>
            <el-form-item
              v-if="category__category_name==='GK255'"
              label="捣胶时间"
              prop="dj_time"
            >
              <el-input-number
                v-model="dj_time"
                :step="1"
                step-strictly
                :min="0"
                :max="300"
                controls-position="right"
                size="mini"
                style="width: 70px"
              />
            </el-form-item>
            <el-form-item
              v-if="category__category_name==='GK255'"
              label="拉断时间"
              prop="ld_time"
            >
              <el-input-number
                v-model="ld_time"
                :step="1"
                step-strictly
                :min="0"
                :max="300"
                controls-position="right"
                size="mini"
                style="width: 70px"
              />
            </el-form-item>
            <el-form-item
              v-if="category__category_name==='GK255'"
              label="是否启用"
            >
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
            <el-table-column
              align="center"
              width="50%"
              prop="sn"
              label="序号"
            />
            <!-- <el-table-column prop="auto_flag" label="自动与否" /> -->
            <el-table-column
              align="center"
              width="230"
              prop="material_name"
              label="胶料名称"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.material_name"
                  size="mini"
                  class="input-with-select"
                  :disabled="true"
                >
                  <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="selectMaterial(scope.row)"
                  />
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="设定值(kg)"
            >
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.actual_weight"
                  :precision="2"
                  :step="0.1"
                  :min="0.00"
                  style="width: 70px"
                  size="mini"
                  :controls="false"
                />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="误差值(kg)"
            >
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.standard_error"
                  :precision="2"
                  :step="0.1"
                  :min="0"
                  style="width: 70px"
                  size="mini"
                  :controls="false"
                />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              width="160px"
            >
              <template slot-scope="scope">
                <el-button-group>
                  <el-button
                    icon="el-icon-caret-top"
                    size="mini"
                    type="primary"
                    @click="moveUp(scope.$index,scope.row,rubber_tableData)"
                  />
                  <el-button
                    icon="el-icon-caret-bottom"
                    size="mini"
                    type="primary"
                    @click="moveDown(scope.$index,scope.row,rubber_tableData)"
                  />
                  <el-button icon="el-icon-delete" size="mini" type="danger" @click="removeRubberRow(scope.row)" />
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <el-form>
            <el-form-item style="text-align: center">
              <div>序号
                <el-input-number
                  v-model="rubberSnForInsert"
                  :min="1"
                  style="margin-right: 6px;margin-left: 6px;"
                  size="mini"
                  :controls="false"
                />
                <el-button
                  size="mini"
                  :disabled="!insertRubberEnbale()"
                  @click="insertBeforeSnOneRubber"
                >前插入一行</el-button>
              </div>
              <el-button
                size="mini"
                @click="insertOneRubber"
              >插入一行</el-button>
            </el-form-item>
          </el-form>
          <span class="font_custom">炭黑称量</span>
          <el-table
            highlight-current-row
            :data="carbon_tableData"
            border
            style="width: 100%"
          >
            <el-table-column
              align="center"
              width="40"
              prop="sn"
              label="序号"
            />
            <el-table-column
              align="center"
              prop="action_name"
              label="动作"
            >投料</el-table-column>
            <!-- <el-table-column prop="auto_flag" label="自动与否" /> -->
            <el-table-column
              width="250"
              align="center"
              label="炭黑名称"
            >
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
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="95"
              label="产地"
            >
              <template slot-scope="scope">
                {{ scope.row.provenance?scope.row.provenance:'--' }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="95"
              label="设定值(kg)"
            >
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.actual_weight"
                  :precision="2"
                  :step="0.1"
                  :min="0.00"
                  style="width: 70px"
                  size="mini"
                  :controls="false"
                />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="95"
              label="误差值(kg)"
            >
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.standard_error"
                  :precision="2"
                  :step="0.1"
                  :min="0"
                  style="width: 70px"
                  size="mini"
                  :controls="false"
                />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              width="160px"
            >
              <template slot-scope="scope">
                <el-button-group>
                  <el-button
                    icon="el-icon-caret-top"
                    size="mini"
                    type="primary"
                    @click="moveUp(scope.$index,scope.row,carbon_tableData)"
                  />
                  <el-button
                    icon="el-icon-caret-bottom"
                    size="mini"
                    type="primary"
                    @click="moveDown(scope.$index,scope.row,carbon_tableData)"
                  />
                  <el-button icon="el-icon-delete" size="mini" type="danger" @click="removeCarbonRow(scope.row)" />
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <el-form>
            <el-form-item style="text-align: center">
              <div>序号
                <el-input-number
                  v-model="carbonSnForInsert"
                  :min="1"
                  style="margin-right: 6px;margin-left: 6px;"
                  size="mini"
                  :controls="false"
                />
                <el-button
                  size="mini"
                  :disabled="!insertCarbonEnbale()"
                  @click="insertBeforeSnOneCarbon"
                >前插入一行</el-button>
              </div>
              <el-button
                size="mini"
                @click="insertOnecarbon"
              >插入一行</el-button>
            </el-form-item>
          </el-form>
          <span class="font_custom">{{ equip_no==='Z07'?'油料称量1':'油料称量' }}</span>
          <el-table
            highlight-current-row
            :data="oil_tableData"
            border
            style="width: 100%"
          >
            <el-table-column
              align="center"
              width="40"
              prop="sn"
              label="序号"
            />
            <el-table-column
              align="center"
              prop="action_name"
              label="动作"
            >投料</el-table-column>
            <!-- <el-table-column prop="auto_flag" label="自动与否" /> -->
            <el-table-column
              width="250"
              align="center"
              label="油脂名称"
            >
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
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="95"
              label="产地"
            >
              <template slot-scope="scope">
                {{ scope.row.provenance?scope.row.provenance:'--' }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="95"
              label="设定值(kg)"
            >
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.actual_weight"
                  :precision="2"
                  :step="0.1"
                  :min="0.00"
                  style="width: 70px"
                  size="mini"
                  :controls="false"
                />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="95"
              label="误差值(kg)"
            >
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.standard_error"
                  :precision="2"
                  :step="0.1"
                  :min="0"
                  style="width: 70px"
                  size="mini"
                  :controls="false"
                />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              width="160px"
            >
              <template slot-scope="scope">
                <el-button-group>
                  <el-button
                    icon="el-icon-caret-top"
                    size="mini"
                    type="primary"
                    @click="moveUp(scope.$index,scope.row,oil_tableData)"
                  />
                  <el-button
                    icon="el-icon-caret-bottom"
                    size="mini"
                    type="primary"
                    @click="moveDown(scope.$index,scope.row,oil_tableData)"
                  />
                  <el-button icon="el-icon-delete" size="mini" type="danger" @click="removeOilRow(scope.row)" />
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <el-form>
            <el-form-item style="text-align: center">
              <div>序号
                <el-input-number
                  v-model="oilSnForInsert"
                  :min="1"
                  style="margin-right: 6px;margin-left: 6px;"
                  size="mini"
                  :controls="false"
                />
                <el-button
                  size="mini"
                  :disabled="!insertOilEnbale()"
                  @click="insertBeforeSnOneOil"
                >前插入一行</el-button>
              </div>
              <el-button
                size="mini"
                @click="insertOneOil"
              >插入一行</el-button>
            </el-form-item>
          </el-form>
          <span v-if="equip_no==='Z07'" class="font_custom">油料称量2</span>
          <el-table
            v-if="equip_no==='Z07'"
            highlight-current-row
            :data="oil_tableData1"
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
                  @change="materialChange($event,scope.$index,tankOils1,oil_tableData1)"
                >
                  <el-option
                    v-for="(item,index) in tankOils1"
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
            <el-table-column align="center" label="操作" width="160px">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button
                    icon="el-icon-caret-top"
                    size="mini"
                    type="primary"
                    @click="moveUp(scope.$index,scope.row,oil_tableData1)"
                  />
                  <el-button
                    icon="el-icon-caret-bottom"
                    size="mini"
                    type="primary"
                    @click="moveDown(scope.$index,scope.row,oil_tableData1)"
                  />
                  <el-button icon="el-icon-delete" size="mini" type="danger" @click="removeOilRow1(scope.row)" />
                </el-button-group>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" width="50%" prop="sn" label="序号" /> -->
            <!-- <el-table-column align="center" width="60%" prop="action_name" label="动作">投料</el-table-column> -->
            <!-- <el-table-column prop="auto_flag" label="自动与否" /> -->
            <!-- <el-table-column align="center" prop="material_name" label="油脂名称" /> -->
            <!-- <el-table-column align="center" width="90%" :precision="2" :step="0.1" :min="0.00" prop="actual_weight" label="设定值(kg)" /> -->
            <!-- <el-table-column align="center" width="90%" :precision="2" :step="0.1" :min="0" prop="standard_error" label="误差值(kg)" /> -->
          </el-table>
          <el-form v-if="equip_no==='Z07'">
            <el-form-item style="text-align: center">
              <div>序号<el-input-number v-model="oilSnForInsert1" :min="1" style="margin-right: 6px;margin-left: 6px;" size="mini" :controls="false" />
                <el-button size="mini" :disabled="!insertOilEnbale1()" @click="insertBeforeSnOneOil1">前插入一行</el-button>
              </div>
              <el-button size="mini" @click="insertOneOil1">插入一行</el-button>
            </el-form-item>
          </el-form>
        </div>

      </el-col>

      <el-col :span="15">
        <div class="grid-content bg-purple">
          <span class="font_custom">密炼规程</span>
          <!-- <el-button size="mini"  @click="delete_recipe_step">删除一行</el-button> -->
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
                <td style="text-align: center; height: 48px">AI值</td>
                <th style="text-align: center; height: 48px">动作</th>
                <th style="text-align: center; height: 48px">压力</th>
                <th style="text-align: center; height: 48px">转速</th>
                <th style="text-align: center; height: 48px">操作</th>
              </tr>
            </thead>
            <tbody style="color: #606266;">
              <tr
                v-for="(step_ele, index) in RecipeMaterialList"
                :key="index"
              >
                <td style="text-align: center; height: 48px">{{ step_ele.sn }}</td>
                <td style="text-align: center; height: 48px">
                  <el-select
                    v-model="step_ele.condition"
                    size="mini"
                    style="width: 100px"
                    clearable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in SelectConditionOptions"
                      :key="item.id"
                      :label="item.condition"
                      :value="item.id"
                    />
                  </el-select>

                </td>
                <td style="text-align: center; height: 48px">
                  <el-input-number
                    v-model="step_ele.time"
                    :step="1"
                    step-strictly
                    :min="0"
                    style="width: 60px"
                    size="mini"
                    :controls="false"
                  />
                </td>
                <td style="text-align: center; height: 48px">
                  <el-input-number
                    v-model="step_ele.temperature"
                    :step="1"
                    step-strictly
                    :min="0"
                    style="width: 60px"
                    size="mini"
                    :controls="false"
                  />
                </td>
                <td style="text-align: center; height: 48px">
                  <el-input-number
                    v-model="step_ele.energy"
                    :precision="1"
                    :step="0.1"
                    :min="0.0"
                    style="width: 60px"
                    size="mini"
                    :controls="false"
                  />
                </td>
                <td style="text-align: center; height: 48px">
                  <el-input-number
                    v-model="step_ele.power"
                    :precision="1"
                    :step="0.1"
                    :min="0.0"
                    style="width: 60px"
                    size="mini"
                    :controls="false"
                  />
                </td>
                <td style="text-align: center; height: 48px">

                  <el-select
                    v-model="step_ele.action"
                    size="mini"
                    style="width: 100px"
                    clearable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in SelectActionOptions"
                      :key="item.id"
                      :label="item.action"
                      :value="item.id"
                    />
                  </el-select>

                </td>
                <td style="text-align: center; height: 48px">
                  <el-input-number
                    v-model="step_ele.pressure"
                    :precision="1"
                    :step="0.1"
                    :min="0.0"
                    style="width: 60px"
                    size="mini"
                    :controls="false"
                  />
                </td>
                <td style="text-align: center; height: 48px">
                  <el-input-number
                    v-model="step_ele.rpm"
                    :step="1"
                    step-strictly
                    :min="0"
                    style="width: 60px"
                    size="mini"
                    :controls="false"
                  />
                </td>
                <td style="text-align: center; height: 48px">
                  <el-button
                    size="mini"
                    @click="del_recipe_step_row(step_ele, index)"
                  >删除</el-button>
                </td>
              </tr>

            </tbody>
          </table>
          <el-form>
            <el-form-item style="text-align: center">
              <div>序号
                <el-input-number
                  v-model="recipeStepSnForInsert"
                  :min="1"
                  style="margin-right: 6px;margin-left: 6px;"
                  size="mini"
                  :controls="false"
                />
                <el-button
                  size="mini"
                  :disabled="!insertRecipeStepEnbale()"
                  @click="insert_before_sn_recipe_step"
                >前插入一行</el-button>
              </div>
              <el-button
                size="mini"
                @click="insert_recipe_step"
              >插入一行</el-button>
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
          <el-input-number
            v-model="production_time_interval"
            :step="1"
            step-strictly
            :min="0"
            controls-position="right"
            size="mini"
            style="width: 100%"
          />
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
            <th style="text-align: center ; height: 48px">原材料</th>
            <td style="text-align: center ; height: 48px">设定值(kg)</td>
            <td style="text-align: center; height: 48px">误差值(kg)</td>
            <th style="text-align: center; height: 48px">操作</th>
          </tr>
        </thead>
        <tbody style="color: #606266;">
          <tr
            v-for="(material_ele, index) in ProductRecipe"
            :key="index"
          >
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
              <el-input
                v-model="material_ele.material_name"
                size="mini"
                style="width: 70%"
                class="input-with-select"
                :disabled="true"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="pop_up_raw_material(material_ele, index)"
                />
              </el-input>
              <!-- </div> -->
            </td>
            <td style="text-align: center; height: 48px">
              <el-input-number
                v-model.number="material_ele.actual_weight"
                :precision="2"
                :step="0.1"
                :min="0.00"
                size="mini"
                controls-position="right"
              />
            </td>
            <td style="text-align: center; height: 48px">
              <el-input-number
                v-model.number="material_ele.standard_error"
                :precision="2"
                :step="0.1"
                :min="0"
                size="mini"
                controls-position="right"
              />
            </td>
            <td style="text-align: center; height: 48px">
              <el-button
                size="mini"
                @click="del_material_row(material_ele, index)"
              >删除</el-button>
            </td>
          </tr>

        </tbody>

      </table>
      <el-form>
        <el-form-item style="text-align: cchaenter">
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
        原材料编号:
        <el-input
          v-model="search_material_no"
          style="width: 20%"
          @input="search_material_no_Change"
        />
        原材料名称:
        <el-input
          v-model="search_material_name"
          style="width: 20%"
          @input="search_material_name_Change"
        />
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
        <el-table-column
          align="center"
          label="操作"
        >
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

    <el-dialog
      title="选择参考配方"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-form ref="formData" :model="formData" label-width="100px">
        <el-form-item label="机台">
          <el-select
            v-model="formData.equip_id"
            style="width: 250px"
            placeholder="请选择"
            @change="SelectEquipChange1"
          >
            <el-option
              v-for="item in SelectEquipOptions"
              :key="item.id"
              :label="item.equip_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="配方">
          <el-select
            v-model="formData.recipe_no"
            style="width: 250px"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in SelectRecipeOptions"
              :key="item.id"
              :label="item.stage_product_batch_no"
              :value="item.stage_product_batch_no"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="loadingBtn" @click="submitBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { recipe_no_url, stage_url, global_SITE_url, site_url, tank_materials, recipe_list, equip_url, rubber_process_url, raw_material_url, material_type_url, condition_url, action_url } from '@/api/recipe_fun'
// import { constantRoutes } from '@/router'
// import { dataTool } from 'echarts/lib/echarts'
import { productbatching, productTechParams } from '@/api/plan'

var timer = null
export default {
  data: function() {
    return {
      loading: null,
      SelectSiteOptions: [],
      SelectSITEOptions: [],
      SelectStageOptions: [],
      SelectRecipeNoOptions: [],
      equip_no: null,
      // 机台、配方编号、配方名称
      category__category_name: null,
      equip_display_bool: null,
      stage_product_batch_no: null,
      product_name: null,
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
      use_flag: false,
      ch_time: undefined,
      dj_time: undefined,
      ld_time: undefined,
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
      SelectEquipOptions: [],
      rubber_tableData: [],
      carbon_tableData: [],
      oil_tableData: [],
      RecipeMaterialList: [],
      ProductRecipe: [],
      SelectConditionOptions: [],
      SelectActionOptions: [],
      materialTypeOptions: [],
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
      materialType: null,
      search_material_no: null,
      search_material_name: null,
      dialogRubberMaterialStandard: false,
      dialogRawMaterialSync: false,
      tableData: [],
      currentRow: {},
      currentPage: 1,
      pageSize: 10,
      tableDataTotal: 0,
      recipe_step_id: null,
      auto_flag: 0,
      batching_details_list: [],
      confirm_recipe_list: [],
      rubberRow: null,
      tankOils: [],
      tankCarbons: [],
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
      recipeStepSnForInsert: 1,
      rubberSnForInsert: 1,
      carbonSnForInsert: 1,
      oilSnForInsert: 1,
      isNormalRecipe: true,
      dialogVisible: false,
      formData: {},
      SelectRecipeOptions: [],
      loadingBtn: false,
      oilSnForInsert1: null,
      oil_tableData1: [],
      tankOils1: []
    }
  },
  async created() {
    this.loading = true
    this.recipe_no_list()
    this.stage_list()
    this.global_SITE_list()
    this.site_list()
    this.equip_no = this.$route.params['equip_no']
    // this.$route.params['site']
    await this.getTankCarbons()
    await this.getTankOils()
    //   rubber_process_urlcreated
    // 配方详情界面的三个表格的原材料展示接口访问
    this.recipe_material_list(this.$route.params['id'])
    // 配方详情界面的配方信息和created密炼步序信息接口访问（已废弃）
    // this.recipe_process_step_list(this.$route.params['id'], this.$route.params['equip'])
    this.SelectEquipDisplay1()
    this.condition_list()
    this.action_list()
    this.material_type_list()
    this.equip_list()
  },
  destroyed() {
    clearInterval(timer)
  },
  methods: {
    recipeNameChange() {
      this.stage_product_batch_no = this.generateRecipeForm.stage_product_batch_no
    },
    generateRecipeName() {
      var SITE_name = null
      var stage_name = null
      var product_name = null
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
      if (SITE_name && stage_name && product_name && this.generateRecipeForm['version']) {
        clearInterval(timer)
      }
      this.stage_product_batch_no = SITE_name + '-' + stage_name + '-' + product_name + '-' + this.generateRecipeForm['version']
      this.generateRecipeForm.stage_product_batch_no = this.stage_product_batch_no
    },
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
    SelectStageDisplay: function(bool) {
      if (bool) {
        this.stage_list()
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
    SelectSiteDisplay: function(bool) {
      if (bool) {
        this.site_list()
      }
    },
    selectMaterial(rubberRow) {
      this.rubberRow = rubberRow
      this.dialogRawMaterialSync = true
      this.raw_material_list()
    },
    getTankCarbons() {
      tank_materials(this.equip_no, 1).then(response => {
        this.tankCarbons = response.results
        this.tankCarbons = this.tankCarbons.map((ret, index) => {
          return {
            ...ret,
            label: `${ret.tank_name}  ${ret.material_name}`,
            _index: index
          }
        })
      })
    },
    getTankOils() {
      tank_materials(this.equip_no, 2).then(response => {
        if (this.equip_no === 'Z07') {
          this.tankOils1 = response.results.filter(d => d.line_no === 2)
          this.tankOils = response.results.filter(d => d.line_no === 1 || !d.line_no)
        } else {
          this.tankOils = response.results
        }
        this.tankOils = this.tankOils.map((ret, index) => {
          return {
            ...ret,
            label: `${ret.tank_name}  ${ret.material_name}`,
            _index: index
          }
        })
        this.tankOils1 = this.tankOils1.map((ret, index) => {
          return {
            ...ret,
            label: `${ret.tank_name}  ${ret.material_name}`,
            _index: index
          }
        })
      })
    },
    async equip_list() {
      try {
        const equip_list = await equip_url('get', {
          params: {}
        })
        this.SelectEquipOptions = equip_list.results
      } catch (e) { throw new Error(e) }
    },
    removeCarbonRow(row) {
      this.carbon_tableData.splice(this.carbon_tableData.indexOf(row), 1)
      this.carbon_tableData.forEach((d, i) => {
        d.sn = i + 1
      })
    },
    removeRubberRow(row) {
      this.rubber_tableData.splice(this.rubber_tableData.indexOf(row), 1)
      this.rubber_tableData.forEach((d, i) => {
        d.sn = i + 1
      })
    },
    removeOilRow(row) {
      this.oil_tableData.splice(this.oil_tableData.indexOf(row), 1)
      this.oil_tableData.forEach((d, i) => {
        d.sn = i + 1
      })
    },
    removeOilRow1(row) {
      this.oil_tableData1.splice(this.oil_tableData1.indexOf(row), 1)
      this.oil_tableData1.forEach((d, i) => {
        d.sn = i + 1
      })
    },
    moveUp(index, row, list) {
      if (index === 0) {
        this.$message({
          message: '处于顶端，不能继续上移',
          type: 'warning'
        })
        return
      }
      list[index - 1].sn = row.sn
      row.sn = row.sn - 1
      const arr = [
        row,
        list[index - 1]
      ]
      list.splice(index - 1, 2, ...arr)
    },
    moveDown(index, row, list) {
      if (index + 1 === list.length) {
        this.$message({
          message: '处于末端，不能继续下移',
          type: 'warning'
        })
        return
      }
      list[index + 1].sn = row.sn
      row.sn = row.sn + 1
      const arr = [
        list[index + 1],
        row
      ]
      list.splice(index, 2, ...arr)
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
    insertOilEnbale1() {
      return this.oil_tableData1.some(oil => {
        return oil.sn === this.oilSnForInsert1
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
    insertBeforeSnOneOil1() {
      var t_o = this.oil_tableData1.find(oil => {
        return oil.sn === this.oilSnForInsert1
      })
      var index = this.oil_tableData1.indexOf(t_o)
      for (var i = index; i < this.oil_tableData1.length; ++i) {
        this.oil_tableData1[i].sn += 1
      }
      this.oil_tableData1.splice(index, 0, {
        sn: this.oilSnForInsert1,
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
    insertOneOil1() {
      var sn = this.oil_tableData1.length + 1
      if (this.oil_tableData1[this.oil_tableData1.length - 1]) {
        sn = this.oil_tableData1[this.oil_tableData1.length - 1].sn + 1
      }
      this.oil_tableData1.push({
        sn,
        actual_weight: 0,
        standard_error: 0,
        material_name: ''
      })
    },
    async post_recipe_list(obj) {
      try {
        const recipe_listData = await recipe_list('post', null, obj)
        return recipe_listData
      } catch (e) {
        throw new Error(e)
      }
    },

    async recipe_material_list(id) {
      var canAddCarbonOil = this.$route.params.CopySelectEquip === this.$route.params.equip_id
      try {
        const recipe_listData = await recipe_list('get', id, {
          params: {}
        })
        this.production_time_interval = recipe_listData['production_time_interval']
        this.generateRecipeForm.SelectEquip = this.$route.params['copy_equip_id']
        this.category__category_name = this.$route.params['category__category_name']
        if (this.generateRecipeForm.SelectEquip == null) {
          this.equip_display_bool = false
        } else {
          this.equip_display_bool = true
        }
        this.product_name = this.$route.params['product_name']
        this.confirm_recipe_list = recipe_listData
        for (var j = 0; j < recipe_listData['batching_details'].length; ++j) {
          // var v_auto_falg = ''
          // if (recipe_listData['batching_details'][j]['auto_flag'] === 1) {
          //   v_auto_falg = '自动'
          // } else if (recipe_listData['batching_details'][j]['auto_flag'] === 2) {
          //   v_auto_falg = '手动'
          // } else {
          //   v_auto_falg = '其他'
          // }
          if (recipe_listData['batching_details'][j]['type'] === 2) {
            if (canAddCarbonOil) {
              let carbonItem = this.tankCarbons.find(item => {
                return item.id === recipe_listData['batching_details'][j].material &&
                  (Number(item.tank_no) === Number(recipe_listData['batching_details'][j].tank_no))
              })
              if (!carbonItem) { // 不在下拉选项中的数据
                carbonItem = {
                  id: recipe_listData['batching_details'][j].material,
                  material_name: recipe_listData['batching_details'][j].material_name,
                  label: recipe_listData['batching_details'][j].material_name,
                  _index: this.tankCarbons.length - 1
                }
                this.tankCarbons.push(carbonItem)
              }
              this.carbon_tableData.push({
                ...recipe_listData['batching_details'][j],
                _index: carbonItem._index
              })
            }
          } else if (recipe_listData['batching_details'][j]['type'] === 3) {
            if (canAddCarbonOil) {
              if (this.equip_no === 'Z07' && recipe_listData['batching_details'][j]['line_no'] === 2) {
                let oilItem = this.tankOils1.find(item => {
                  return (item.id === recipe_listData['batching_details'][j].material) &&
               (Number(item.tank_no) === Number(recipe_listData['batching_details'][j].tank_no))
                })
                if (!oilItem) { // 不在下拉选项中的数据
                  oilItem = {
                    id: recipe_listData['batching_details'][j].material,
                    material_name: recipe_listData['batching_details'][j].material_name,
                    label: recipe_listData['batching_details'][j].material_name,
                    tank_no: recipe_listData['batching_details'][j].tank_no || '',
                    provenance: recipe_listData['batching_details'][j].provenance || '',
                    _index: this.tankOils1.length
                  }
                  this.tankOils1.push(oilItem)
                }
                this.oil_tableData1.push({
                  action_name: '投料',
                  _index: oilItem._index,
                  ...recipe_listData['batching_details'][j]
                })
              }
              let oilItem = this.tankOils.find(item => {
                return (item.id === recipe_listData['batching_details'][j].material) &&
               (Number(item.tank_no) === Number(recipe_listData['batching_details'][j].tank_no))
              })
              if (!oilItem) { // 不在下拉选项中的数据
                oilItem = {
                  id: recipe_listData['batching_details'][j].material,
                  material_name: recipe_listData['batching_details'][j].material_name,
                  label: recipe_listData['batching_details'][j].material_name,
                  tank_no: recipe_listData['batching_details'][j].tank_no || '',
                  provenance: recipe_listData['batching_details'][j].provenance || '',
                  _index: this.tankOils.length
                }
                if (this.equip_no === 'Z07' && recipe_listData['batching_details'][j]['line_no'] === 1 || !recipe_listData['batching_details'][j]['line_no']) {
                  this.tankOils.push(oilItem)
                } else if (this.equip_no !== 'Z07') {
                  this.tankOils.push(oilItem)
                }
              }
              if (this.equip_no === 'Z07' && (recipe_listData['batching_details'][j]['line_no'] === 1 || !recipe_listData['batching_details'][j]['line_no'])) {
                this.oil_tableData.push({
                  action_name: '投料',
                  _index: oilItem._index,
                  ...recipe_listData['batching_details'][j]
                })
              } else if (this.equip_no !== 'Z07') {
                this.oil_tableData.push({
                  action_name: '投料',
                  _index: oilItem._index,
                  ...recipe_listData['batching_details'][j]
                })
              }
            }
          } else {
            this.rubber_tableData.push({
              action_name: '投料',
              ...recipe_listData['batching_details'][j]
            })
          }
        }
        this.carbon_tableData = this.carbon_tableData.sort(this.compareSn)
        this.oil_tableData = this.oil_tableData.sort(this.compareSn)
        this.rubber_tableData = this.rubber_tableData.sort(this.compareSn)
        // console.log('----------------------get--------------------')
        // console.log(recipe_listData)
        if (recipe_listData['processes']) {
          this.recipe_step_id = recipe_listData['processes']['id']
          // 超温最短时间、进胶最低温度...
          this.mini_time = (recipe_listData['processes']['mini_time'])
          this.mini_temp = (recipe_listData['processes']['mini_temp'])
          this.over_temp = (recipe_listData['processes']['over_temp'])
          this.batching_error = (recipe_listData['processes']['batching_error'])
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
          this.use_flag = recipe_listData['processes']['use_flag']
          this.ch_time = recipe_listData['processes']['ch_time']
          this.dj_time = recipe_listData['processes']['dj_time']
          this.ld_time = recipe_listData['processes']['ld_time']
          for (var i = 0; i < recipe_listData['process_details'].length; ++i) {
            this.RecipeMaterialList.push({
              // sn: this.RecipeMaterialList.length + 1,
              sn: recipe_listData['process_details'][i]['sn'],
              condition: recipe_listData['process_details'][i]['condition'],
              time: this.step_type_conversion(recipe_listData['process_details'][i]['time']),
              temperature: this.step_type_conversion(recipe_listData['process_details'][i]['temperature']),
              energy: this.step_type_conversion(recipe_listData['process_details'][i]['energy']),
              power: this.step_type_conversion(recipe_listData['process_details'][i]['power']),
              action: recipe_listData['process_details'][i]['action'],
              pressure: this.step_type_conversion(recipe_listData['process_details'][i]['pressure']),
              rpm: this.step_type_conversion(recipe_listData['process_details'][i]['rpm'])
            })
          }
        }
        this.RecipeMaterialList = this.RecipeMaterialList.sort(this.compareSn)
        this.isNormalRecipe = this.$route.params.isNormalRecipe
        if (this.isNormalRecipe) {
          this.generateRecipeForm.SelectSite = this.$route.params['site']
          this.generateRecipeForm.SelectSITE = this.$route.params['SITE']
          this.generateRecipeForm.SelectStage = this.$route.params['selectStage']
          this.generateRecipeForm.SelectRecipeNo = this.$route.params['selectRecipeNo']
          this.generateRecipeForm.version = this.$route.params['version']
          this.generateRecipeForm.scheme = this.$route.params['scheme']
          this.generateRecipeName()
          var app = this
          timer = setInterval(function() {
            app.generateRecipeName()
          }, 3000)
        } else {
          this.generateRecipeForm.stage_product_batch_no = this.$route.params['stage_product_batch_no']
          this.recipeNameChange()
        }
        this.loading = false
        return recipe_listData
      } catch (e) { throw new Error(e) }
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
      } catch (e) { e }
    },
    async material_type_list() {
      try {
        const material_type_list = await material_type_url('get', {
          params: { all: 1, class_name: '原材料类别' }
        })
        this.materialTypeOptions = material_type_list.results
      } catch (e) { throw new Error(e) }
    },
    async condition_list() {
      try {
        const condition_list = await condition_url('get', {
          params: {}
        })
        this.SelectConditionOptions = condition_list.results
      } catch (e) { throw new Error(e) }
    },
    async action_list() {
      try {
        const action_list = await action_url('get', {
          params: {}
        })
        this.SelectActionOptions = action_list.results
      } catch (e) { throw new Error(e) }
    },
    // async recipe_process_step_list(id, equip) {
    //   try {
    //     const process_step_listData = await rubber_process_url('get', null, {
    //       params: { product_batching: id, equip: equip }
    //     })
    //     //
    //     console.log('----------------------get--------------------')
    //     console.log(process_step_listData)
    //     this.recipe_step_id = process_step_listData.results[0]['id']
    //     // 超温最短时间、进胶最低温度...
    //     this.mini_time = process_step_listData.results[0]['mini_time']
    //     this.mini_temp = process_step_listData.results[0]['mini_temp']
    //     this.over_temp = process_step_listData.results[0]['over_temp']
    //     this.batching_error = process_step_listData.results[0]['batching_error']
    //     this.zz_temp = process_step_listData.results[0]['zz_temp']
    //     this.xlm_temp = process_step_listData.results[0]['xlm_temp']
    //     this.cb_temp = process_step_listData.results[0]['cb_temp']
    //     // 炼胶超时时间、进胶最高温度...
    //     this.over_time = process_step_listData.results[0]['over_time']
    //     this.max_temp = process_step_listData.results[0]['max_temp']
    //     this.reuse_time = process_step_listData.results[0]['reuse_time']
    //     this.reuse_flag = process_step_listData.results[0]['reuse_flag']
    //     this.temp_use_flag = process_step_listData.results[0]['temp_use_flag']
    //     this.sp_num = process_step_listData.results[0]['sp_num']
    //     this.use_flag = process_step_listData.results[0]['use_flag']
    //     console.log('====================2222')
    //     console.log(process_step_listData.results)
    //     console.log('====================2222')
    //     for (var i = 0; i < process_step_listData.results[0]['process_details'].length; ++i) {
    //       console.log('====================333333')
    //       console.log(process_step_listData.results[0]['process_details'][i])
    //       this.RecipeMaterialList.push({
    //         sn: this.RecipeMaterialList.length + 1,
    //         condition: process_step_listData.results[0]['process_details'][i]['condition'],
    //         time: process_step_listData.results[0]['process_details'][i]['time'],
    //         temperature: process_step_listData.results[0]['process_details'][i]['temperature'],
    //         energy: process_step_listData.results[0]['process_details'][i]['energy'],
    //         power: process_step_listData.results[0]['process_details'][i]['power'],
    //         action: process_step_listData.results[0]['process_details'][i]['action'],
    //         pressure: process_step_listData.results[0]['process_details'][i]['pressure'],
    //         rpm: process_step_listData.results[0]['process_details'][i]['rpm']
    //       })
    //     }
    //   } catch (e) { e }
    // },

    async popup_material_list(id) {
      try {
        const popup_materialData = await recipe_list('get', id)
        return popup_materialData
      } catch (e) { throw new Error(e) }
    },

    async put_recipe_list(id, obj) {
      try {
        const recipe_listData = await recipe_list('put', id, obj)
        return recipe_listData
      } catch (e) { throw new Error(e) }
    },
    async put_recipe_info_step_list(id, obj) {
      try {
        const recipe_info_step_list = await rubber_process_url('put', id, obj)
        return recipe_info_step_list
      } catch (e) { throw new Error(e) }
    },
    async post_recipe_info_step_list(obj) {
      try {
        // const recipe_info_step_list = await rubber_process_url('post', null, obj)
      } catch (e) { throw new Error(e) }
    },

    modify_material_button: async function() {
      this.dialogRubberMaterialStandard = true
      if (this.confirm_recipe_list['production_time_interval']) {
        this.production_time_interval = this.confirm_recipe_list['production_time_interval']
      } else {
        this.production_time_interval = undefined
      }
      this.ProductRecipe = []
      for (var i = 0; i < this.confirm_recipe_list['batching_details'].length; ++i) {
        this.ProductRecipe.push({
          sn: this.ProductRecipe.length + 1,
          material: this.confirm_recipe_list['batching_details'][i]['material'],
          material_type: this.confirm_recipe_list['batching_details'][i]['material_type'],
          auto_flag: this.confirm_recipe_list['batching_details'][i]['auto_flag'],
          material_name: this.confirm_recipe_list['batching_details'][i]['material_name'],
          actual_weight: this.confirm_recipe_list['batching_details'][i]['actual_weight'],
          standard_error: this.confirm_recipe_list['batching_details'][i]['standard_error']
        })
      }
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

    materialTypeChange: function() {
      this.raw_material_list()
    },
    search_material_no_Change: function() {
      this.raw_material_list()
    },
    search_material_name_Change: function() {
      this.raw_material_list()
    },

    delete_recipe_step: function() {

    },
    pop_up_raw_material: function(material_ele, index) {
      this.raw_material_index = index
      this.dialogRawMaterialSync = true
      this.raw_material_list()
    },
    pagehandleCurrentChange: function(val) {
      this.currentRow = val
      this.raw_material_list(val)
    },
    handleMaterialSelect(row) {
      if (this.rubberRow) {
        // if (row.material_type_name === '炭黑' || row.material_type_name === '油料') {
        //   this.$message('非法选择')
        //   return
        // }
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
      // 循环整个表格
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
      //   console.log('------------------c------------')
      //   console.log(this.ProductRecipe, this.batching_details_list)
      this.dialogRubberMaterialStandard = false
      this.confirm_recipe_list['production_time_interval'] = this.production_time_interval
      this.confirm_recipe_list['batching_details'] = this.batching_details_list
      this.carbon_tableData = []
      this.oil_tableData = []
      this.rubber_tableData = []
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
    },
    // saveMaterialClicked: async function() {
    //   // 循环整个表格
    //   console.log('------------------b------------')
    //   console.log(this.ProductRecipe)
    //   for (var i = 0; i < this.ProductRecipe.length; ++i) {
    //     // 只有原材料和实际重量两个必选项都填写时，才能往batching_details_list中push
    //     if (this.ProductRecipe[i].material_name && this.ProductRecipe[i].actual_weight) {
    //       var now_stage_material = {
    //         sn: i + 1,
    //         // auto_flag: app.ProductRecipe[i].auto_flag,
    //         auto_flag: 0,
    //         material: this.ProductRecipe[i].material,
    //         actual_weight: this.ProductRecipe[i].actual_weight.toFixed(2),
    //         standard_error: this.ProductRecipe[i].standard_error.toFixed(2),
    //         material_name: this.ProductRecipe[i].material_name,
    //         material_type: this.ProductRecipe[i].material_type
    //       }
    //       this.batching_details_list.push(now_stage_material)
    //     } else {
    //       this.$message({
    //         message: '必填字段不能为空',
    //         type: 'error'
    //       })
    //       return
    //     }
    //   }
    //   this.dialogRubberMaterialStandard = false
    //   this.carbon_tableData = []
    //   this.oil_tableData = []
    //   this.rubber_tableData = []
    //   for (var j = 0; j < this.batching_details_list.length; ++j) {
    //     var v_auto_falg = ''
    //     if (this.batching_details_list[j]['auto_flag'] === 1) {
    //       v_auto_falg = '自动'
    //     } else if (this.batching_details_list[j]['auto_flag'] === 2) {
    //       v_auto_falg = '手动'
    //     } else {
    //       v_auto_falg = '其他'
    //     }
    //     if (this.batching_details_list[j]['material_type'] === '炭黑') {
    //       this.carbon_tableData.push({
    //         sn: this.carbon_tableData.length + 1,
    //         auto_flag: v_auto_falg,
    //         material_name: this.batching_details_list[j]['material_name'],
    //         actual_weight: this.batching_details_list[j]['actual_weight'],
    //         standard_error: this.batching_details_list[j]['standard_error']
    //       })
    //     } else if (this.batching_details_list[j]['material_type'] === '油料') {
    //       this.oil_tableData.push({
    //         sn: this.oil_tableData.length + 1,
    //         action_name: '投料',
    //         auto_flag: v_auto_falg,
    //         material_name: this.batching_details_list[j]['material_name'],
    //         actual_weight: this.batching_details_list[j]['actual_weight'],
    //         standard_error: this.batching_details_list[j]['standard_error']
    //       })
    //     } else {
    //       this.rubber_tableData.push({
    //         sn: this.rubber_tableData.length + 1,
    //         action_name: '投料',
    //         auto_flag: v_auto_falg,
    //         material_name: this.batching_details_list[j]['material_name'],
    //         actual_weight: this.batching_details_list[j]['actual_weight'],
    //         standard_error: this.batching_details_list[j]['standard_error']
    //       })
    //     }
    //   }
    // },
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
    async postRecipeList() {
      const arr = this.SelectEquipOptions.filter(d => d.id === this.generateRecipeForm.SelectEquip)
      const _equip_no = arr[0] ? arr[0].equip_no : '' // z04可以不用选步序
      if (this.RecipeMaterialList.length === 0 && _equip_no !== 'Z04') {
        this.$message({
          message: '密炼步序不能为空',
          type: 'error'
        })
        return
      }
      let _breakbulk = false // 记录开卸料门得索引
      let _conditional = false // 记录条件得索引
      const _oilNums = [0, 0] // 油料数量
      const _carbonNums = [0, 0] // 炭黑数量
      let multipleDoor = 0 // 开卸料门次数
      let carbonIndex = false
      let oilIndex = false
      let _val_w = ''
      let _val_w1 = ''
      var step_details_list = []
      if (this.oil_tableData1.length) {
        this.oil_tableData1.some(d => { d.line_no = 2 })
      }
      if (this.oil_tableData.length) {
        this.oil_tableData.some(d => { d.line_no = 1 || !d.line_no })
      }
      const oil_tableDataArr = [...this.oil_tableData, ...this.oil_tableData1]

      // 循环整个表格
      for (var i = 0; i < this.RecipeMaterialList.length; ++i) {
        // 只有步序的所有字段都填时，才能往step_details_list中push
        // if (this.RecipeMaterialList[i].temperature && this.RecipeMaterialList[i].energy && this.RecipeMaterialList[i].power && this.RecipeMaterialList[i].action && this.RecipeMaterialList[i].pressure && this.RecipeMaterialList[i].rpm) {
        if (this.RecipeMaterialList[i].action || _equip_no === 'Z04') {
          if (_equip_no !== 'Z04') {
            const _arr_w = this.SelectActionOptions.filter(d => d.id === this.RecipeMaterialList[i].action) // 动作
            const _arrC_w = this.SelectConditionOptions.filter(d => d.id === this.RecipeMaterialList[i].condition) // 条件
            if (_arr_w.length) {
              this.RecipeMaterialList[i].actionName = _arr_w[0].action
            }
            if (_arrC_w.length) {
              this.RecipeMaterialList[i].conditionName = _arrC_w[0].condition
            }

            if (this.RecipeMaterialList[i].actionName === '开卸料门') {
              _breakbulk = i
              multipleDoor++
            }
            if (this.RecipeMaterialList[i].condition &&
            !['同时执行', '配方结束'].includes(this.RecipeMaterialList[i].conditionName)) {
              _conditional = i
            }

            if (this.RecipeMaterialList[i].actionName) {
              _oilNums[1] += this.RecipeMaterialList[i].actionName.split('油').length - 1
              _carbonNums[1] += this.RecipeMaterialList[i].actionName.split('炭黑').length - 1
            }
          }

          var sn = i + 1
          if (this.RecipeMaterialList[i].sn !== '') {
            sn = this.RecipeMaterialList[i].sn
          } else if (this.RecipeMaterialList[i - 1] && this.RecipeMaterialList[i - 1] !== '') {
            sn = this.RecipeMaterialList[i - 1].sn + 1
          }
          // var sn = this.RecipeMaterialList[i].sn !== ''
          //   ? this.RecipeMaterialList[i].sn :
          var now_recipe_step = {
            sn,
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
      if ((_breakbulk !== false && _breakbulk <= _conditional) || (_breakbulk && _conditional === false)) {
        _val_w = '必须要在最后一个 "条件" 之后，才能开卸料门'
      }
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
          if (this.carbon_tableData[j].material_name.indexOf('卸料') > -1 && _equip_no !== 'Z04') {
            _carbonNums[0]++
            carbonIndex = j
          }
          var now_stage_material_ = {
            sn: this.carbon_tableData[j].sn,
            auto_flag: 0,
            material: this.carbon_tableData[j].material,
            actual_weight: this.carbon_tableData[j].actual_weight ? this.carbon_tableData[j].actual_weight : 0,
            standard_error: this.carbon_tableData[j].standard_error,
            type: 2,
            tank_no: this.carbon_tableData[j].tank_no
          }
          batching_details_list.push(now_stage_material_)
        }
        for (j = 0; j < oil_tableDataArr.length; ++j) {
          if (!oil_tableDataArr[j].material) {
            continue
          }
          if (oil_tableDataArr[j].material_name.indexOf('卸料') > -1 && _equip_no !== 'Z04') {
            _oilNums[0]++
            oilIndex = j
          }
          var now_stage_material__ = {
            sn: oil_tableDataArr[j].sn,
            auto_flag: 0,
            material: oil_tableDataArr[j].material,
            actual_weight: oil_tableDataArr[j].actual_weight ? oil_tableDataArr[j].actual_weight : 0,
            standard_error: oil_tableDataArr[j].standard_error,
            type: 3,
            tank_no: oil_tableDataArr[j].tank_no,
            line_no: oil_tableDataArr[j].line_no
          }
          batching_details_list.push(now_stage_material__)
        }
        if (_breakbulk !== false && (!this.RecipeMaterialList[_breakbulk + 1] || this.RecipeMaterialList[_breakbulk + 1].actionName !== '保持')) {
          this.$message("'开卸料门'下一列动作只能选择'保持'")
          return
        }
        if (multipleDoor > 1) {
          this.$message("请选择1个'开卸料门'")
          return
        }
        if (carbonIndex !== false && (!this.carbon_tableData[carbonIndex - 1] || this.carbon_tableData[carbonIndex - 1].material_name.indexOf('卸料') > -1)) {
          this.$message('炭黑称量中，卸料前请选择其他炭黑')
          return
        }
        if (oilIndex !== false && (!oil_tableDataArr[oilIndex - 1] || oil_tableDataArr[oilIndex - 1].material_name.indexOf('卸料') > -1)) {
          this.$message('油料称量中，卸料前请选择其他油料')
          return
        }
        if (_oilNums[0] !== _oilNums[1] || _carbonNums[0] !== _carbonNums[1]) {
          _val_w1 = '称量列表中的卸料次数，需要和步序里的次数匹配'
        }
        if (_val_w || _val_w1) {
          try {
            await this.$confirm(
              `<h2 style="color:red;">${_val_w}${_val_w && _val_w1 ? '；' : ''}${_val_w1}, 是否继续? </h2>`,
              '提示',
              {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
            )
          } catch (e) {
            return
          }
        }
        recipe_list('post', null, {
          data: {
            'factory': this.generateRecipeForm['SelectSite'],
            'site': this.isNormalRecipe ? this.generateRecipeForm['SelectSITE'] : null,
            'product_info': this.isNormalRecipe ? this.generateRecipeForm['SelectRecipeNo'] : null,
            'precept': this.generateRecipeForm['scheme'],
            'stage_product_batch_no': this.isNormalRecipe ? null : this.stage_product_batch_no,
            'stage': this.isNormalRecipe ? this.generateRecipeForm['SelectStage'] : null,
            'versions': this.isNormalRecipe ? this.generateRecipeForm['version'] : null,
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
              ch_time: this.ch_time,
              dj_time: this.dj_time,
              ld_time: this.ld_time,
              // 设备id与配方id
              'equip': this.$route.params['copy_equip_id'],
              'product_batching': null
            }
          }
        }).then(response => {
          this.$message({
            message: this.stage_product_batch_no + '配方复制成功',
            type: 'success'
          })
          this.$router.push({ name: 'RecipeList' })
        })
      } else {
        this.$message({
          message: '收皮信息不能为空',
          type: 'error'
        })
      }
    },
    recipe_save_return: async function() {
      if (this.isNormalRecipe) {
        this.$refs['generateRecipeForm'].validate(valid => {
          if (valid) {
            this.postRecipeList()
          } else {
            return false
          }
        })
      } else {
        this.$refs['generateRecipeForm'].validateField('stage_product_batch_no', error => {
          if (!error) {
            this.postRecipeList()
          } else {
            return false
          }
        })
      }
    },
    recipe_return_list: function() {
      this.$router.push({ name: 'RecipeList' })
    },
    sp_numFormatter: function() {
      return this.sp_numChoice(this.sp_num)
    },
    sp_numChoice: function(sp_num_ele) {
      switch (sp_num_ele) {
        case 1:
          return '1车/托'
        case 2:
          return '2车/托'
        case 3:
          return '3车/托'
        case 4:
          return '4车/托'
        case 5:
          return '5车/托'
      }
    },
    materialChange(id, index, materialList, arrList) {
      const Obj = materialList[id]
      this.$set(arrList[index], 'tank_no', Obj.tank_no)
      this.$set(arrList[index], 'provenance', Obj.provenance)
      this.$set(arrList[index], 'material', Obj.id)
      this.$set(arrList[index], 'material_name', Obj.material_name)
    },
    SelectEquipChange1() {
      this.$set(this.formData, 'recipe_no', null)
      this.selectRecipeDisplay()
    },
    async SelectEquipDisplay1() {
      try {
        const equip_list = await equip_url('get', {
          params: { category_name: '密炼设备' }
        })
        this.SelectEquipOptions = equip_list.results || []
      } catch (e) { throw new Error(e) }
    },
    async selectRecipeDisplay() {
      try {
        const data = await productbatching('get', {
          params: { equip_id: this.formData.equip_id, all: 1 }
        })
        this.SelectRecipeOptions = data.results || []
        const obj = this.SelectRecipeOptions.find(d => d.stage_product_batch_no === this.stage_product_batch_no)
        if (obj) {
          this.$set(this.formData, 'recipe_no', this.stage_product_batch_no)
        }
      } catch (e) { throw new Error(e) }
    },
    replicationProcessDialog() {
      this.dialogVisible = true
    },
    handleClose(done) {
      this.dialogVisible = false
      this.formData = {}
      if (done) {
        done()
      }
    },
    async submitBtn() {
      if (!this.formData.equip_id || !this.formData.recipe_no) {
        this.$message('请选择机台和配方')
        return
      }
      try {
        this.loadingBtn = true
        const data = await productTechParams({ equip_id: this.formData.equip_id, recipe_no: this.formData.recipe_no })
        console.log(data, 'data')
        this.generateRecipeForm.SelectEquip = this.formData.equip_id
        this.mini_time = data.process_data.mini_time
        this.mini_temp = data.process_data.mini_temp
        this.over_temp = data.process_data.over_temp
        this.batching_error = data.process_data.batching_error
        this.zz_temp = data.process_data.zz_temp
        this.xlm_temp = data.process_data.xlm_temp
        this.cb_temp = data.process_data.cb_temp
        this.over_time = data.process_data.over_time
        this.max_temp = data.process_data.max_temp
        this.reuse_time = data.process_data.reuse_time
        this.reuse_flag = data.process_data.reuse_flag
        this.temp_use_flag = data.process_data.temp_use_flag
        this.sp_num = data.process_data.sp_num
        this.use_flag = data.process_data.use_flag
        this.ch_time = data.process_data.ch_time
        this.dj_time = data.process_data.dj_time
        this.ld_time = data.process_data.ld_time

        if (data.process_detail_data && data.process_detail_data.length) {
          this.RecipeMaterialList = data.process_detail_data
        }
        this.$message.success('复制成功')
        this.handleClose(false)
      } catch (e) {
        //
      }
      this.loadingBtn = false
    }
  }
}
</script>

<style lang="scss">
.recipe_modify{
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
