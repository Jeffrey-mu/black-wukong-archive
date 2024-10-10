
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
  if (localConfig !== undefined) {
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
})

const gameArchive = ref([])
const myGameArchive = ref([])
function handleClick(type, value = '') {
  showForm.value = { ...constShow }
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
        }
        console.log(res)
      })
      break
    case 'gameArchive':
      showForm.value.gameArchive = true
      getArchiveListFn(true)
      break
    case 'saveConfig':
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
</script>
<template>
  <div class="max_width   !mt-5">
    <div class="py-3 flex gap-5">
      <Button @click="handleClick('myArchive')">我的存档</Button>
      <Button @click="handleClick('gameArchive')">游戏存档</Button>
      <Button @click="handleClick('config')">设置配置</Button>
      <Button @click="handleClick('save')">保存游戏</Button>
    </div>
    <div v-if="showForm.config">

      <form>
        <div class="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 ">游戏路径</label>
            <input type="text" id="first_name" v-model="configData.gamePath"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
              placeholder="游戏目录" required />
          </div>
          <div>
            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 ">存档文件目录</label>
            <input type="text" id="first_name" v-model="configData.saveDir"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
              placeholder="不可修改仅展示" required disabled />
          </div>
          <div>
            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 ">使用存档</label>
            <input type="text" id="first_name" v-model="configData.useSave"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
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
            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 ">存档说明</label>
            <input type="text" id="first_name" v-model="saveData.name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
              placeholder="存档说明备注" required />
          </div>
          <div>
            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 ">最近修改</label>
            <input type="text" id="first_name" v-model="saveData.date"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
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
            <span class="mr-4">创建日期： <span class="font-medium">{{ new Date(item.birthtime).toLocaleString()
            }}</span></span>
            <span>修改日期： <span class="font-medium">{{ new Date(item.mtimeMs).toLocaleString() }}</span></span>
          </div>
        </li>

      </ul>
    </div>
    <div v-else>
      存档列表
      <ul>
        <li v-for="item in myGameArchive" :key="item.name"
          class="flex items-center justify-between p-2 border-b border-gray-200">
          <div>
            <span class="font-bold">文件名：</span>
            <span class="text-blue-500">{{ item.name }}</span>
          </div>
          <div class="text-gray-600">
            <span class="mr-4">创建日期： <span class="font-medium">{{ new Date(item.birthtime).toLocaleString()
            }}</span></span>
            <span>修改日期： <span class="font-medium mr-4">{{ new Date(item.mtimeMs).toLocaleString() }}</span></span>
            <span class="text-blue-500 cursor-pointer" @click="handleClick('useArchive', item.name)">使用存档</span>
          </div>
        </li>

      </ul>
    </div>
  </div>
</template>
