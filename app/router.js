module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.index);

    // 上传文件
    router.post('/api/uploads', controller.home.HouseworkUpload);
    // 获取token
    router.get('/api/login', controller.home.login);

  };