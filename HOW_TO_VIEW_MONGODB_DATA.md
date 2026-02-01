# 如何查看 MongoDB 数据

本指南将介绍多种查看和管理项目 MongoDB 数据库的方法。

## 项目 MongoDB 配置

从 `.env.local` 文件中，我们可以看到项目使用的是 MongoDB Atlas 集群：

```
MONGODB_URI="mongodb+srv://18223402922_db_user:55Yj0CQhFwoZ5fze@job-platform-cluster.7c8krno.mongodb.net/?appName=job-platform-cluster"
```

## 方法一：使用 MongoDB Compass（推荐）

MongoDB Compass 是官方提供的 GUI 工具，功能强大且易于使用。

### 安装步骤

1. **下载 MongoDB Compass**
   - 访问 [MongoDB Compass 下载页面](https://www.mongodb.com/try/download/compass)
   - 选择适合您操作系统的版本并下载

2. **安装 MongoDB Compass**
   - 运行安装程序并按照提示完成安装

3. **连接到数据库**
   - 打开 MongoDB Compass
   - 在 "New Connection" 窗口中，粘贴完整的 MongoDB URI：
     ```
     mongodb+srv://18223402922_db_user:55Yj0CQhFwoZ5fze@job-platform-cluster.7c8krno.mongodb.net/?appName=job-platform-cluster
     ```
   - 点击 "Connect" 按钮

### 使用方法

1. **浏览数据库**
   - 在左侧导航栏中，您将看到所有可用的数据库
   - 展开数据库以查看集合（类似表格）
   - 点击集合以查看其中的文档（类似记录）

2. **查询数据**
   - 在集合视图中，您可以使用过滤器来查询特定数据
   - 支持 MongoDB 查询语法

3. **修改数据**
   - 可以直接在界面中编辑文档
   - 支持添加、更新和删除操作

## 方法二：使用 MongoDB Atlas 网页界面

MongoDB Atlas 提供了网页界面，您可以直接在浏览器中管理数据库。

### 访问步骤

1. **访问 MongoDB Atlas**
   - 打开浏览器，访问 [MongoDB Atlas](https://cloud.mongodb.com/)
   - 使用您的 MongoDB Atlas 账号登录

2. **找到您的集群**
   - 在左侧导航栏中，点击 "Database"
   - 找到名为 "job-platform-cluster" 的集群

3. **查看数据**
   - 点击集群旁边的 "Browse Collections" 按钮
   - 您将看到所有数据库和集合
   - 点击集合以查看其中的数据

## 方法三：使用命令行工具

如果您喜欢使用命令行，可以使用 MongoDB Shell (mongosh)。

### 安装步骤

1. **下载并安装 MongoDB Shell**
   - 访问 [MongoDB Shell 下载页面](https://www.mongodb.com/try/download/shell)
   - 选择适合您操作系统的版本并下载
   - 按照安装说明完成安装

### 连接和使用

1. **连接到数据库**
   ```bash
   mongosh "mongodb+srv://18223402922_db_user:55Yj0CQhFwoZ5fze@job-platform-cluster.7c8krno.mongodb.net/?appName=job-platform-cluster"
   ```

2. **查看数据库**
   ```bash
   show dbs
   ```

3. **选择数据库**
   ```bash
   use <database_name>
   ```

4. **查看集合**
   ```bash
   show collections
   ```

5. **查询数据**
   ```bash
   db.<collection_name>.find()
   ```

6. **限制结果数量**
   ```bash
   db.<collection_name>.find().limit(10)
   ```

## 方法四：使用项目 API 端点

项目提供了一些 API 端点，可以用于查看数据库中的数据。

### 可用的 API 端点

1. **查看所有岗位**
   - 端点：`GET /api/jobs`
   - 响应：返回所有岗位数据

2. **查看特定岗位**
   - 端点：`GET /api/jobs?id=<job_id>`
   - 响应：返回指定 ID 的岗位数据

### 测试 API 端点

您可以使用以下工具测试这些 API 端点：

1. **使用 curl**
   ```bash
   curl "http://localhost:3001/api/jobs"
   ```

2. **使用 Postman**
   - 下载并安装 [Postman](https://www.postman.com/)
   - 创建新的 GET 请求
   - 输入 URL：`http://localhost:3001/api/jobs`
   - 点击 "Send" 按钮

3. **使用浏览器**
   - 直接在浏览器中访问：`http://localhost:3001/api/jobs`

## 数据库结构

项目中可能包含以下数据库和集合：

### 主要集合

1. **Job**
   - 存储岗位信息
   - 字段：id, title, company, location, salary, description, requirements, skills, etc.

2. **User**
   - 存储用户信息
   - 字段：id, name, email, password, profile, preferences, etc.

3. **Application**
   - 存储岗位申请信息
   - 字段：id, userId, jobId, status, applicationDate, etc.

4. **Admin**
   - 存储管理员信息
   - 字段：id, name, email, password, role, permissions, etc.

5. **EnterpriseUser**
   - 存储企业用户信息
   - 字段：id, companyName, contactPerson, email, password, etc.

## 故障排除

### 连接问题

1. **网络连接**
   - 确保您的网络连接稳定
   - 检查防火墙设置，确保 MongoDB 端口（27017）未被阻止

2. **认证错误**
   - 确保 MongoDB URI 中的用户名和密码正确
   - 检查用户是否有适当的权限

3. **集群状态**
   - 登录 MongoDB Atlas，检查集群状态是否正常
   - 查看是否有任何警报或错误消息

### 查询问题

1. **查询语法**
   - 确保您使用的是正确的 MongoDB 查询语法
   - 参考 [MongoDB 文档](https://docs.mongodb.com/manual/tutorial/query-documents/)

2. **性能问题**
   - 对于大型集合，使用索引来提高查询性能
   - 限制返回的结果数量

## 最佳实践

1. **备份数据**
   - 定期备份您的 MongoDB 数据
   - MongoDB Atlas 提供了自动备份功能

2. **安全措施**
   - 不要在代码中硬编码 MongoDB 连接字符串
   - 使用环境变量存储敏感信息
   - 定期更新密码和访问密钥

3. **性能优化**
   - 为常用查询创建索引
   - 避免在生产环境中执行复杂的聚合查询

4. **监控**
   - 使用 MongoDB Atlas 监控工具监控数据库性能
   - 设置警报以检测异常情况

## 相关资源

- [MongoDB 官方文档](https://docs.mongodb.com/)
- [MongoDB Compass 文档](https://docs.mongodb.com/compass/)
- [MongoDB Atlas 文档](https://docs.atlas.mongodb.com/)
- [MongoDB Shell 文档](https://docs.mongodb.com/mongodb-shell/)

---

通过以上方法，您可以轻松查看和管理项目的 MongoDB 数据。如果您遇到任何问题，请参考相关文档或寻求技术支持。