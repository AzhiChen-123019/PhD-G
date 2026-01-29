// 测试不同博士类型的申请流程
// 运行方式：在浏览器控制台中复制粘贴并执行

// 模拟华人博士用户
const createChinesePhDUser = () => {
  const chineseUser = {
    username: 'Chinese PhD',
    email: 'chinese@example.com',
    phone: '12345678901',
    countryCode: '+86',
    identity: 'chinese',
    hasUploadedResume: true
  };
  localStorage.setItem('user', JSON.stringify(chineseUser));
  console.log('已创建华人博士用户');
  console.log('用户信息:', chineseUser);
};

// 模拟外籍博士用户
const createForeignPhDUser = () => {
  const foreignUser = {
    username: 'Foreign PhD',
    email: 'foreign@example.com',
    phone: '1234567890',
    countryCode: '+1',
    identity: 'foreign',
    hasUploadedResume: true
  };
  localStorage.setItem('user', JSON.stringify(foreignUser));
  console.log('已创建外籍博士用户');
  console.log('用户信息:', foreignUser);
};

// 清除用户信息
const clearUser = () => {
  localStorage.removeItem('user');
  console.log('已清除用户信息');
};

// 查看当前用户信息
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    console.log('当前用户信息:', user);
    return user;
  } else {
    console.log('当前无用户登录');
    return null;
  }
};

// 测试步骤：
// 1. 执行 createChinesePhDUser() 创建华人博士用户
// 2. 访问任意岗位详情页，点击"立即申请"按钮
// 3. 观察申请表单中的材料要求（应该只显示"个人简历"）
// 4. 执行 createForeignPhDUser() 创建外籍博士用户
// 5. 刷新页面，再次点击"立即申请"按钮
// 6. 观察申请表单中的材料要求（应该显示完整的海外人才引进材料）
// 7. 执行 clearUser() 清除用户信息

// 导出测试函数（在浏览器控制台中可直接调用）
window.testChinesePhD = createChinesePhDUser;
window.testForeignPhD = createForeignPhDUser;
window.clearTestUser = clearUser;
window.getCurrentTestUser = getCurrentUser;

console.log('测试脚本已加载');
console.log('可用测试函数:');
console.log('testChinesePhD() - 创建华人博士用户');
console.log('testForeignPhD() - 创建外籍博士用户');
console.log('clearTestUser() - 清除用户信息');
console.log('getCurrentTestUser() - 查看当前用户信息');
