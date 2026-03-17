# 自动同步脚本 - 每30分钟执行一次
# 将此脚本添加到定时任务或 Heartbeat

cd C:/Users/gupo/.openclaw/workspace

# 检查是否有变更
$status = git status --porcelain
if ($status) {
    # 有变更，提交并推送
    git add MEMORY.md memory/ AGENTS.md SOUL.md USER.md IDENTITY.md TOOLS.md
    git commit -m "Auto sync: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    git push origin master
    Write-Host "已同步到云端: $(Get-Date)"
} else {
    Write-Host "无变更，跳过同步: $(Get-Date)"
}

# 拉取云端最新变更（防止云端有更新）
git pull origin master --rebase
