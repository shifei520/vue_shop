<template>
  <div class="add">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 消息提示 -->
      <el-alert title="添加商品信息" type="info" show-icon center> </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :active="parseInt(activeIndex)"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="商品完成"></el-step>
      </el-steps>
      <!-- 左侧标签页导航 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          type="border-card"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateListArr"
                :props="cascaderProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="value"
                  v-for="(value, index) in item.attr_vals"
                  :key="index"
                  border
                >
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 图片上传 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="picResponse"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>

            <!-- 添加商品按钮 -->
            <el-button type="primary" class="btnAdd" @click="addGoodsFunc"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片对话框 -->
    <el-dialog title="提示" :visible.sync="PicDialogVisible" width="50%">
      <img :src="currentPicURL" alt="" class="prev-pic" />
    </el-dialog>
  </div>
</template>

<script>
// 网络请求相关函数
import { categoryList, paramsList, addGoods } from 'network/request_data.js'
export default {
  name: 'Add',
  data() {
    return {
      // 步骤条进度
      activeIndex: '0',
      // 添加商品表单数据
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: [],
      },
      // 表单验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
      },
      // 商品分类列表
      cateListArr: [],
      // 商品分类列表展示相关参数
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 参数列表数据
      manyTableData: [],
      // 属性列表数据
      onlyTableData: [],
      // 图片提交地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 提交图片时附加上token地址
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      // 当前预览图片地址
      currentPicURL: '',
      // 控制预览图片对话的显示与隐藏
      PicDialogVisible: false,
    }
  },
  created() {
    this.getCategoryList()
  },
  computed: {
    CateId() {
      if (this.addForm.goods_cat !== []) {
        return this.addForm.goods_cat[2]
      } else {
        return null
      }
    },
  },
  methods: {
    // 获取商品分类数据
    getCategoryList() {
      categoryList().then((res) => {
        if (res.meta.status === 200) {
          this.cateListArr = res.data
        }
      })
    },
    // 商品分类改变时触发函数
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 离开标签页时触发事件
    beforeTabLeave(activeName, oldName) {
      if (oldName === '0' && this.addForm.goods_cat.length === 0) {
        this.$message.error('请输入商品分类')
        return false
      }
    },
    // 标签页点击事件
    tabClick() {
      // 点击商品参数标签触发
      if (this.activeIndex === '1') {
        paramsList(this.CateId, 'many').then((res) => {
          if (res.meta.status === 200) {
            res.data.forEach((item) => {
              item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            })
            this.manyTableData = res.data
          }
        })
      }
      // 点击商品属性标签触发
      if (this.activeIndex === '2') {
        paramsList(this.CateId, 'only').then((res) => {
          if (res.meta.status === 200) {
            this.onlyTableData = res.data
          }
        })
      }
    },
    // 图片预览事件
    handlePreview(file) {
      this.currentPicURL = file.response.data.url
      this.PicDialogVisible = true
    },
    // 图片移除事件
    handleRemove(file) {
      const tmp_path = file.response.data.tmp_path
      // 获取当前文件在数组中的索引
      const index = this.addForm.pics.findIndex(
        (value) => value.pic === tmp_path
      )

      this.addForm.pics.splice(index, 1)
    },
    // 图片上传成功时返回response
    picResponse(res) {
      if (res.meta.status === 200) {
        const picPath = res.data.tmp_path
        const obj = { pic: picPath }
        this.addForm.pics.push(obj)
      }
    },
    // 深拷贝函数
    deepClone(obj) {
      const newObj = obj.constructor === Array ? [] : {}
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] == 'object') {
            newObj[key] = obj[key].constructor === Array ? [] : {}
            newObj[key] = this.deepClone(obj[key])
          } else {
            newObj[key] = obj[key]
          }
        }
      }
      return newObj
    },
    // 添加商品
    addGoodsFunc() {
      this.$refs.addFormRef.validate((boolean) => {
        if (!boolean) return this.$message.error('请输入完成的表单项')
        const form = this.deepClone(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 获取商品参数
        this.manyTableData.forEach((item) => {
          const itemAttrs = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          this.addForm.attrs.push(itemAttrs)
        })
        this.onlyTableData.forEach((item) => {
          const itemAttrs = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          this.addForm.attrs.push(itemAttrs)
        })
        form.attrs = this.addForm.attrs

        addGoods(form).then((res) => {
          if (res.meta.status !== 201)
            return this.$message.error('添加商品失败')
          this.$message.success('添加商品成功')
          this.$router.push('/goods')
        })
      })
    },
  },
}
</script>

<style lang="less" scoped>
.add {
  padding: 20px;
  .el-steps {
    margin: 20px;
  }
  .el-checkbox {
    margin: 0 15px 0 0 !important;
  }
  .prev-pic {
    width: 100%;
  }
}
.btnAdd {
  margin-top: 20px;
}
</style>