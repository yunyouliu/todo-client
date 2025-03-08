// src/utils/cookie.ts
export function setCookie(
  name: string, 
  value: string, 
  options: { 
    expires?: number, // 天数
    path?: string,
    domain?: string,
    secure?: boolean
  } = {}
) {
  let cookie = `${name}=${encodeURIComponent(value)}`;

  // 设置过期时间
  if (options.expires) {
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + options.expires);
    cookie += `; expires=${expiresDate.toUTCString()}`;
  }

  // 设置路径
  cookie += `; path=${options.path || '/'}`;

  // 设置域名
  if (options.domain) {
    cookie += `; domain=${options.domain}`;
  }

  // 仅在 HTTPS 下设置 Secure
  if (options.secure && location.protocol === 'https:') {
    cookie += '; Secure';
  }

  document.cookie = cookie;
}

// 其他函数保持不变