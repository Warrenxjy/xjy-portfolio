/* =========================================================
   薛嘉耀作品集网站交互
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // 子页面：返回按钮默认行为
  document.querySelectorAll('.back-btn').forEach((btn) => {
    if (!btn.getAttribute('href')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '../index.html';
      });
    }
  });
});
