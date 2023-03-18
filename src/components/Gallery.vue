<template>
  <div class="gallery">
    <div v-for="item in data" :key="item.name" class="item" :class="{ active: current && current.name === item.name }" @click="onClick(item)">
      <div v-if="item.thumb" class="thumb" :style="{ backgroundImage: `url(${item.thumb})`, backgroundColor: item.thumbBg }"></div>
      <div v-else class="name">{{ item.name }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ModelData } from '../lib/helper'
import glassesModel from '../lib/models/glasses'
import zeldaModel from '../lib/models/zelda'
import barbaraModel from '../lib/models/barbara'
import bingdundunModel from '../lib/models/bingdundun'
import pandaModel from '../lib/models/panda'
import rabitModel from '../lib/models/rabit'
import deerModel from '../lib/models/deer'
import giraffeModel from '../lib/models/giraffe'
import tigerModel from '../lib/models/tiger'
import monkeyModel from '../lib/models/monkey'
import lionModel from '../lib/models/lion'
import elephantModel from '../lib/models/elephant'
import cowModel from '../lib/models/cow'
import bearModel from '../lib/models/bear'
import pigModel from '../lib/models/pig'
import dogModel from '../lib/models/dog'

export default defineComponent({
  props: {
    autoSelectFirst: Boolean
  },
  setup(props, { emit }) {
    const data: ModelData[] = [
      {
        name: 'lion',
        thumb: '/models/animal_head/lion.png',
        type: 'model',
        loader: lionModel
      },
      {
        name: 'panda',
        thumb: '/models/animal_head/panda.png',
        type: 'model',
        loader: pandaModel
      },
      {
        name: 'rabit',
        thumb: '/models/animal_head/rabit.png',
        type: 'model',
        loader: rabitModel
      },
      {
        name: 'deer',
        thumb: '/models/animal_head/deer.png',
        type: 'model',
        loader: deerModel
      },
      {
        name: 'giraffe',
        thumb: '/models/animal_head/giraffe.png',
        type: 'model',
        loader: giraffeModel
      },
      {
        name: 'tiger',
        thumb: '/models/animal_head/tiger.png',
        type: 'model',
        loader: tigerModel
      },
      {
        name: 'monkey',
        thumb: '/models/animal_head/monkey.png',
        type: 'model',
        loader: monkeyModel
      },
      
      {
        name: 'elephant',
        thumb: '/models/animal_head/elephant.png',
        type: 'model',
        loader: elephantModel
      },
      {
        name: 'cow',
        thumb: '/models/animal_head/cow.png',
        type: 'model',
        loader: cowModel
      },
      {
        name: 'bear',
        thumb: '/models/animal_head/bear.png',
        type: 'model',
        loader: bearModel
      },
      {
        name: 'pig',
        thumb: '/models/animal_head/pig.png',
        type: 'model',
        loader: pigModel
      },
      {
        name: 'dog',
        thumb: '/models/animal_head/dog.png',
        type: 'model',
        loader: dogModel
      },
      


      {
        name: 'facepaint',
        thumb: '/textures/facepaint.png',
        type: 'texture',
        path: '/textures/facepaint.png'
      },
      {
        name: 'cheek',
        thumb: '/textures/cheek.png',
        thumbBg: 'white',
        type: 'texture',
        path: '/textures/cheek.png'
      },
      {
        name: 'makeup',
        thumb: '/textures/makeup.png',
        thumbBg: 'white',
        type: 'texture',
        path: '/textures/makeup.png'
      },
      {
        name: 'glasses',
        thumb: '',
        type: 'model',
        loader: glassesModel
      },
      {
        name: 'zelda',
        thumb: '',
        type: 'model',
        loader: zeldaModel
      },
      {
        name: 'barbara',
        thumb: '',
        type: 'model',
        loader: barbaraModel
      },
      {
        name: 'bingdundun',
        thumb: '',
        type: 'model',
        loader: bingdundunModel
      }
    ]
    const current = ref()
    const onClick = (item: any) => {
      current.value = item
      emit('change', item)
    }

    if (props.autoSelectFirst) {
      onClick(data[0])
    }

    return {
      data,
      current,
      onClick
    }
  }
})
</script>
<style lang="scss" scoped>
.gallery {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  background: #314249;
  overflow-x: hidden;
  overflow-y: auto;
  width: 170px;
  // &::-webkit-scrollbar {
  //   width: 0;
  // }
}
.item {
  margin: 20px;
  width: 100px;
  height: 100px;
  border-radius: 10px;
  overflow: hidden;
  background-color: hsla(0,0%,100%,.12549019607843137);
  border: 4px solid hsla(0,0%,100%,.12549019607843137);
  transition: .4s ease;
  &.active {
    border-color: rgb(0, 157, 247);
  }
}
.thumb {
  height: 100px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
.name {
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-top: 40px;
}
</style>
