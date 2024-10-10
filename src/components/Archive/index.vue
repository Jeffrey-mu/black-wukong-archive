
<script setup>
import { welcome, setLocalConfig, getArchiveList, add, getMyArchiveList, useArchive } from '../../api/index'
import Button from '../Button.vue'
import { ref, onMounted } from 'vue'
import 'vue3-toastify/dist/index.css'
import { toast } from 'vue3-toastify'

onMounted(async () => {
  welcome().then(res => {
    console.log(res)
  })
  const localConfig = localStorage.getItem('localConfig')
  if (localConfig) {
    await setLocalConfig(JSON.parse(localConfig))
    configData.value = JSON.parse(localConfig)
  }
  getMyArchiveListFn(true)
})
const constShow = {
  config: false,
  save: false,
  gameArchive: false,
}
const showForm = ref({ ...constShow })
const configData = ref({
  gamePath: '',
  saveDir: '',
  useSave: '',
})
const saveData = ref({
  name: '',
  date: '',
  archivFile: ''
})

const activeName = ref('myArchive')
const gameArchive = ref([])
const myGameArchive = ref([])
function handleClick(type, value = '') {
  showForm.value = { ...constShow }
  if (btnList.some(item => item.key == type)) {
    activeName.value = type
  }
  switch (type) {
    case 'config':
      showForm.value.config = true
      break
    case 'save':
      showForm.value.save = true
      getArchiveList().then(res => {
        if (res.code === 200) {
          let data = res.data.sort((a, b) => b.mtimeMs - a.mtimeMs)
          saveData.value.date = new Date(data[0].mtimeMs).toLocaleString()
          saveData.value.archivFile = data[0].name
        }
      })
      break
    case 'gameArchive':
      showForm.value.gameArchive = true
      getArchiveListFn(true)
      break
    case 'saveConfig':
      if (!configData.value.gamePath || !configData.value.useSave) {
        toast("请输入游戏路径和使用存档 !", {
          type: "error",
          autoClose: 1000,
        })
        showForm.value.config = true
        return
      }
      setLocalConfig(configData._rawValue).then(res => {
        if (res.code === 200) {
          configData.value = res.data
          toast("保存配置成功 !", {
            type: "success",
            autoClose: 1000,
          })
          localStorage.setItem('localConfig', JSON.stringify(configData.value))
        }
      })
      break
    case 'add':
      add({ name: saveData.value.name }).then(res => {
        if (res.code === 200) {
          getMyArchiveListFn()
          toast("保存游戏成功 !", {
            type: "success",
            autoClose: 1000,
          })
        }
      })
      break
    case 'useArchive':
      useArchive({ name: value }).then(res => {
        if (res.code === 200) {
          getArchiveListFn()
          toast("使用存档成功 !", {
            type: "success",
            autoClose: 1000,
          })
        }
      })
      break
    default:
      getMyArchiveListFn(true)
      break
  }
}

function getMyArchiveListFn(showToast = false) {
  getMyArchiveList().then(res => {
    if (res.code === 200) {
      myGameArchive.value = res.data
      showToast && toast("查询我的存档成功 !", {
        type: "success",
        autoClose: 1000,
      })
    }
  })
}
function getArchiveListFn(showToast = false) {
  getArchiveList().then(res => {
    if (res.code === 200) {
      gameArchive.value = res.data
      showToast && toast("查询游戏存档成功 !", {
        type: "success",
        autoClose: 1000,
      })
    }
  })
}
const btnList = [
  {
    name: '我的存档',
    key: 'myArchive'
  },
  {
    name: '游戏存档',
    key: 'gameArchive'
  },
  {
    name: '设置配置',
    key: 'config'
  },
  {
    name: '保存游戏',
    key: 'save'
  }
]
</script>
<template>
  <div class="max_width !mt-5">
    <!-- 操作区 -->
    <div class="py-3 flex gap-5 border-b border-gray-300 mb-4">
      <Button v-for="item in btnList" :key="item.key" :name="item.name" @click="handleClick(item.key)"
        :style="{ backgroundColor: activeName === item.key ? '#111827' : '' }">{{ item.name }}</Button>
    </div>

    <!-- 展示区 -->
    <div>
      <div v-if="showForm.config">
        <form>
          <div class="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label for="gamePath" class="block mb-2 text-sm font-medium text-gray-900 ">游戏路径</label>
              <input type="text" id="gamePath" v-model="configData.gamePath" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="游戏目录"
                required />
            </div>
            <div>
              <label for="saveDir" class="block mb-2 text-sm font-medium text-gray-900 ">存档文件目录</label>
              <input type="text" id="saveDir" v-model="configData.saveDir" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="不可修改仅展示"
                required disabled />
            </div>
            <div>
              <label for="useSave" class="block mb-2 text-sm font-medium text-gray-900 ">使用存档（当您选择使用自定义存档是希望覆盖游戏第几个存档 1 -
                10）</label>
              <input type="text" id="useSave" v-model="configData.useSave" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="当您使用存档文件时，希望从哪个存档开始游戏，输入值1 - 10" required />
            </div>
          </div>
          <Button @click="handleClick('saveConfig')">保存配置</Button>
          <Button @click="showForm.config = false">关闭</Button>
        </form>
      </div>

      <div v-else-if="showForm.save">
        <form>
          <div class="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label for="saveName" class="block mb-2 text-sm font-medium text-gray-900 ">存档说明</label>
              <input type="text" id="saveName" v-model="saveData.name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="存档说明备注"
                required />
            </div>
            <div>
              <label for="lastModified" class="block mb-2 text-sm font-medium text-gray-900 ">最近修改</label>
              <input type="text" id="lastModified" v-model="saveData.date"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="查询本地最新修改时间" required disabled />
            </div>
            <div>
              <label for="lastModified" class="block mb-2 text-sm font-medium text-gray-900 ">使用存档文件</label>
              <input type="text" id="lastModified" v-model="saveData.archivFile"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="查询本地最新修改时间" required disabled />
            </div>
          </div>
          <Button @click="handleClick('add')">保存游戏</Button>
          <Button @click="showForm.save = false">关闭</Button>
        </form>
      </div>

      <div v-else-if="showForm.gameArchive">
        <ul>
          <li v-for="item in gameArchive" :key="item.name"
            class="flex items-center justify-between p-2 border-b border-gray-200">
            <div>
              <span class="font-bold">文件名：</span>
              <span class="text-blue-500">{{ item.name }}</span>
            </div>
            <div class="text-gray-600">
              <span class="mr-4">创建日期：<span class="font-medium">{{ new Date(item.birthtime).toLocaleString()
              }}</span></span>
              <span>修改日期：<span class="font-medium">{{ new Date(item.mtimeMs).toLocaleString() }}</span></span>
            </div>
          </li>
        </ul>
      </div>

      <div v-else>
        <ul>
          <li v-for="item in myGameArchive" :key="item.name"
            class="flex items-center justify-between p-2 border-b border-gray-200">
            <div>
              <span class="font-bold">文件名：</span>
              <span class="text-blue-500">{{ item.name }}</span>
            </div>
            <div class="text-gray-600">
              <span class="mr-4">创建日期：<span class="font-medium">{{ new Date(item.birthtime).toLocaleString()
              }}</span></span>
              <span>修改日期：<span class="font-medium mr-4">{{ new Date(item.mtimeMs).toLocaleString() }}</span></span>
              <span class="text-blue-500 cursor-pointer" @click="handleClick('useArchive', item.name)">使用存档</span>
            </div>
          </li>
        </ul>
      </div>
      <!-- <h2 class="my-3">配置文件</h2>
      <div class="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label for="gamePath" class="block mb-2 text-sm font-medium text-gray-900 ">游戏路径</label>
          {{ configData.gamePath }}
        </div>
        <div>
          <label for="saveDir" class="block mb-2 text-sm font-medium text-gray-900 ">存档文件目录</label>
          {{ configData.saveDir }}
        </div>
        <div>
          <label for="useSave" class="block mb-2 text-sm font-medium text-gray-900 ">使用存档</label>{{ configData.useSave }}
        </div>
      </div> -->
    </div>
  </div>
</template>
