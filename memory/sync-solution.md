# 双节点同步方案

## 问题
- 本地 OpenClaw（白天使用，电脑关机后不可用）
- 云端 OpenClaw（24小时可用）
- 两边通过飞书对接，需要保持数据和记忆同步

## 解决方案

### 方案一：云端作为主存储（推荐）

**架构：**
```
本地 OpenClaw ←→ 云端 OpenClaw（主存储）
     ↓                    ↓
   飞书用户              飞书用户
```

**同步机制：**
1. **MEMORY.md 和记忆文件** 存放在云端
2. **本地节点** 每次启动时从云端拉取最新记忆
3. **本地节点** 每次修改后推送到云端
4. **云端节点** 始终保持最新状态

**实现方式：**
- 使用 Git 同步（GitHub/GitLab/私有仓库）
- 或使用云存储同步（OneDrive/坚果云/iCloud）
- 或使用自建同步服务

### 方案二：双向实时同步

**架构：**
```
本地 OpenClaw ←→ 同步服务 ←→ 云端 OpenClaw
     ↓                              ↓
   飞书用户                        飞书用户
```

**实现方式：**
- 使用 Syncthing 实时同步文件夹
- 或使用 rsync + 定时任务

### 方案三：数据库/Redis 共享

- 两边共用同一个数据库（云端部署）
- 记忆统一存储，两边只读/写

---

## 推荐实施方案

### 步骤 1：选择同步方式
**Git 方式（最简单）：**
```bash
# 1. 在云端 workspace 初始化 Git 仓库
cd ~/.openclaw/workspace
git init
git add .
git commit -m "init"

# 2. 推送到 GitHub/GitLab（私有仓库）
git remote add origin <你的仓库地址>
git push -u origin main
```

### 步骤 2：本地配置自动同步
在本地 OpenClaw 的 workspace 添加同步脚本：

**sync.sh（Linux/Mac）或 sync.ps1（Windows）：**
```powershell
# 启动时拉取
git pull origin main

# 修改后推送（可设置定时或手动）
git add .
git commit -m "update $(date)"
git push origin main
```

### 步骤 3：配置 OpenClaw 自动执行
在 HEARTBEAT.md 或定时任务中添加：
- 启动时自动 `git pull`
- 定期（如每30分钟）自动 `git push`

### 步骤 4：冲突处理
如果两边同时修改，Git 会提示冲突，需要手动解决。

---

## 需要同步的文件

**必须同步：**
- `MEMORY.md` - 长期记忆
- `memory/*.md` - 每日记忆
- `IDENTITY.md` - 身份配置
- `USER.md` - 用户信息
- `AGENTS.md` - 工作规则

**可选同步：**
- `TOOLS.md` - 本地工具配置（可能有差异）
- 项目文件 - 视情况而定

**不同步：**
- 日志文件
- 临时文件
- 本地特有的配置文件

---

## 下一步

1. 确认你有 GitHub/GitLab 账号（或私有 Git 服务）
2. 选择本地和云端都能访问的同步方式
3. 我帮你配置具体的同步脚本

你想用哪种方式？Git 还是云盘同步？