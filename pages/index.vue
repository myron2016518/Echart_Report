<template>

  <div class="tc_report_1">

    <el-carousel ref="carMain"
                 :interval="40000"
                 @change="carChange"
                 class="tc_report_2"
                 indicator-position="none"
                 height="100%">

      <el-carousel-item key="1">
        <div id="tc_echarts_1"></div>
      </el-carousel-item>

      <!-- 2. 每日新增用户数（每增加一个在对应的区域亮灯） -->
      <el-carousel-item key="2">
        <div class="tc_number_fanpai">
          <span>总数：</span>
          <digit-roll v-model="chart1numbertxt"
                      :duration="1000"
                      :delay="1000">
          </digit-roll>
        </div>
        <div id="tc_echarts_2"></div>
      </el-carousel-item>

      <!-- 日活；周活；月活 （3个折线图） -->
      <el-carousel-item key="3">
        <el-row class="tc_eh_3_title">用户活跃度</el-row>
        <el-row type="flex"
                class="row-bg tc_eh_3_bg"
                justify="space-around">
          <el-col :span="8"
                  class="tc_eh_3_w">
            <div id="tc_echarts_3"></div>
          </el-col>
          <el-col :span="8"
                  class="tc_eh_3_w">
            <div id="tc_echarts_3_2"></div>
          </el-col>
          <el-col :span="8"
                  class="tc_eh_3_w">
            <div id="tc_echarts_3_3"></div>
          </el-col>
        </el-row>
      </el-carousel-item>

      <!-- 软件购买总数（趋势图） -->
      <el-carousel-item key="4">
        <div id="tc_echarts_4"
             class="tc_pt_3"></div>
      </el-carousel-item>

      <!-- 5. 新增报告数（数字叠加）
            6. 所有帖子的浏览总数
            7. APP下载次数 -->
      <el-carousel-item key="5">
        <img src="http://chart.mythinkcar.cn/assets/img/bg1.jpg"
             class="tc_c5_bg">
        <div id="tc_echarts_5"
             class="tc_c5_main"></div>
      </el-carousel-item>

    </el-carousel>
  </div>

</template>
<script>

import { mapState, mapMutations } from 'vuex';

// import TcChartnum from '@/components/chartnum';
import diqiuImg from '@/assets/img/world.topo.bathy.200401.jpg';
import starfieldImg from '@/assets/img/starfield.jpg';
import echarts from 'echarts';
import 'echarts-gl';
import 'echarts-liquidfill';
import 'echarts/map/js/world.js';

// const getUserList = (store, params, self) => {
//   return new Promise(resolve => {
//     store.dispatch('getUserList', params).then(res => {
//       resolve(res)
//     })
//   })
// }

const timeTicket21 = null;
let timeTicket1 = null;
let timeTicket4 = null;
let timeTicket51 = null;
let timeTicket3 = null;
let myChart2 = null;
let myChart1 = null;
let myChart3 = null;
let myChart32 = null;
let myChart33 = null;
let myChart4 = null;
let myChart5 = null;
export default {
  components: {
    // TcChartnum,

  },
  data () {
    return {
      activeNames: [],
      dialogFormVisible: false,
      form: {
        name: '',
        jobs: '',
        tel: '',
        qq: '',
        desc: ''
      },
      formLabelWidth: '120px',
      dataList: [],
      count: 0,
      chart1Data: [],
      chart1numbertxt: 0,

      chart2Data: [],
      chart3Data: {
        day_act: {
          xData: [],
          yData: [],
        },
        week_act: {
          xData: [],
          yData: [],
        },
        month_act: {
          xData: [],
          yData: [],
        },

      },
      chart4Data: {
        xData: [],
        yData: [],
      },
      chart5Data: {
        app_view: "0",
        feed_view: "0",
        report_sum: "0",
      },

      chart1option: {},
      chart31option: {},
      chart32option: {},
      chart33option: {},
      chart4option: {},
      chart5option: {},

      diqiuImg: diqiuImg,
      starfieldImg: starfieldImg,
      //   diqiuImg: 'http://chart.mythinkcar.cn/assets/img/world.topo.bathy.200401.jpg',
      //   starfieldImg: 'http://chart.mythinkcar.cn/assets/img/starfield.jpg',
    }
  },
  head () {
    return {
      title: "数据报表",
      meta: [
        { hid: 'home custom title', name: 'home', content: 'nuxt egg ' },
        { hid: 'chartxianshi', name: 'viewport', content: 'width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover' },

      ]
    }
  },
  computed: {
    ...mapState({
      counter: state => state.counter
    })
  },
  // async asyncData ({ store, params }) {
  //   const _res = await getUserList(store)
  //   return {
  //     dataList: _res.rows,
  //     count: parseInt(_res.count)
  //   }
  // },
  created () {

  },
  mounted () {
    clearInterval();
    clearInterval(timeTicket1);
    clearInterval(timeTicket21);
    clearInterval(timeTicket3);
    clearInterval(timeTicket4);
    clearInterval(timeTicket51);

    //   const mapFeatures = echarts.getMap('world').geoJson.features;
    //   console.log('====mapFeatures====', mapFeatures);

    myChart2 = echarts.init(document.getElementById('tc_echarts_2'), null, {
      width: document.body.clientWidth,
      height: document.body.clientHeight
    });

    // 时间轴时间监听：
    myChart2.off('timelinechanged');
    myChart2.on('timelinechanged', (timeLineIndex) => {
      //   console.log('====off,on2===', timeLineIndex.currentIndex);
      const _num = this.chart1Data[timeLineIndex.currentIndex].time;

      if (_num) {
        this.chart1numbertxt = parseInt(_num);
        if (this.chart1Data.length === (timeLineIndex.currentIndex + 1)) {
          setTimeout(() => {
            this.getChart2DataAction(this.$store, {}, this).then(res => {
              if (res.code === 0) {
                const _data = [];
                res.data.map((_item, _idx) => {
                  _data.push({ "time": _item.time, "data": [_item.data] });
                });
                this.chart1Data = _data;
                this.chart1numbertxt = parseInt(res.data[0].time);
                this.echarts2();
              } else {

              }

            }).catch(_err => { });
          }, 5000);
        }
      }
    });


    this.getChart1Data();

    setTimeout(() => { this.getChart2Data(); }, 2000);
    setTimeout(() => { this.getChart3Data(); }, 3000);
    setTimeout(() => { this.getChart4Data(); }, 4000);
    setTimeout(() => {
      myChart5 = echarts.init(document.getElementById('tc_echarts_5'), null, {
        width: document.body.clientWidth,
        height: document.body.clientHeight
      });
      this.getChart5Data();
    }, 5000);

  },
  methods: {
    ...mapMutations([
      'INCREMENT'
    ]),

    echarts1 () {
      // 基于准备好的dom，初始化echarts实例
      this.chart1option = {
        backgroundColor: '#000',
        globe: {
          baseTexture: this.diqiuImg,
          heightTexture: this.diqiuImg,
          //   displacementScale: 0.04,  // 地球顶点位移的大小
          environment: this.starfieldImg,   // 背景图
          shading: 'color', // color,realistic
          zlevel: 1,
          viewControl: {
            autoRotate: false,
            autoRotateSpeed: 5
          },
          top: '30px',
          bottom: '5px',
        },
        title: {
          text: '全球注册用户数',
          // subtext: '单位:人',
          left: 'center',
          top: 'top',
          padding: [15, 0, 0, 0],
          zlevel: 3,
          textStyle: {
            fontSize: 25,
            color: '#fff'
          }
        },

        series: [
          { // 点
            type: 'scatter3D',
            blendMode: 'lighter',
            coordinateSystem: 'globe',
            showEffectOn: 'render',
            zlevel: 2,
            effectType: 'ripple',
            symbolSize: 20,     // 圆点大小
            rippleEffect: {
              period: 4,
              scale: 4,
              brushType: 'fill'
            },
            label: {
              show: true,
              textStyle: {
                fontSize: 20,   // 文字大小
              },
              formatter: '{b}'
            },

            // hoverAnimation: true,
            itemStyle: {
              normal: {
                color: '#ff0000'
              }
            },
            data: this.chart2Data,
          }

        ]
      };
      myChart1.setOption(this.chart1option);

      clearInterval(timeTicket1);
      timeTicket1 = setInterval(() => {
        this.getChart1DataAction(this.$store, {}, this).then(res => {
          if (res.code === 0) {
            this.chart2Data = res.data;
            this.chart1option.series[0].data = res.data || [];
            myChart1.setOption(this.chart1option);
          } else {

          }

        }).catch(_err => { });

      }, 24 * 60 * 60 * 1000);

    },

    echarts2 () {

      //   this.chart1Data = [
      //     {
      //       "time": 2020,
      //       "data": [
      //         { "name": "Russia", "value": 1 },
      //       ]
      //     },

      //     {
      //       "time": 2030,
      //       "data": [
      //         { "name": "United States", "value": 1 },
      //       ]
      //     },
      //     {
      //       "time": 2051,
      //       "data": [
      //         { "name": "Russia", "value": 1 },
      //       ]
      //     },
      //     {
      //       "time": 2054,
      //       "data": [
      //         { "name": "United States", "value": 1 },
      //       ]
      //     },
      //   ];

      const option = this.getChart2Option(this.chart1Data);

      // 绘制图表
      myChart2.setOption(option, true);

      /**
       *  myChart.setOption(option,true); 是告诉图形不合并数据，一定要设置为true，不然多出来的数据会一直存在！会一直存在！会一直存在！
       * myChart.resize(); 在这里一定要使用这句话，不然会丢失时间轴！会丢失时间轴！会丢失时间轴！
       */
      //   myChart2.resize();


    },
    // 初始化 图表2 数据
    getChart2Option (_data) {
      const _option = {
        baseOption: {
          animationDurationUpdate: 1000,
          animationEasingUpdate: 'quinticInOut',
          timeline: {
            axisType: 'category',
            orient: 'vertical',
            autoPlay: true, // 表示是否自动播放
            loop: false, // 是否循环播放, 默认true
            // currentIndex: 0, // 表示当前选中项是哪项
            inverse: true,
            playInterval: 5000,  // 切换时间
            left: null,
            right: 5,
            top: 20,
            bottom: 20,
            width: 46,
            height: null,
            show: false,
            label: {
              normal: {
                textStyle: {
                  color: '#ddd'
                }
              },
              emphasis: {
                textStyle: {
                  color: '#fff'
                }
              }
            },
            symbol: 'none',
            lineStyle: {
              color: '#555'
            },
            checkpointStyle: {
              color: '#bbb',
              borderColor: '#777',
              borderWidth: 1
            },
            controlStyle: {
              showNextBtn: false,
              showPrevBtn: false,
              normal: {
                color: '#666',
                borderColor: '#666'
              },
              emphasis: {
                color: '#aaa',
                borderColor: '#aaa'
              }
            },
            data: _data.map(function (ele) {
              return ele.time
            })
          },
          backgroundColor: '#000',
          title: {
            text: '全球用户报告数',
            // padding: [15, 0, 0, 0],
            // subtext: '单位:人',
            left: 'center',
            top: '25px',
            textStyle: {
              fontSize: 35,
              color: 'rgba(255,255,255, 0.9)'
            }
          },

          //   grid: {
          //     left: '12%',
          //     right: '45%',
          //     top: '70%',
          //     bottom: 20
          //   },
          series: [
            {
              id: 'map',
              type: 'map',
              mapType: 'world',
              top: '100px',
              bottom: '50px',
              left: '50px',
              right: '50px',
              // left: 10,
              itemStyle: {
                normal: {
                  areaColor: 'rgba(255,255,255, 0.5)',
                  borderColor: '#404a59'
                },
                emphasis: {
                  label: {
                    show: true
                  },
                  areaColor: 'rgba(255,255,255, 0.5)'
                }
              },
              data: []
            }
          ]
        },
        options: []
      };

      for (let i = 0; i < _data.length; i++) {
        _option.options.push({
          visualMap: [{
            show: false,
            dimension: 0,
            left: 10,
            itemWidth: 12,
            min: 0,
            max: 1,
            // text: ['High', 'Low'],
            textStyle: {
              color: '#ddd'
            },
            inRange: {
              color: ['rgba(255,255,255, 0.5)', 'red']
            }
          }],

          series: [{
            id: 'map',
            data: _data[i].data
          }]
        })
      }

      return _option
    },

    // 3. 日活；周活；月活 （3个折线图
    echarts3 () {

      const _gridcss = {
        left: '100px',
        //   right: '4%',
        //   bottom: '100px',
        top: '25%',
        height: '50%',
        //   containLabel: true
      };

      this.chart31option = {
        backgroundColor: '#000',
        title: {
          text: '日活',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 25,
            color: '#F1F1F3'
          },
          top: '15%',
          left: '6%'
        },
        grid: _gridcss,
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#f9f9f9'
            }
          },
          axisLabel: {
            textStyle: {
              padding: [10, 0, 0, 0],
              fontSize: 18
            }
          },
          data: this.chart3Data.day_act.xData
        },
        yAxis: [{
          type: 'value',
          name: '单位（人）',
          nameTextStyle: {
            fontSize: 18,
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#f9f9f9'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 18
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: '日活',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 5
            }
          },
          areaStyle: { // 区域填充样式
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(137, 189, 27, 1)'
              }, {
                offset: 1,
                color: 'rgba(137, 189, 27, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.9)',
              shadowBlur: 20
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(137,189,27)',
              borderColor: 'rgba(137,189,2,0.27)',
              borderWidth: 12

            }
          },
          data: this.chart3Data.day_act.yData
        }]
      };
      this.chart32option = {
        backgroundColor: '#000',
        title: {
          text: '周活',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 25,
            color: '#F1F1F3'
          },
          top: '15%',
          left: '6%'
        },
        grid: _gridcss,

        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#f9f9f9'
            }
          },
          axisLabel: {
            textStyle: {
              padding: [10, 0, 0, 0],
              fontSize: 18
            }
          },
          data: this.chart3Data.week_act.xData
        },
        yAxis: [{
          type: 'value',
          name: '单位（人）',
          nameTextStyle: {
            fontSize: 18,
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#f9f9f9'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 18
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [
          {
            name: '周活',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 5
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(0, 136, 212, 1)'
                }, {
                  offset: 1,
                  color: 'rgba(0, 136, 212, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.9)',
                shadowBlur: 20
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(0,136,212)',
                borderColor: 'rgba(0,136,212,0.2)',
                borderWidth: 12

              }
            },
            data: this.chart3Data.week_act.yData
          }
        ]
      };
      this.chart33option = {
        backgroundColor: '#000',
        title: {
          text: '月活',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 25,
            color: '#F1F1F3',
          },
          top: '15%',
          left: '6%'
        },
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: {
        //     lineStyle: {
        //       color: '#57617B'
        //     }
        //   }
        // },

        grid: _gridcss,
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#f9f9f9'
            }
          },
          axisLabel: {
            textStyle: {
              padding: [10, 0, 0, 0],
              fontSize: 18
            }
          },
          data: this.chart3Data.month_act.xData
        },
        yAxis: [{
          type: 'value',
          name: '单位（人）',
          nameTextStyle: {
            fontSize: 18,
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#f9f9f9'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 18
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [
          {
            name: '月活',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 5
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(219, 50, 51, 1)'
                }, {
                  offset: 1,
                  color: 'rgba(219, 50, 51, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.9)',
                shadowBlur: 20
              }
            },
            itemStyle: {
              normal: {

                color: 'rgb(219,50,51)',
                borderColor: 'rgba(219,50,51,0.2)',
                borderWidth: 12
              }
            },
            data: this.chart3Data.month_act.yData
          }
        ]
      };

      // 绘制图表
      myChart3.setOption(this.chart31option);
      myChart32.setOption(this.chart32option);
      myChart33.setOption(this.chart33option);

      clearInterval(timeTicket3);
      timeTicket3 = setInterval(() => {
        this.getChart3DataAction(this.$store, {}, this).then(res => {
          if (res.code === 0) {
            const _xd31 = []; const _yd31 = [];
            const _xd32 = []; const _yd32 = [];
            const _xd33 = []; const _yd33 = [];
            res.data.day_act.map(_item => {
              _xd31.push(_item.time);
              _yd31.push(_item.sum);
            });
            res.data.week_act.map(_item => {
              _xd32.push(_item.time);
              _yd32.push(_item.sum);
            });
            res.data.month_act.map(_item => {
              _xd33.push(_item.time);
              _yd33.push(_item.sum);
            });
            this.chart3Data = {
              day_act: {
                xData: _xd31 || [],
                yData: _yd31 || [],
              },
              week_act: {
                xData: _xd32 || [],
                yData: _yd32 || [],
              },
              month_act: {
                xData: _xd33 || [],
                yData: _yd33 || [],
              },

            };
            // 绘制图表
            myChart3.setOption(this.chart31option);
            myChart32.setOption(this.chart32option);
            myChart33.setOption(this.chart33option);
          } else {

          }

        }).catch(_err => { });


      }, 10 * 60 * 1000);

    },

    // 软件购买总数（趋势图）
    echarts4 () {

      const _title = '软件购买趋势';
      //   const _data = [15000, 20000, 27000, 30000, 24000, 25000, 34800];
      //   const _xData = ['2020-2-17', '2020-2-17', '2020-2-17', '2020-2-17', '2020-2-17', '2020-2-17', '2020-2-17'];
      this.chart4option = {
        title: {
          text: _title,
          textStyle: {
            fontSize: 35,
            // fontWeight: 'normal',
            color: '#fff',

          },
          top: '25px',
          //   padding: [15, 0, 0, 0],
          x: 'center'
        },
        backgroundColor: "#000",
        grid: {
          top: '100px',
          //   left: '1%',
          //   right: '1%',
          bottom: '5%',
          containLabel: true,
        },

        xAxis: [{
          type: 'category',
          boundaryGap: true,
          axisLine: { // 坐标轴轴线相关设置。数学上的x轴
            show: true,
            lineStyle: {
              color: '#f9f9f9'
            },
          },
          axisLabel: { // 坐标轴刻度标签的相关设置
            textStyle: {
              color: '#d1e6eb',
              margin: 15,
              padding: [10, 0, 0, 0],
              fontSize: 18,
            },
          },
          axisTick: {
            show: false,
          },
          data: this.chart4Data.xData,
        }],
        yAxis: [{
          show: false,
          //   type: 'value',
          //   min: 0,
          //   // max: 140,
          //   splitNumber: 7,
          //   splitLine: {
          //     show: true,
          //     lineStyle: {
          //       color: '#0a3256'
          //     }
          //   },
          //   axisLine: {
          //     show: false,
          //   },
          //   axisLabel: {
          //     margin: 20,
          //     textStyle: {
          //       color: '#d1e6eb',
          //       fontSize: 18,
          //     },
          //   },
          //   axisTick: {
          //     show: false,
          //   },
        }],
        series: [{
          name: '总量',
          type: 'line',
          smooth: true, // 是否平滑曲线显示
          // 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
          showAllSymbol: true,
          symbol: 'emptyCircle',
          symbolSize: 6,
          lineStyle: {
            normal: {
              color: "#28ffb3", // 线条颜色
              width: 5,
            },
            borderColor: '#f0f'
          },
          label: {
            show: false,    // 是否显示曲线文字
            position: 'top',
            textStyle: {
              color: '#fff',
            }
          },
          itemStyle: {
            normal: {
              color: "#28ffb3",

            }
          },
          tooltip: {
            show: false
          },
          areaStyle: { // 区域填充样式
            normal: {
              // 线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0,154,120,1)'
              },
              {
                offset: 1,
                color: 'rgba(0,0,0, 0)'
              }
              ], false),
              shadowColor: 'rgba(53,142,215, 0.9)', // 阴影颜色
              shadowBlur: 20 // shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
            }
          },
          data: this.chart4Data.yData,
        }

        ]
      };
      // 绘制图表
      myChart4.setOption(this.chart4option);
      clearInterval(timeTicket4);
      timeTicket4 = setInterval(() => {
        this.getChart4DataAction(this.$store, {}, this).then(res => {
          if (res.code === 0) {
            const _xd = []; const yd = [];
            res.data.map(_item => {
              _xd.unshift(_item.time);
              yd.unshift(_item.sum);
            });
            this.chart4Data = {
              xData: _xd || [],
              yData: yd || [],
            };
            this.chart4option.xAxis[0].data = _xd;
            this.chart4option.series[0].data = yd;
            myChart4.setOption(this.chart4option);
          } else {

          }

        }).catch(_err => { });

      }, 23 * 60 * 60 * 1000);
    },
    // 5,6,7
    echarts5 () {

      const _title1 = '报告数';
      const _data1 = [{ "name": this.chart5Data.report_sum || "0", "value": [0] }, { "name": "", "value": [0.5] }, { "name": "", "value": [0.5] }];
      const _title2 = '帖子浏览总数';
      const _data2 = [{ "name": this.chart5Data.feed_view || "0", "value": [0] }, { "name": "", "value": [0.6] }, { "name": "", "value": [0.6] }];
      const _title3 = 'APP使用次数';
      const _data3 = [{ "name": this.chart5Data.app_view || "0", "value": [0] }, { "name": "", "value": [0.4] }, { "name": "", "value": [0.4] }];
      const qiuSize = "250px"; // 球大小 40%
      this.chart5option = {
        series: [{
          type: 'liquidFill',
          radius: qiuSize,    // 球大小
          color: ['#195ba6'],
          center: ['25%', '50%'],
          data: _data1,
          backgroundStyle: {
            borderWidth: 2,
            borderColor: '#1789fb',
            color: '#1c233f',
          },
          outline: {
            itemStyle: {
              borderWidth: 5,
              borderColor: '#1789fb',
              borderType: 'dashed',
            }
          },
          label: {
            normal: { // 此处没有生效，本地生效
              formatter: _title1 + '\n{b}',
              textStyle: {
                fontSize: 20,
                color: '#e6e6e6',
                lineHeight: 30,
              },
            },
          },
        },
        {
          type: 'liquidFill',
          radius: qiuSize,    // 球大小
          color: ['#884046'],
          center: ['50%', '50%'],
          data: _data2,
          backgroundStyle: {
            borderWidth: 2,
            borderColor: '#eb5c4d',
            color: '#1c233f',
          },
          outline: {
            itemStyle: {
              borderWidth: 5,
              borderColor: '#eb5c4d',
              borderType: 'dashed',
            }
          },
          label: {
            normal: { // 同上
              formatter: _title2 + '\n{b}',
              textStyle: {
                fontSize: 20,
                color: '#e6e6e6',
                lineHeight: 30,
              },
            },
          },
        },
        {
          type: 'liquidFill',
          radius: qiuSize,
          color: ['#8a7e4e'],
          center: ['75%', '50%'],
          data: _data3,
          backgroundStyle: {
            borderWidth: 2,
            borderColor: '#f0d25c',
            color: '#1c233f',
          },
          outline: {
            itemStyle: {
              borderWidth: 5,
              borderColor: '#f0d25c',
              borderType: 'dashed',
            }
          },
          label: {
            normal: { // 同上
              formatter: _title3 + '\n{b}',
              textStyle: {
                fontSize: 20,
                color: '#e6e6e6',
                lineHeight: 30,
              },
            },
          },

        }
        ]
      };
      // 绘制图表
      myChart5.setOption(this.chart5option);


      clearInterval(timeTicket51);
      clearInterval();
      timeTicket51 = setInterval(() => {
        // const data0 = option.series[0].data;
        this.getChart5DataAction(this.$store, {}, this).then(res => {
          if (res.code === 0) {
            this.chart5Data = {
              app_view: res.data.app_view || "0",
              feed_view: res.data.feed_view || "0",
              report_sum: res.data.report_sum || "0",
            };
            this.chart5option.series[0].data[0].name = this.chart5Data.report_sum || "0";
            this.chart5option.series[1].data[0].name = this.chart5Data.feed_view || "0";
            this.chart5option.series[2].data[0].name = this.chart5Data.app_view || "0";
            myChart5.setOption(this.chart5option);
          } else {

          }

        }).catch(_err => { });


      }, 10 * 60 * 1000);

    },

    getChart1Data () {
      myChart1 = echarts.init(document.getElementById('tc_echarts_1'), null, {
        width: document.body.clientWidth,
        height: document.body.clientHeight
      });
      this.getChart1DataAction(this.$store, {}, this).then(res => {
        if (res.code === 0) {
          //   this.chart2Data = [
          //       { "name": "美国:1000", "value": [-95.712891, 37.09024] },
          //       { "name": "日本:2000", "value": [138.252924, 36.204824] },
          //       { "name": "中国:3000", "value": [104.195397, 35.86166] },
          //     ];
          this.chart2Data = res.data;
          this.echarts1();
        } else {

        }

      }).catch(_err => { this.$message.error(_err); });

    },
    getChart2Data () {
      myChart1 = echarts.init(document.getElementById('tc_echarts_1'), null, {
        width: document.body.clientWidth,
        height: document.body.clientHeight
      });
      this.getChart2DataAction(this.$store, {}, this).then(res => {
        if (res.code === 0) {
          const _data = [];
          res.data.map((_item, _idx) => {
            _data.push({ "time": _item.time, "data": [_item.data] });
          });
          this.chart1Data = _data;
          this.chart1numbertxt = parseInt(res.data[0].time);
          this.echarts2();
        } else {

        }

      }).catch(_err => { });

    },
    getChart3Data () {

      const _w = document.getElementsByClassName('tc_eh_3_w')[0].clientWidth || "100px";
      myChart3 = echarts.init(document.getElementById('tc_echarts_3'), null, {
        width: _w,
        height: document.body.clientHeight
      });
      myChart32 = echarts.init(document.getElementById('tc_echarts_3_2'), null, {
        width: _w,
        height: document.body.clientHeight
      });
      myChart33 = echarts.init(document.getElementById('tc_echarts_3_3'), null, {
        width: _w,
        height: document.body.clientHeight
      });

      this.getChart3DataAction(this.$store, {}, this).then(res => {
        if (res.code === 0) {
          const _xd31 = []; const _yd31 = [];
          const _xd32 = []; const _yd32 = [];
          const _xd33 = []; const _yd33 = [];
          res.data.day_act.map(_item => {
            _xd31.push(_item.time);
            _yd31.push(_item.sum);
          });
          res.data.week_act.map(_item => {
            _xd32.push(_item.time);
            _yd32.push(_item.sum);
          });
          res.data.month_act.map(_item => {
            _xd33.push(_item.time);
            _yd33.push(_item.sum);
          });
          this.chart3Data = {
            day_act: {
              xData: _xd31 || [],
              yData: _yd31 || [],
            },
            week_act: {
              xData: _xd32 || [],
              yData: _yd32 || [],
            },
            month_act: {
              xData: _xd33 || [],
              yData: _yd33 || [],
            },

          };
          this.echarts3();
        } else {

        }

      }).catch(_err => { });

    },
    getChart4Data () {
      myChart4 = echarts.init(document.getElementById('tc_echarts_4'), null, {
        width: document.body.clientWidth,
        height: document.body.clientHeight
      });
      this.getChart4DataAction(this.$store, {}, this).then(res => {
        if (res.code === 0) {
          const _xd = []; const yd = [];
          res.data.map(_item => {
            _xd.unshift(_item.time);
            yd.unshift(_item.sum);
          });
          this.chart4Data = {
            xData: _xd || [],
            yData: yd || [],
          };
          this.echarts4();
        } else {

        }

      }).catch(_err => { });

    },
    getChart5Data () {
      this.getChart5DataAction(this.$store, {}, this).then(res => {
        if (res.code === 0) {
          this.chart5Data = {
            app_view: res.data.app_view || "0",
            feed_view: res.data.feed_view || "0",
            report_sum: res.data.report_sum || "0",
          };
          this.echarts5();
        } else {

        }

      }).catch(_err => { });

    },

    getChart1DataAction (store, params, self) {
      const param = {};
      return new Promise((resolve, reject) => {
        store.dispatch('searchUserArea', param).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err);
        });
      })
    },
    getChart2DataAction (store, params, self) {
      const param = {};
      return new Promise((resolve, reject) => {
        store.dispatch('mapRecord', param).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err);
        });
      })
    },
    getChart3DataAction (store, params, self) {
      const param = {};
      return new Promise((resolve, reject) => {
        store.dispatch('countUserAct', param).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err);
        });
      })
    },
    getChart4DataAction (store, params, self) {
      const param = {};
      return new Promise((resolve, reject) => {
        store.dispatch('ehartOrderList', param).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err);
        });
      })
    },
    getChart5DataAction (store, params, self) {
      const param = {};
      return new Promise((resolve, reject) => {
        store.dispatch('searchPv', param).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err);
        });
      })
    },

    // 获取当前时间到今天23:59:59 秒的剩余秒数
    getTimeEnd () {
      const curDate = new Date();
      // 当前时间戳
      const curTamp = curDate.getTime();
      // 当日凌晨的时间戳,减去一毫秒是为了防止后续得到的时间不会达到00:00:00的状态
      const curWeeHours = new Date(curDate.toLocaleDateString()).getTime() - 1;
      // 当日已经过去的时间（毫秒）
      const passedTamp = curTamp - curWeeHours;
      // 当日剩余时间
      const leftTamp = 24 * 60 * 60 * 1000 - passedTamp;
      return leftTamp;
    },

    carChange (_indx, _d) {

      if (_indx === 2 || _indx === 3) {
        setTimeout(() => { this.$refs.carMain.next(); }, 5000)

      }
    },



  }
}
</script>

<style lang="stylus">
.tc_report_1
  height 100%
  .tc_report_2
    height 100%
.tc_pt_3
  // padding-top 3%
  // padding-bottom 3%
.tc_eh_3_title
  text-align center
  text-align -webkit-center
  font-size 35px
  background-color #000
  padding-top 25px
  color #fff
  font-weight bold
.tc_eh_3_bg
  background-color #000
.tc_c5_bg
  display inline-block
  width 100%
  height 100%
  text-align center
  text-align -webkit-center
  object-fit cover
.tc_c5_main
  position fixed
  top 0
.tc_number_fanpai
  position absolute
  bottom 10%
  left 5%
  color #fff
  z-index 10
  font-size 28px
</style>
