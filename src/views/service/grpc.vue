<template>
  <div class="mixin-components-container">
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span v-if="is_edit === false">创建GRPC服务</span>
          <span v-if="is_edit === true">更新GRPC服务</span>
        </div>
        <div style="margin-bottom: 50px;">
          <el-form ref="form" :model="form" label-width="140px">
            <el-form-item label="服务名称" class="is-required">
              <el-input v-model="form.service_name" placeholder="6-128位字母数字下划线" :disabled="is_edit===true" />
            </el-form-item>
            <el-form-item label="服务描述" class="is-required">
              <el-input v-model="form.service_desc" placeholder="最多255字符，必填" />
            </el-form-item>
            <el-form-item label="端口" class="is-required">
              <el-input v-model="form.port" :disabled="is_edit===true" placeholder="需要设置8001-8999范围内数字，必填" />
            </el-form-item>
            <el-form-item label="Header转换">
              <el-input v-model="form.header_transfor" type="textarea" autosize placeholder="header转换支持 add(增加)/del(删除)/edit(修改) 格式：add headerName headValue" />
            </el-form-item>
            <el-form-item label="开启验证">
              <el-switch
                v-model="form.open_auth"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
            <el-form-item label="IP白名单">
              <el-input v-model="form.white_list" type="textarea" autosize placeholder="格式：127.0.0.1 多条换行，白名单优先于黑名单" />
            </el-form-item>
            <el-form-item label="IP黑名单">
              <el-input v-model="form.black_list" type="textarea" autosize placeholder="格式：127.0.0.1 多条换行，白名单优先于黑名单" />
            </el-form-item>

            <el-form-item label="客户端限流">
              <el-input v-model="form.clientip_flow_limit" placeholder="0表示无限制" />
            </el-form-item>

            <el-form-item label="服务端限流">
              <el-input v-model="form.service_flow_limit" placeholder="0表示无限制" />
            </el-form-item>

            <el-form-item label="轮询方式">
              <el-radio-group v-model="form.round_type">
                <el-radio :label="0">random</el-radio>
                <el-radio :label="1">round-robin</el-radio>
                <el-radio :label="2">weight_round-robin</el-radio>
                <el-radio :label="3">ip_hash</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="IP列表" class="is-required">
              <el-input v-model="form.ip_list" type="textarea" autosize placeholder="格式：127.0.0.1:80 多条换行" />
            </el-form-item>

            <el-form-item label="权重列表" class="is-required">
              <el-input v-model="form.weight_list" type="textarea" autosize placeholder="格式：50 多条换行" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="disableButton" @click="onSubmit">立即提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { serviceDetail } from '@/api/service'

export default {
  name: 'ServiceList',
  data() {
    return {
      is_edit: false,
      disableButton: false,
      form: {
        port: '',
        service_name: undefined,
        service_desc: '',
        url_rewrite: '',
        header_transfor: '',
        round_type: 2,
        ip_list: '',
        weight_list: '',
        upstream_connect_timeout: '',
        upstream_header_timeout: '',
        upstream_idle_timeout: '',
        upstream_max_idle: '',
        open_auth: 0,
        black_list: '',
        white_list: '',
        clientip_flow_limit: '',
        service_flow_limit: ''
      }
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    console.log(id)
    if (id > 0) {
      this.is_edit = true
      this.fetchData(id)
    }
  },
  methods: {
    fetchData(id) {
      const query = { 'id': id }
      serviceDetail(query).then(response => {
        this.form.service_desc = response.data.info.service_desc
        this.form.service_name = response.data.info.service_name
        this.form.port = response.data.grpc_rule.port
        this.form.black_list = response.data.access_control.black_list.replace(/,/g, '\n')
        this.form.white_list = response.data.access_control.white_list.replace(/,/g, '\n')
        this.form.clientip_flow_limit = response.data.access_control.clientip_flow_limit
        this.form.service_flow_limit = response.data.access_control.service_flow_limit
        this.form.header_transfor = response.data.grpc_rule.header_transfor.replace(/,/g, '\n')
        this.form.ip_list = response.data.load_balance.ip_list.replace(/,/g, '\n')
        this.form.weight_list = response.data.load_balance.weight_list.replace(/,/g, '\n')
        this.form.open_auth = response.data.access_control.open_auth
        this.form.round_type = response.data.load_balance.round_type
        this.form.upstream_connect_timeout = response.data.load_balance.upstream_connect_timeout
        this.form.upstream_header_timeout = response.data.load_balance.upstream_header_timeout
        this.form.upstream_idle_timeout = response.data.load_balance.upstream_idle_timeout
        this.form.upstream_max_idle = response.data.load_balance.upstream_max_idle
        this.form.upstream_max_idle = response.data.load_balance.upstream_max_idle
      }).catch(() => {
      })
    },
    onSubmit() {
    }
  }
}

</script>
