module.exports = {
  apps: [
    {
      name: 'xemtuvi',
      cwd: __dirname,
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000 -H 127.0.0.1',
      exec_mode: 'cluster', // reload chạy tiến trình mới trước rồi mới tắt cũ: không rớt yêu cầu
      instances: 1,
      env: { NEXT_DIST_DIR: process.env.NEXT_DIST_DIR || '.next', NODE_ENV: 'production', SITE_NOINDEX: process.env.SITE_NOINDEX || '1', DANG_NHAP_THU: '1', CONG_THANH_TOAN: 'gia_lap', THU_KIN_MOI_TAT: '1' }, // thử kín 16/11: tắt /moi
      max_memory_restart: '600M',
    },
  ],
};
