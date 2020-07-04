<template>
  <div class="mixin-components-container">
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span v-if="is_edit === false">创建TCP服务</span>
          <span v-if="is_edit === true">更新TCP服务</span>
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
              <el-button v-if="is_edit===false" type="primary" :loading="disableButton" @click="onSubmit">立即提交</el-button>
              <el-button v-if="is_edit===true" type="primary" :loading="disableButton" @click="onSubmit">立即修改</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { serviceDetail, serviceAddTcp, serviceUpdateTcp } from '@/api/service'

export default {
  name: 'ServiceTcp',
  data() {
    return {
      is_edit: false,
      disableButton: false,
      form: {
        id: 0,
        port: '',
        service_name: '',
        service_desc: '',
        url_rewrite: '',
        round_type: 2,
        ip_list: '',
        weight_list: '',
        white_host_name: '',
        upstream_connect_timeout: '',
        upstream_header_timeout: '',
        upstream_idle_timeout: '',
        upstream_max_idle: '',
        open_auth: 0,
        black_list: '',
        white_list: '',
        clientip_flow_limit: '',
        service_flow_limit: '',
        forbid_list: ''
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
        this.form.id = response.data.info.id
        this.form.service_desc = response.data.info.service_desc
        this.form.service_name = response.data.info.service_name
        this.form.port = response.data.tcp_rule.port.toString()
        this.form.black_list = response.data.access_control.black_list.replace(/,/g, '\n')
        this.form.white_list = response.data.access_control.white_list.replace(/,/g, '\n')
        this.form.clientip_flow_limit = response.data.access_control.clientip_flow_limit
        this.form.service_flow_limit = response.data.access_control.service_flow_limit
        this.form.ip_list = response.data.load_balance.ip_list.replace(/,/g, '\n')
        this.form.weight_list = response.data.load_balance.weight_list.replace(/,/g, '\n')
        this.form.open_auth = response.data.access_control.open_auth.toString()
        this.form.white_host_name = response.data.access_control.white_host_name
        this.form.round_type = response.data.load_balance.round_type
        this.form.forbid_list = response.data.load_balance.forbid_list
        this.form.upstream_connect_timeout = response.data.load_balance.upstream_connect_timeout
        this.form.upstream_header_timeout = response.data.load_balance.upstream_header_timeout
        this.form.upstream_idle_timeout = response.data.load_balance.upstream_idle_timeout
        this.form.upstream_max_idle = response.data.load_balance.upstream_max_idle
        this.form.upstream_max_idle = response.data.load_balance.upstream_max_idle
      }).catch(() => {
      })
    },
    onSubmit() {
      const query = Object.assign([], this.form)
      query.port = Number(query.port)
      // query.rule_type = Number(query.rule_type)
      // query.need_https = Number(query.need_https)
      // query.need_strip_uri = Number(query.need_strip_uri)
      // query.need_websocket = Number(query.need_websocket)
      query.open_auth = Number(query.open_auth)
      query.round_type = Number(query.round_type)
      query.clientip_flow_limit = Number(query.clientip_flow_limit)
      query.service_flow_limit = Number(query.service_flow_limit)
      // query.upstream_connect_timeout = Number(query.upstream_connect_timeout)
      // query.upstream_header_timeout = Number(query.upstream_header_timeout)
      // query.upstream_idle_timeout = Number(query.upstream_idle_timeout)
      // query.upstream_max_idle = Number(query.upstream_max_idle)

      query.ip_list = query.ip_list.replace(/\n/g, ',')
      query.weight_list = query.weight_list.replace(/\n/g, ',')
      query.forbid_list = query.forbid_list.replace(/\n/g, ',')
      query.white_host_name = query.white_host_name.replace(/\n/g, ',')
      query.white_list = query.white_list.replace(/\n/g, ',')
      query.black_list = query.black_list.replace(/\n/g, ',')
      query.url_rewrite = query.url_rewrite.replace(/\n/g, ',')
      if (this.is_edit) {
        console.log(query)
        serviceUpdateTcp(query).then(response => {
          this.disableButton = false
          this.$notify({
            title: 'Success',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
          this.disableButton = false
        })
      } else {
        serviceAddTcp(query).then(response => {
          this.disableButton = false
          this.$notify({
            title: 'Success',
            message: '提交成功',
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
          this.disableButton = false
        })
      }
    }
  }
}

</script>
