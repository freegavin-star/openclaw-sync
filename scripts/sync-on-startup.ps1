# 启动时拉取云端最新数据
# 放在 OpenClaw 启动时执行

cd C:/Users/gupo/.openclaw/workspace

Write-Host "正在从云端同步最新数据..."
git pull origin master --rebase
Write-Host "同步完成"
