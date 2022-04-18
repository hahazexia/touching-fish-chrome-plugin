
const data = {
  "元旦": "2022-01-01",
  "春节": "2022-01-31",
  "清明节": "2022-04-03",
  "劳动节": "2022-04-30",
  "端午节": "2022-06-03",
  "中秋节": "2022-09-10",
  "国庆节": "2022-10-01",
  "补": ["2022-01-29", "2022-01-30", "2022-04-02", "2022-04-24", "2022-05-07", "2022-10-08", "2022-10-09"]
};

const classMap = {
  元旦: '.newYearsDay',
  春节: '.chineseNewYearsDay',
  清明节: '.qingming',
  劳动节: '.workersDay',
  端午节: '.duanwu',
  中秋节: '.midAutumn',
  国庆节: '.nationalDay',
};

const pclassMap = {
  元旦: '.newYearsDay-p',
  春节: '.chineseNewYearsDay-p',
  清明节: '.qingming-p',
  劳动节: '.workersDay-p',
  端午节: '.duanwu-p',
  中秋节: '.midAutumn-p',
  国庆节: '.nationalDay-p',
};

// 计算今天距离所有节日还有多少天
const handledData = Object.keys(data).reduce((acc, item) => {
  if (item !== '补') {
    const temp = dayjs(data[item]);
    acc[item] = {
      diff: dayjs().diff(temp, 'days'),
      after: dayjs().isAfter(temp),
    };
  }
  return acc;
}, {});

Object.keys(handledData).forEach(i => {
  const dom = document.querySelector(classMap[i]);
  if (handledData[i].after) {
    document.querySelector(pclassMap[i]).style.display = 'none';
  } else {
    dom.innerHTML = Math.abs(handledData[i].diff);
  }
});


// 计算今天距离本周周末还有多少天
function isBu(d) {
  const t = d.format('YYYY-MM-DD');
  return data['补'].some(i => i === t);
}

let today = dayjs();
let todayWeekDay = dayjs().day();
let nextNoBu;
let saturday;
let sunday;

while (!nextNoBu) {
  if (todayWeekDay !== 0 && todayWeekDay !== 6) {
    saturday = today.add(6 - todayWeekDay, 'day');
    sunday = today.add(7 - todayWeekDay, 'day');
  } else if (todayWeekDay === 6) {
    saturday = today.add(7, 'day');
    sunday = today.add(8, 'day');
  } else if (todayWeekDay === 0) {
    saturday = today.add(6, 'day');
    sunday = today.add(7, 'day');
  }

  if (!isBu(saturday)) {
    nextNoBu = saturday;
  } else if (!isBu(sunday)) {
    nextNoBu = sunday;
  } else {
    today = today.add(7, 'day');
    todayWeekDay = today.day();
  }
}

nextNoBu = dayjs(nextNoBu.format('YYYY-MM-DD'));
const weekend = document.querySelector('.weekend');
weekend.innerHTML = Math.abs(dayjs().diff(nextNoBu, 'days'));

// 获取当前一天内的时间段显示文字 凌晨 早上 中午 下午 晚上
function getTodayRange(t) {
  if (t < 6) {
    return '凌晨';
  }
  if (t < 12) {
    return '早上';
  }
  if (t < 13) {
    return '中午';
  }
  if (t < 20) {
    return '下午';
  }
  return '晚上';
}

const todayDom = document.querySelector('.today');
todayDom.innerHTML = `${dayjs().month() + 1}月${dayjs().date()}日${getTodayRange(dayjs().hour())}`;


