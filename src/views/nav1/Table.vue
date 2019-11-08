<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="接口名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUsers">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="users"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="id" width="60"></el-table-column>
      <el-table-column prop="name" label="聚合接口名称" width="120" sortable></el-table-column>
      <!-- <el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
      </el-table-column>-->
      <el-table-column prop="status" label="状态" width="100" :formatter="formatSex" sortable></el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="ace-container">
      <div class="ace-editor" ref="ace"></div>
    </div>-->

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="20"
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="聚合接口名称" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="urlAdd">新增</el-button>
        </el-form-item>
        <el-form-item>
          <table border="1" class="tables" cellspacing="0" cellpadding="0">
            <tr>
              <td>url</td>
              <td>请求方法</td>
              <td>参数</td>
              <td>body</td>
              <td>操作</td>
            </tr>
            <tbody>
              <tr v-for="(item,index) in urlList" :key="index">
                <td>
                  <el-input v-model="item.url" placeholder="请输入url"></el-input>
                </td>
                <td>
                  <el-select v-model="item.value" placeholder="请选方法">
                    <el-option
                      :label="item.name"
                      :value="item.value"
                      v-for="(item,index) in methodsList"
                      :key="index"
                    ></el-option>
                  </el-select>
                </td>
                <td>
                  <el-input v-model="item.params" placeholder="请输入参数"></el-input>
                </td>
                <td @click="bodyDetail(index)">{{item.body}}</td>
                <td>
                  <el-button type="info" @click="urlEdit">保存</el-button>
                  <el-button type="danger" @click="urlDelete(index)">删除</el-button>
                </td>
              </tr>
            </tbody>
          </table>
        </el-form-item>
        <!-- <el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="聚合接口名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="addForm.status">
            <el-radio class="radio" :label="1">开启</el-radio>
            <el-radio class="radio" :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 编辑body结构 -->
    <el-dialog title="编辑结构" :visible.sync="editBodyVisible" :close-on-click-modal="false">
      <el-form :model="editBody" label-width="80px" :rules="editBodyRules" ref="editBody">
        <div class="ace-container">
          <div class="ace-editor" ref="ace"></div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editBodyVisible = false">取消</el-button>
        <el-button @click="saveBodyItem" type="primary">保存</el-button>
        <el-button @click="validateError" type="primary">预览</el-button>
      </div>
    </el-dialog>

    <!-- 编辑body结构 -->
    <el-dialog></el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
import ace from "ace-builds";
import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/snippets/html";
import "ace-builds/src-noconflict/snippets/css";
import "ace-builds/src-noconflict/snippets/scss";
import "ace-builds/src-noconflict/snippets/json";
import "ace-builds/src-noconflict/snippets/java";
import "ace-builds/src-noconflict/snippets/text";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-javascript";
import axios from 'axios'
//import NProgress from 'nprogress'
// import $ from "jquery";
import {
  getUserListPage,
  removeUser,
  batchRemoveUser,
  editUser,
  addUser,
  getList
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        name: ""
      },
      urlList: [
        { url: "qwe/add", methods: "get", params: "", body: { ds: 1 } }
      ],
      methodsList: [
        { name: "get", value: "get" },
        { name: "post", value: "post" },
        { name: "delete", value: "delete" }
      ],
      users: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入接口名称", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        id: 0,
        name: "",
        sex: -1,
        age: 0,
        birth: "",
        addr: ""
      },

      addFormVisible: false, //新增界面是否显示
      editBodyVisible: false, //编辑界面
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入接口名称", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        name: "",
        sex: -1,
        age: 0,
        birth: "",
        addr: ""
      },
      //body结构编辑
      errorArray: [],
      aceEditor: null,
      wrap: true,
      themePath: "ace/theme/monokai",
      modePath: "ace/mode/json",
      editBody: {},
      currentIndex: 0,
      editBodyRules: {}
    };
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.status == 1 ? "开启" : row.status == 0 ? "关闭" : "未知";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    //
    getLists() {
      console.log('getList=======>');
      
      getList('').then(res=>{
        console.log('res--------------->',res);
        
      }).catch(err=>{
        console.log('err------------>',err.response);
        
      })
      
    },
    //获取用户列表
    getUsers() {
      let para = {
        page: this.page,
        name: this.filters.name
      };
      this.listLoading = true;
      //NProgress.start();
      getUserListPage(para).then(res => {
        
        
        res = {
          data: {
            users: [
              { id: 1, name: "接口1", status: 1 },
              { id: 2, name: "接口2", status: 0 },
              { id: 3, name: "接口3", status: 1 },
              { id: 4, name: "接口4", status: 0 },
              { id: 5, name: "接口5", status: 1 }
            ],
            total: 5
          }
        };
        this.total = res.data.total;
        this.users = res.data.users;
        this.listLoading = false;
        //NProgress.done();
      }).catch(err=>{
        console.log('getUserListPage',err.response);
      });
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { id: row.id };
          removeUser(para).then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getUsers();
          });
        })
        .catch(() => {});
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      console.log('index----》',index);
      
      this.editFormVisible = true;
      console.log('this.editFormVisible-----》',this.editFormVisible);
      
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        name: "",
        sex: -1,
        age: 0,
        birth: "",
        addr: ""
      };
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);
            para.birth =
              !para.birth || para.birth == ""
                ? ""
                : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");
            editUser(para).then(res => {
              this.editLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.getUsers();
            });
          });
        }
      });
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            para.birth =
              !para.birth || para.birth == ""
                ? ""
                : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");
            addUser(para).then(res => {
              this.addLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getUsers();
            });
          });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    //批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { ids: ids };
          batchRemoveUser(para).then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getUsers();
          });
        })
        .catch(() => {});
    },

    //新增url
    urlAdd: function() {
      this.urlList.push({
        url: "",
        methods: "",
        params: "",
        body: {}
      });
    },
    //删除url
    urlDelete: function(index) {
      this.urlList.splice(index, 1);
    },
    //body detail
    bodyDetail: function(index) {
      console.log('bodyDetail-----》');
      
      (this.currentIndex = index), (this.editBodyVisible = true);
      this.$nextTick(() => {
        this.aceEditor = ace.edit(this.$refs.ace, {
          maxLines: 20,
          minLines: 10,
          fontSize: 14,
          theme: this.themePath,
          mode: this.modePath,
          wrap: this.wrap,
          tabSize: 4
        });
        this.aceEditor.setValue(JSON.stringify(this.urlList[index].body));
      });
    },
    //body结构提交预览
    validateError: function() {
      this.errorArray = document.getElementsByClassName("ace_error");
      if (this.errorArray.length > 0) {
        this.$message({
          message: "请仔细核对格式",
          type: "error"
        });
      }
    },
    //保存编辑的body结构
    saveBodyItem: function() {
      this.urlList[this.currentIndex].body = JSON.parse(
        this.aceEditor.getValue()
      );
    },
    //编辑自接口按钮
    urlEdit: function() {}
  },
  mounted() {
    this.getLists();
    this.getUsers();
  }
};
</script>

<style lang = 'scss' scoped>
.tables {
  border-collapse: collapse;
  text-align: center;
  width: 100%;
}
tr {
  width: 100%;
}
th tr {
  width: 100%;
}
tr td {
  width: 20%;
}
.ace-container {
  position: relative;

  .config-panel {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 50%;
    height: 100%;
    overflow: scroll;
    box-shadow: grey -5px 2px 3px;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 1;

    .item {
      margin: 10px auto;
      text-align: center;

      .title {
        color: white;
        margin: 0 10px;
        font-size: 14px;
      }
    }
  }

  .bookmarklet {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 20px;
    height: 20px;
    z-index: 2;
    cursor: pointer;
    border-width: 9px;
    border-style: solid;
    border-color: lightblue gray gray rgb(206, 173, 230);
    border-image: initial;
  }
}
</style>