<template>
      <el-button type="text" @click="downloadDetail" :loading="allListLoading">批量下载清单文件</el-button>

</template>

<script>
import downLoadFileCheck from "./downLoadFileCheck";

export default {
  data() {
    return {
      allListLoading: false,
   
    };
  },
  mounted() {
  
  },
  methods: {
    // 批量下载清单-压缩包
    downloadDetail() {
      let params = {
        id: '1234'
      };
      let url = "/testdownload/AllList";
      this.allListLoading = true;
      this.$axios
        .post(url, params, { responseType: "blob" })
        .then(res => {
          downLoadFileCheck(res);
          this.allListLoading = false;
        })
        .catch(error => {
          this.$message.error("网络连接错误");
          this.allListLoading = false;
        });
    },
   }
};
</script>

