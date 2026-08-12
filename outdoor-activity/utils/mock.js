/**
 * Mock 数据 - 用于开发阶段的页面展示
 * 正式环境将替换为云函数接口调用
 */

const CATEGORIES = [
  { id: 'all', name: '全部', icon: '🌍' },
  { id: 'hiking', name: '徒步', icon: '🥾' },
  { id: 'camping', name: '露营', icon: '⛺' },
  { id: 'cycling', name: '骑行', icon: '🚴' },
  { id: 'climbing', name: '登山', icon: '🏔️' },
  { id: 'rafting', name: '溯溪', icon: '🌊' },
  { id: 'skiing', name: '滑雪', icon: '⛷️' }
]

const MOCK_ACTIVITIES = [
  {
    _id: 'act001',
    title: '武功山云端徒步 | 穿越十万亩高山草甸',
    category: 'hiking',
    coverImage: 'https://picsum.photos/seed/outdoor1/800/500',
    images: [
      'https://picsum.photos/seed/outdoor1a/800/500',
      'https://picsum.photos/seed/outdoor1b/800/500',
      'https://picsum.photos/seed/outdoor1c/800/500'
    ],
    startTime: '2026-09-05T07:00:00',
    endTime: '2026-09-07T18:00:00',
    location: { name: '江西萍乡·武功山', address: '江西省萍乡市芦溪县武功山风景区', latitude: 27.45, longitude: 114.15 },
    fee: 599,
    feeDescription: '含往返大巴、2晚山顶帐篷住宿、领队服务、保险',
    maxParticipants: 40,
    currentParticipants: 28,
    description: '武功山位于江西省萍乡市，主峰白鹤峰海拔1918.3米。这里拥有十万亩高山草甸，被誉为"云中草原"。本次行程将穿越金顶、吊马桩、发云界等经典路线，在云端之上感受大自然的壮美。\n\n行程亮点：\n• 十万亩高山草甸，四季皆美\n• 金顶日出日落，震撼心灵\n• 星空露营，远离城市光污染\n• 专业领队全程带队，安全无忧',
    itinerary: 'Day1：萍乡集合 - 乘车前往武功山 - 龙山村出发 - 徒步至发云界（约4h）- 扎营\nDay2：发云界日出 - 穿越绝望坡 - 吊马桩 - 金顶（约6h）- 金顶露营\nDay3：金顶日出 - 下山 - 返回萍乡',
    notices: '1. 请穿着专业徒步鞋，携带登山杖\n2. 山顶温差大，请带冲锋衣和保暖衣物\n3. 请携带个人药品和防晒用品\n4. 活动中请听从领队安排，不得擅自离队\n5. 保护环境，不留垃圾',
    status: 'open',
    publisherId: 'user001',
    publisherName: '山野探索者',
    publisherAvatar: 'https://picsum.photos/seed/avatar1/100/100',
    createdAt: '2026-08-01T10:00:00',
    updatedAt: '2026-08-01T10:00:00',
    participants: [
      { userId: 'u1', userName: '小明', userAvatar: 'https://picsum.photos/seed/p1/50/50' },
      { userId: 'u2', userName: '旅行者', userAvatar: 'https://picsum.photos/seed/p2/50/50' },
      { userId: 'u3', userName: '户外达人', userAvatar: 'https://picsum.photos/seed/p3/50/50' },
      { userId: 'u4', userName: '山水之间', userAvatar: 'https://picsum.photos/seed/p4/50/50' },
      { userId: 'u5', userName: '追风少年', userAvatar: 'https://picsum.photos/seed/p5/50/50' }
    ]
  },
  {
    _id: 'act002',
    title: '千岛湖环湖骑行 | 湖光山色间的风之旅',
    category: 'cycling',
    coverImage: 'https://picsum.photos/seed/outdoor2/800/500',
    images: [
      'https://picsum.photos/seed/outdoor2a/800/500',
      'https://picsum.photos/seed/outdoor2b/800/500'
    ],
    startTime: '2026-09-12T08:00:00',
    endTime: '2026-09-12T18:00:00',
    location: { name: '浙江杭州·千岛湖', address: '浙江省杭州市淳安县千岛湖镇', latitude: 29.60, longitude: 118.95 },
    fee: 299,
    feeDescription: '含自行车租赁、头盔装备、领队服务、午餐、保险',
    maxParticipants: 25,
    currentParticipants: 18,
    description: '千岛湖环湖骑行是华东地区最受欢迎的骑行路线之一。全程约80公里，沿湖而行，湖光山色尽收眼底。适合有一定骑行基础的骑友参加。',
    itinerary: '08:00 千岛湖广场集合\n08:30 出发骑行（千汾线段）\n12:00 午餐休息\n13:30 继续骑行（淳杨线段）\n17:00 返回终点\n17:30 合影留念',
    notices: '1. 请佩戴头盔，穿着适合骑行的服装\n2. 有基本骑行经验即可参加\n3. 请携带充足饮水\n4. 注意交通安全，遵守交通规则',
    status: 'open',
    publisherId: 'user002',
    publisherName: '骑行俱乐部',
    publisherAvatar: 'https://picsum.photos/seed/avatar2/100/100',
    createdAt: '2026-08-02T14:00:00',
    updatedAt: '2026-08-02T14:00:00',
    participants: [
      { userId: 'u6', userName: '风骑士', userAvatar: 'https://picsum.photos/seed/p6/50/50' },
      { userId: 'u7', userName: '骑行侠', userAvatar: 'https://picsum.photos/seed/p7/50/50' },
      { userId: 'u8', userName: '轮上行者', userAvatar: 'https://picsum.photos/seed/p8/50/50' }
    ]
  },
  {
    _id: 'act003',
    title: '莫干山星空露营 | 逃离城市的一夜',
    category: 'camping',
    coverImage: 'https://picsum.photos/seed/outdoor3/800/500',
    images: [
      'https://picsum.photos/seed/outdoor3a/800/500',
      'https://picsum.photos/seed/outdoor3b/800/500'
    ],
    startTime: '2026-09-19T14:00:00',
    endTime: '2026-09-20T12:00:00',
    location: { name: '浙江湖州·莫干山', address: '浙江省湖州市德清县莫干山镇', latitude: 30.63, longitude: 119.87 },
    fee: 399,
    feeDescription: '含帐篷装备（2人/顶）、营地使用、篝火晚会、早餐、保险',
    maxParticipants: 30,
    currentParticipants: 30,
    description: '在莫干山的竹林深处，寻一处静谧营地，支起帐篷，点燃篝火，仰望星空。远离城市的喧嚣，享受一个与自然亲密接触的周末。',
    itinerary: 'Day1：14:00 营地集合 - 搭帐篷教学 - 16:00 徒步探索竹林 - 18:00 户外BBQ - 20:00 篝火晚会&观星\nDay2：06:30 日出瑜伽 - 08:00 营地早餐 - 09:30 收拾营地 - 12:00 返程',
    notices: '1. 请携带个人洗漱用品和换洗衣物\n2. 夜间山区温度较低，请带保暖衣物\n3. 营地提供帐篷和睡袋，也可自带\n4. 禁止在营地外生火',
    status: 'open',
    publisherId: 'user001',
    publisherName: '山野探索者',
    publisherAvatar: 'https://picsum.photos/seed/avatar1/100/100',
    createdAt: '2026-08-03T09:00:00',
    updatedAt: '2026-08-03T09:00:00',
    participants: [
      { userId: 'u9', userName: '星空猎手', userAvatar: 'https://picsum.photos/seed/p9/50/50' },
      { userId: 'u10', userName: '露营小白', userAvatar: 'https://picsum.photos/seed/p10/50/50' }
    ]
  },
  {
    _id: 'act004',
    title: '黄山日出徒步 | 西海大峡谷深度穿越',
    category: 'climbing',
    coverImage: 'https://picsum.photos/seed/outdoor4/800/500',
    images: [
      'https://picsum.photos/seed/outdoor4a/800/500',
      'https://picsum.photos/seed/outdoor4b/800/500'
    ],
    startTime: '2026-10-01T06:00:00',
    endTime: '2026-10-03T17:00:00',
    location: { name: '安徽黄山·黄山风景区', address: '安徽省黄山市黄山区黄山风景区', latitude: 30.13, longitude: 118.17 },
    fee: 899,
    feeDescription: '含门票、索道、2晚山上住宿、领队服务、保险',
    maxParticipants: 20,
    currentParticipants: 12,
    description: '黄山归来不看岳！本次行程深度穿越西海大峡谷，探访始信峰、猴子观海等经典景观，在光明顶迎接壮丽的日出。',
    itinerary: 'Day1：黄山脚下集合 - 乘索道上山 - 始信峰 - 北海 - 西海大峡谷（约5h）- 住宿\nDay2：05:00 光明顶日出 - 飞来石 - 鳌鱼峰 - 迎客松 - 天都峰 - 住宿\nDay3：05:30 日出 - 下山 - 返回',
    notices: '1. 黄山台阶较多，请穿舒适登山鞋\n2. 请携带雨衣（山上天气多变）\n3. 山上物价较高，建议自带干粮和饮水\n4. 国庆期间人流量大，请耐心排队',
    status: 'open',
    publisherId: 'user003',
    publisherName: '峰行天下',
    publisherAvatar: 'https://picsum.photos/seed/avatar3/100/100',
    createdAt: '2026-08-05T16:00:00',
    updatedAt: '2026-08-05T16:00:00',
    participants: [
      { userId: 'u11', userName: '登山客', userAvatar: 'https://picsum.photos/seed/p11/50/50' },
      { userId: 'u12', userName: '云端行者', userAvatar: 'https://picsum.photos/seed/p12/50/50' }
    ]
  },
  {
    _id: 'act005',
    title: '安吉溯溪探险 | 清凉一夏的亲水之旅',
    category: 'rafting',
    coverImage: 'https://picsum.photos/seed/outdoor5/800/500',
    images: [
      'https://picsum.photos/seed/outdoor5a/800/500'
    ],
    startTime: '2026-08-23T08:30:00',
    endTime: '2026-08-23T17:00:00',
    location: { name: '浙江湖州·安吉', address: '浙江省湖州市安吉县天荒坪镇', latitude: 30.55, longitude: 119.65 },
    fee: 259,
    feeDescription: '含专业溯溪装备、安全员、午餐、保险',
    maxParticipants: 20,
    currentParticipants: 15,
    description: '安吉的天然溪谷是溯溪爱好者的天堂。清澈的溪水、飞瀑流泉、深潭巨石，在原始山林间体验亲水探险的乐趣。',
    itinerary: '08:30 集合点集合\n09:00 装备穿戴&安全讲解\n09:30 进入溪谷开始溯溪\n12:00 溪边午餐\n13:00 继续溯溪（跳水、攀岩、漂流）\n16:00 出溪\n17:00 返程',
    notices: '1. 请穿着可湿水的运动鞋或溯溪鞋\n2. 请携带换洗衣物和毛巾\n3. 手机请使用防水袋\n4. 不会游泳也可参加，有专业安全保障',
    status: 'open',
    publisherId: 'user002',
    publisherName: '骑行俱乐部',
    publisherAvatar: 'https://picsum.photos/seed/avatar2/100/100',
    createdAt: '2026-08-06T11:00:00',
    updatedAt: '2026-08-06T11:00:00',
    participants: []
  },
  {
    _id: 'act006',
    title: '崇礼太舞滑雪 | 冬日粉雪天堂',
    category: 'skiing',
    coverImage: 'https://picsum.photos/seed/outdoor6/800/500',
    images: [],
    startTime: '2026-12-20T08:00:00',
    endTime: '2026-12-22T17:00:00',
    location: { name: '河北张家口·太舞滑雪小镇', address: '河北省张家口市崇礼区太舞滑雪小镇', latitude: 40.97, longitude: 115.27 },
    fee: 1299,
    feeDescription: '含2天雪票、2晚酒店住宿、雪具租赁、教练指导、保险',
    maxParticipants: 30,
    currentParticipants: 8,
    description: '崇礼太舞滑雪小镇是2022年冬奥会比赛场地之一，拥有国际级雪道和完善的配套设施。本次行程适合初中级滑雪爱好者，有专业教练指导。',
    itinerary: 'Day1：张家口集合 - 入住酒店 - 雪具领取 - 基础教学\nDay2：全天自由滑雪 - 教练陪同指导\nDay3：上午自由滑雪 - 下午返程',
    notices: '1. 请携带保暖衣物、手套、雪镜\n2. 初学者将由教练全程指导\n3. 雪场提供雪具，也可自带\n4. 注意防晒，雪地反射强烈',
    status: 'open',
    publisherId: 'user003',
    publisherName: '峰行天下',
    publisherAvatar: 'https://picsum.photos/seed/avatar3/100/100',
    createdAt: '2026-08-07T15:00:00',
    updatedAt: '2026-08-07T15:00:00',
    participants: []
  }
]

const MOCK_USER = {
  _id: 'user_mock_001',
  nickName: '户外探险家',
  avatarUrl: 'https://picsum.photos/seed/myavatar/200/200',
  phone: '138****8888'
}

module.exports = {
  CATEGORIES,
  MOCK_ACTIVITIES,
  MOCK_USER
}
