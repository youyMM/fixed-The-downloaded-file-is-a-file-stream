/**
 * 转成文件前 校验后端返回数据格式是否正确，正确后再下载
 * @param res  响应信息
 * 要在registerAjax.js的filterUrl里添加下载地址，能获取headers信息
 */
const downLoadFileCheck = res => {
  const resData = res.data;
  const reader = new FileReader();
  reader.onloadend = () => {
    try {
      // 说明是普通对象数据，后台转换失败
      const jsonData = JSON.parse(reader.result);
      // 后台信息
      this.$message.error(jsonData.msg);
    } catch (err) {
      // 解析成对象失败，说明是正常的文件流
      let contentDisposition = res.headers["content-disposition"];
      let type = res.headers["content-type"];
      let name = contentDisposition.split("filename=")[1];
      let fileName = decodeURI(name);
      let blob = new Blob([resData], { type, contentDisposition });
      let downloadElement = document.createElement("a");
      let href = window.URL.createObjectURL(blob); //创建导出表格的链接
      downloadElement.href = href;
      downloadElement.download = fileName; //导出表格后文件名
      document.body.appendChild(downloadElement);
      downloadElement.click(); //点击导出表格
      document.body.removeChild(downloadElement); //导出表格完成移除元素
      window.URL.revokeObjectURL(href); //释放blob对象
    }
  };
  reader.readAsText(resData);
};
export default downLoadFileCheck;
