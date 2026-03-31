// 小古健康 SOP 演示 - 核心逻辑

// 状态管理
const state = {
    currentRole: 'patient',
    patient: {
        registered: false,
        planReceived: false,
        checkins: { breakfast: false, lunch: false, exercise: false },
        healthPoints: 0
    },
    currentStep: 1
};

// 工具函数
function log(message, type = 'normal') {
    const container = document.getElementById('log-container');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    
    const now = new Date();
    const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    entry.innerHTML = `<span class="timestamp">[${time}]</span>${message}`;
    container.appendChild(entry);
    container.scrollTop = container.scrollHeight;
}

function updateStep(step) {
    state.currentStep = step;
    document.querySelectorAll('.flow-step').forEach(el => {
        const elStep = parseInt(el.dataset.step);
        el.classList.remove('active', 'completed');
        if (elStep === step) {
            el.classList.add('active');
        } else if (elStep < step) {
            el.classList.add('completed');
        }
    });
}

// 角色切换
document.querySelectorAll('.role-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const role = tab.dataset.role;
        state.currentRole = role;
        
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.querySelector(`.${role}-panel`).classList.add('active');
        
        log(`切换到 ${role === 'patient' ? '患者' : role === 'manager' ? '健管师' : '医生'} 视角`, 'system');
    });
});

// 患者端模拟
function simulateRegister() {
    const result = document.getElementById('register-result');
    const card = document.getElementById('action-register');
    
    log('患者开始注册流程...');
    
    // 模拟上传体检报告
    result.innerHTML = '<p>📤 上传体检报告中...</p>';
    setTimeout(() => {
        result.innerHTML += '<p>📊 AI 正在解析体检数据...</p>';
        
        setTimeout(() => {
            result.innerHTML = `
                <div class="report-result">
                    <p>✅ 风险评估完成！</p>
                    <div style="background:#f0f0f0;padding:10px;border-radius:8px;margin-top:10px;">
                        <p><strong>健康风险评估报告</strong></p>
                        <p>风险等级：🟡 中危</p>
                        <p>空腹血糖：6.8 mmol/L（偏高）</p>
                        <p>建议：购买服务包进行个性化管理</p>
                    </div>
                </div>
            `;
            card.querySelector('.card-status').className = 'card-status done';
            card.querySelector('.card-status').textContent = '已完成';
            
            state.patient.registered = true;
            
            // 启用下一步
            document.querySelector('#action-plan button').disabled = false;
            
            updateStep(2);
            log('✅ 风险评估完成，已通知健管师', 'success');
            
            // 模拟健管师收到通知
            setTimeout(() => {
                const msgList = document.getElementById('msg-list');
                const newMsg = document.createElement('div');
                newMsg.className = 'msg msg-patient';
                newMsg.textContent = '系统：患者张先生已完成评估，等待制定方案';
                msgList.appendChild(newMsg);
                document.querySelector('.patient-item:first-child .patient-status').textContent = '待制定方案';
            }, 1000);
            
        }, 1500);
    }, 1000);
}

function showHealthPlan() {
    const result = document.getElementById('plan-result');
    const card = document.getElementById('action-plan');
    
    result.innerHTML = `
        <div class="health-plan">
            <h4>📋 个性化健康管理方案</h4>
            <div style="margin-top:10px;">
                <p><strong>🍽️ 推荐食材</strong></p>
                <div style="display:flex;gap:5px;flex-wrap:wrap;margin:5px 0;">
                    <span class="tag tag-green">全麦面包</span>
                    <span class="tag tag-green">西兰花</span>
                    <span class="tag tag-green">三文鱼</span>
                    <span class="tag tag-green">糙米</span>
                    <span class="tag tag-green">苦瓜</span>
                </div>
                
                <p><strong>🚫 不推荐</strong></p>
                <div style="display:flex;gap:5px;flex-wrap:wrap;margin:5px 0;">
                    <span class="tag tag-red">白米饭</span>
                    <span class="tag tag-red">糖果</span>
                    <span class="tag tag-red">碳酸饮料</span>
                    <span class="tag tag-red">油炸食品</span>
                </div>
                
                <p><strong>🏃 推荐运动</strong></p>
                <div style="display:flex;gap:5px;flex-wrap:wrap;margin:5px 0;">
                    <span class="tag tag-yellow">快走 30分钟/天</span>
                    <span class="tag tag-yellow">游泳 20分钟/天</span>
                </div>
            </div>
        </div>
    `;
    
    card.querySelector('.card-status').className = 'card-status done';
    card.querySelector('.card-status').textContent = '已接收';
    
    state.patient.planReceived = true;
    
    // 启用打卡
    document.querySelector('#action-checkin .btn-success').disabled = false;
    
    updateStep(3);
    log('📋 患者接收健康管理方案', 'success');
}

function simulateCheckin(type) {
    const typeNames = { breakfast: '早餐', lunch: '午餐', exercise: '运动' };
    const checkins = { breakfast: false, lunch: false, exercise: false };
    
    state.patient.checkins[type] = true;
    state.patient.healthPoints += 10;
    
    document.getElementById('health-points').textContent = state.patient.healthPoints;
    
    const result = document.getElementById('checkin-result');
    result.innerHTML = `
        <p style="color:#4CAF50;">✅ ${typeNames[type]}打卡成功！+10 健康值</p>
        <p>当前健康值：${state.patient.healthPoints}</p>
    `;
    
    log(`✅ 患者完成${typeNames[type]}打卡，+10健康值`, 'success');
    
    // 检查是否全部打卡
    const allDone = state.patient.checkins.breakfast && 
                    state.patient.checkins.lunch && 
                    state.patient.checkins.exercise;
    
    if (allDone) {
        document.getElementById('action-checkin').querySelector('.card-status').className = 'card-status done';
        document.getElementById('action-checkin').querySelector('.card-status').textContent = '已完成';
        
        // 启用续约
        document.querySelector('#action-renew button').disabled = false;
        
        updateStep(4);
        log('🎉 患者完成今日所有打卡任务！', 'success');
    }
}

function simulateRenew() {
    const result = document.getElementById('renew-result');
    const card = document.getElementById('action-renew');
    
    result.innerHTML = `
        <div style="color:#4CAF50;">
            <p>✅ 续约成功！</p>
            <p>服务周期已延长至 2026-06-30</p>
            <p>原方案已自动续期</p>
        </div>
    `;
    
    card.querySelector('.card-status').className = 'card-status done';
    card.querySelector('.card-status').textContent = '已续约';
    
    log('🔄 患者成功续约服务', 'success');
}

// 医生端
function sendPlanToPatient() {
    log('📤 医生发送健康管理方案给患者...', 'normal');
    
    setTimeout(() => {
        // 更新患者端显示
        const patientCard = document.getElementById('action-plan');
        if (!state.patient.planReceived) {
            patientCard.querySelector('.card-status').className = 'card-status';
            patientCard.querySelector('.card-status').textContent = '新方案';
            patientCard.querySelector('.card-status').style.background = '#cce5ff';
            patientCard.querySelector('.card-status').style.color = '#004085';
            
            log('📱 患者收到新方案通知', 'success');
        }
        
        // 添加日志消息
        const msgList = document.getElementById('msg-list');
        const newMsg = document.createElement('div');
        newMsg.className = 'msg msg-system';
        newMsg.textContent = '👨‍⚕️ 医生已更新健康管理方案';
        msgList.appendChild(newMsg);
        
        log('✅ 方案发送成功', 'success');
    }, 1000);
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    log('🏥 小古健康 SOP 演示系统已启动', 'system');
    log('请从「角色体验」中选择视角开始演示', 'system');
    
    // 默认激活第一步
    updateStep(1);
});
