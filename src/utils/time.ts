// 显示时间
export const getTime = () => {
    const now = new Date().getHours();
    if (now >= 6 && now < 12) {
      return "早上";
    } else if (now >= 12 && now < 14) {
      return "中午";
    } else if (now >= 14 && now < 18) {
      return "下午";
    } else if (now >= 18 && now < 22) {
      return "晚上";
    } else {
      return "凌晨";
    }
  }