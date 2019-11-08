<template>
 
    <div id="jsoneditor" style="width: 600px;height: 400px;"></div>
  
</template>
<script>
// let container = document.getElementById("jsoneditor");
// let json = {
//   Array: [1, 2, 3],
//   Boolean: true,
//   Null: null,
//   Number: 123,
//   Object: { a: "b", c: "d" },
//   String: "Hello World"
// };
// let options = {
//   mode: "text",
//   indentation: 2,
//   search: true
// };
// let editor = new this.$jsoneditor(container, options);
// editor.set(json);
import Vue from 'vue'
export default {
  data() {
    return {
      json: {
        "Array": [1, 2, 3],
            "Boolean": true,
            "Null": null,
            "Number": 123,
            "Object": {"a": "b", "c": "d"},
            "String": "Hello World",
      },
      options: {
		mode: "view",
		// mode: "mode",
		modes: ['code','text','view','tree'],
        // indentation: 2,
		search: true,
		theme: 'jqueryui'
      }
    };
  },
  methods: {
	  initEdit(){
		console.log('this===>',this);
		let container = document.getElementById('jsoneditor')
        let jsons = [
            {
                "name":"Header Parameters",
                "children":
                    [
                        {
                            "name":"Accept",
                            "dataType":"string",
                            "required":true,
                            "defaultValue":"*/*",
                            "description":"允许接受的类型"
                        }
                    ]
            },
            {
                "name":"Body Parameters",
                "children":[
                    {
                        "name":"username",
                        "dataType":"string",
                        "required":true,
                        "defaultValue":"zhangsan",
                        "description":"用户名"
                    },{
                        "name":"duixiang",
                        "dataType":"object",
                        "required":true,
                        "defaultValue":"",
                        "description":"对象",
                        "children":[
                            {
                                "name":"childName",
                                "dataType":"string",
                                "required":true,
                                "defaultValue":"lisi",
                                "description":"孩子名"
                            },
                            {
                                "name":"childAge",
                                "dataType":"int",
                                "required":true,
                                "defaultValue":"10",
                                "description":"密码"
                            }
                        ]
                      },{
                          "name":"shuzu",
                          "dataType":"array",
                          "required":true,
                          "defaultValue":"",
                          "description":"数组",
                          "children":[
                            {
                                "name":"childNumber",
                                "dataType":"int",
                                "required":true,
                                "defaultValue":"10",
                                "description":"孩子号"
                            }
                          ]
                      }
                  ]
              }
          ]
        let options = {
            mode: 'code',
            modes: ['code'],
            onError: function(err) {
                alert(err.toString());
            }
        }
        var codeEditor = new this.$jsoneditor(container, this.options);
        codeEditor.set(this.json)
	  }
  },
  mounted() {
    this.initEdit();
  }
};
</script>

<style scoped>
.jsoneditor-text{
	width:500;
	height:500,
}
</style>